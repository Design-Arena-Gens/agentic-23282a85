'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ArchitecturePlan } from '@/types';

export type MetricsPanelProps = {
  metrics?: ArchitecturePlan['metrics'];
};

const METRIC_LABELS: Record<keyof ArchitecturePlan['metrics'], { label: string; format: (value: number) => string }> = {
  agentLatencyMs: { label: 'Agent Communication Latency', format: (value) => `${value.toFixed(0)} ms` },
  selfCorrectionRate: { label: 'Self-Correction Success Rate', format: (value) => `${(value * 100).toFixed(0)}%` },
  generationTimeMs: { label: 'Architecture Generation Time', format: (value) => `${(value / 1000).toFixed(1)} s` },
  verificationCoverage: { label: 'Verification Coverage', format: (value) => `${(value * 100).toFixed(0)}%` },
  systemAvailability: { label: 'System Availability', format: (value) => `${(value * 100).toFixed(2)}%` },
};

const PERFORMANCE_TARGETS: Partial<Record<keyof ArchitecturePlan['metrics'], number>> = {
  agentLatencyMs: 100,
  selfCorrectionRate: 0.85,
  generationTimeMs: 5 * 60 * 1000,
  verificationCoverage: 1,
  systemAvailability: 0.999,
};

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  if (!metrics) {
    return null;
  }

  return (
    <Card className="bg-secondary/40">
      <CardHeader>
        <CardTitle>System performance</CardTitle>
        <CardDescription>Real-time metrics captured from the latest architecture run.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {(Object.keys(metrics) as Array<keyof ArchitecturePlan['metrics']>).map((key) => {
          const metricValue = metrics[key];
          const { label, format } = METRIC_LABELS[key];
          const target = PERFORMANCE_TARGETS[key];

          const percentage = (() => {
            if (key === 'agentLatencyMs' || key === 'generationTimeMs') {
              return Math.min(100, (target ?? metricValue) / metricValue * 100);
            }
            return Math.min(100, (metricValue / (target ?? 1)) * 100);
          })();

          return (
            <div key={key} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium text-foreground">{label}</span>
                <span className="text-muted-foreground">{format(metricValue)}</span>
              </div>
              <Progress value={percentage} aria-label={`${label} progress`} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
