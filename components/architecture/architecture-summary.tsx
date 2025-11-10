'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ArchitecturePlan } from '@/types';
import ReactMarkdown from 'react-markdown';

export type ArchitectureSummaryProps = {
  plan?: ArchitecturePlan;
};

export function ArchitectureSummary({ plan }: ArchitectureSummaryProps) {
  if (!plan) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.projectName}</CardTitle>
        <CardDescription>Comprehensive monolithic architecture blueprint with full verification coverage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-foreground">Summary</h3>
          <p className="text-sm text-muted-foreground">{plan.summary}</p>
        </section>
        <section>
          <h3 className="text-sm font-semibold text-foreground">Architecture Narrative</h3>
          <div className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground">
            <ReactMarkdown>{plan.architecture}</ReactMarkdown>
          </div>
        </section>
        <section className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Architectural decisions</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {plan.decisions.length === 0 ? <li>No additional adjustments required.</li> : null}
              {plan.decisions.map((decision) => (
                <li key={decision} className="rounded-md border border-border/80 bg-muted/50 px-3 py-2">
                  {decision}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Risks & mitigation</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {plan.risks.length === 0 ? (
                <li className="rounded-md border border-border/60 bg-secondary/40 px-3 py-2 text-foreground/80">
                  No critical risks recorded.
                </li>
              ) : null}
              {plan.risks.map((risk) => (
                <li key={risk} className="rounded-md border border-border/80 bg-destructive/5 px-3 py-2 text-destructive">
                  {risk}
                </li>
              ))}
              {plan.mitigation.length === 0 ? null : (
                <li className="pt-2 text-xs uppercase tracking-wide text-muted-foreground">Mitigation</li>
              )}
              {plan.mitigation.map((entry) => (
                <li key={entry} className="rounded-md border border-border/80 bg-emerald-500/10 px-3 py-2 text-emerald-700">
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Verification checklist</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {plan.verificationChecklist.map((item) => (
                <li key={item} className="rounded-md border border-border/60 bg-secondary/30 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Acceptance criteria</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {plan.acceptanceCriteria.map((item) => (
                <li key={item} className="rounded-md border border-border/60 bg-secondary/30 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
