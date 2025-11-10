'use client';

import { useState, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { RichTextEditor } from '@/components/architecture/rich-text-editor';
import { FeatureManager } from '@/components/architecture/feature-manager';
import { TechnologySelector } from '@/components/architecture/technology-selector';
import { AgentLog } from '@/components/architecture/agent-log';
import { MetricsPanel } from '@/components/architecture/metrics-panel';
import { ArchitectureSummary } from '@/components/architecture/architecture-summary';
import { DownloadButtons } from '@/components/architecture/download-buttons';
import { PreferenceControls } from '@/components/architecture/preference-controls';
import type { AgentMessage, ArchitectureFeature, ArchitecturePlan, ArchitectureRequestPayload, SupervisorEvent } from '@/types';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  projectName: z.string().min(3, 'Enter a project name'),
  projectDescription: z.string().min(30, 'The description must provide detailed context'),
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_PREFERENCES = {
  availabilityTarget: '99.9%',
  latencyBudget: '100',
  compliance: ['SOC 2'],
};

export default function HomePage() {
  const [features, setFeatures] = useState<ArchitectureFeature[]>([]);
  const [technologies, setTechnologies] = useState<string[]>(['Node.js', 'NestJS', 'PostgreSQL']);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [plan, setPlan] = useState<ArchitecturePlan | undefined>();
  const [metrics, setMetrics] = useState<ArchitecturePlan['metrics'] | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      projectName: '',
      projectDescription: '',
    },
  });

  const projectName = form.watch('projectName');
  const projectDescription = form.watch('projectDescription');

  const isFormValid = useMemo(() => {
    return Boolean(projectName && projectDescription && features.length > 0 && technologies.length > 0);
  }, [projectName, projectDescription, features.length, technologies.length]);

  const resetOutputs = useCallback(() => {
    setMessages([]);
    setPlan(undefined);
    setMetrics(undefined);
    setProgress(0);
    setErrorMessage(null);
    setSessionId(null);
  }, []);

  const handleSupervisorStream = useCallback(async (payload: ArchitectureRequestPayload) => {
    setIsProcessing(true);
    resetOutputs();

    const response = await fetch('/api/architecture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok || !response.body) {
      const message = 'Unable to orchestrate architecture plan. Please try again.';
      setErrorMessage(message);
      setIsProcessing(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    setProgress(5);

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer.trim()) {
          const event = JSON.parse(buffer) as SupervisorEvent;
          if (event.type === 'complete') {
            setPlan(event.payload.plan);
            setProgress(100);
          }
          if (event.type === 'metrics') {
            setMetrics(event.payload);
          }
          if (event.type === 'error') {
            setErrorMessage(event.payload.message);
          }
        }
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line) as SupervisorEvent;

        if (event.type === 'start') {
          setSessionId(event.payload.sessionId);
          setProgress(15);
        }

        if (event.type === 'message') {
          setMessages((previous) => [...previous, event.payload]);
          setProgress((previous) => Math.min(90, previous + 12));
        }

        if (event.type === 'metrics') {
          setMetrics(event.payload);
          setProgress((previous) => Math.max(previous, 92));
        }

        if (event.type === 'complete') {
          setPlan(event.payload.plan);
          setProgress(100);
        }

        if (event.type === 'error') {
          setErrorMessage(event.payload.message);
          setProgress(0);
        }
      }
    }

    setIsProcessing(false);
  }, [resetOutputs]);

  const onSubmit = form.handleSubmit(async (values) => {
    await handleSupervisorStream({
      projectName: values.projectName,
      projectDescription: values.projectDescription,
      features,
      technologies,
      preferences,
    });
  });

  return (
    <main className="container grid gap-6 py-10 lg:grid-cols-[3fr_2fr]">
      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Supervisor input workspace</CardTitle>
            <CardDescription>
              Provide project context, prioritize features, and align preferences. The supervisor agent will coordinate specialists for architecture delivery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6" onSubmit={onSubmit} noValidate>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Software Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="e.g. Nimbus Commerce Platform"
                    aria-describedby="project-name-description"
                    {...form.register('projectName')}
                  />
                  <p id="project-name-description" className="text-xs text-muted-foreground">
                    Provide an internal project identifier. This is used to label generated artifacts.
                  </p>
                  {form.formState.errors.projectName ? (
                    <p className="text-xs text-destructive">{form.formState.errors.projectName.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-description">Project Description</Label>
                  <Controller
                    control={form.control}
                    name="projectDescription"
                    render={({ field }) => (
                      <RichTextEditor
                        id="project-description"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        describedBy="project-description-help"
                      />
                    )}
                  />
                  <p id="project-description-help" className="text-xs text-muted-foreground">
                    Share problem statements, business drivers, domain nuances, and any integration constraints.
                  </p>
                  {form.formState.errors.projectDescription ? (
                    <p className="text-xs text-destructive">{form.formState.errors.projectDescription.message}</p>
                  ) : null}
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-base font-semibold text-foreground">Feature list</h2>
                  <Badge variant="secondary">{features.length} in scope</Badge>
                </div>
                <FeatureManager features={features} onChange={setFeatures} />
              </div>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">Preferred technology stack</h2>
                <TechnologySelector selected={technologies} onChange={setTechnologies} />
              </div>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">Operational preferences</h2>
                <PreferenceControls
                  availabilityTarget={preferences.availabilityTarget}
                  latencyBudget={preferences.latencyBudget}
                  compliance={preferences.compliance}
                  onChange={setPreferences}
                />
              </div>
              <div className="space-y-3">
                <Button type="submit" disabled={!isFormValid || isProcessing} className="w-full sm:w-auto">
                  {isProcessing ? 'Coordinating agents…' : 'Generate architecture blueprint'}
                </Button>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    {sessionId ? <span>Session: {sessionId}</span> : null}
                  </div>
                  <Progress value={progress} indeterminate={isProcessing && progress === 0} aria-label="Agent processing progress" />
                  {errorMessage ? <p className="text-xs text-destructive">{errorMessage}</p> : null}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="logs">Agent logs</TabsTrigger>
            <TabsTrigger value="metrics">Performance metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="logs">
            <AgentLog messages={messages} />
          </TabsContent>
          <TabsContent value="metrics">
            <MetricsPanel metrics={metrics} />
          </TabsContent>
        </Tabs>
      </section>
      <aside className="space-y-6">
        <ArchitectureSummary plan={plan} />
        <DownloadButtons plan={plan} />
      </aside>
    </main>
  );
}
