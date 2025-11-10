'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TECHNOLOGY_CATEGORIES: Record<string, { name: string; description: string }[]> = {
  'Core Runtime': [
    { name: 'Node.js', description: 'LTS support for server-side rendering and API routes.' },
    { name: 'Deno', description: 'Secure runtime for edge compute workloads.' },
    { name: 'Bun', description: 'High-performance JavaScript runtime for tooling.' },
  ],
  Frameworks: [
    { name: 'NestJS', description: 'Monolith-first framework with modular architecture.' },
    { name: 'Express', description: 'Minimalist HTTP layer for custom monoliths.' },
    { name: 'Fastify', description: 'High throughput web framework with schema validation.' },
  ],
  Databases: [
    { name: 'PostgreSQL', description: 'Relational database with advanced features and reliability.' },
    { name: 'MySQL', description: 'Mature relational database with wide tooling support.' },
    { name: 'MongoDB', description: 'Document store for schema-flexible modules.' },
  ],
  Messaging: [
    { name: 'BullMQ', description: 'Queueing for background jobs inside the monolith.' },
    { name: 'Redis', description: 'In-memory data store and pub/sub.' },
    { name: 'RabbitMQ', description: 'Message broker for higher reliability queuing.' },
  ],
  Observability: [
    { name: 'OpenTelemetry', description: 'Instrumentation standard for metrics, traces, logs.' },
    { name: 'Grafana', description: 'Visualization and dashboarding for metrics.' },
    { name: 'Prometheus', description: 'Time-series database for metrics collection.' },
  ],
};

export type TechnologySelectorProps = {
  selected: string[];
  onChange: (values: string[]) => void;
};

export function TechnologySelector({ selected, onChange }: TechnologySelectorProps) {
  const toggle = (name: string) => {
    onChange(selected.includes(name) ? selected.filter((item) => item !== name) : [...selected, name]);
  };

  return (
    <div className="space-y-6">
      {Object.entries(TECHNOLOGY_CATEGORIES).map(([category, items]) => (
        <Card key={category} className="bg-secondary/30">
          <CardContent className="space-y-4 py-4">
            <header className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{category}</h3>
                <p className="text-xs text-muted-foreground">Select one or more technologies that align with your delivery preferences.</p>
              </div>
              <Badge variant="outline">{items.length} options</Badge>
            </header>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((tech) => {
                const isChecked = selected.includes(tech.name);
                return (
                  <label key={tech.name} className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background/80 p-3 shadow-sm transition hover:border-primary focus-within:border-primary">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggle(tech.name)}
                      className="mt-1"
                      aria-label={`Select ${tech.name}`}
                    />
                    <div>
                      <Label className="text-sm font-semibold text-foreground">{tech.name}</Label>
                      <p className="text-xs text-muted-foreground">{tech.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
