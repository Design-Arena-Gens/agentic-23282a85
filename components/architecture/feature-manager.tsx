'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import type { ArchitectureFeature } from '@/types';
import { cn } from '@/lib/utils';

export type FeatureManagerProps = {
  features: ArchitectureFeature[];
  onChange: (features: ArchitectureFeature[]) => void;
};

export function FeatureManager({ features, onChange }: FeatureManagerProps) {
  const [draft, setDraft] = useState({ name: '', description: '' });

  const handleAdd = () => {
    if (!draft.name.trim() || !draft.description.trim()) {
      return;
    }

    const identifier = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);

    onChange([
      ...features,
      {
        id: identifier,
        name: draft.name.trim(),
        description: draft.description.trim(),
      },
    ]);

    setDraft({ name: '', description: '' });
  };

  const handleRemove = (id: string) => {
    onChange(features.filter((feature) => feature.id !== id));
  };

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="feature-name">Feature name</Label>
          <Input
            id="feature-name"
            placeholder="e.g. Subscription billing"
            value={draft.name}
            onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="feature-description">Description</Label>
          <Textarea
            id="feature-description"
            placeholder="Describe the feature goals, users, and success criteria"
            value={draft.description}
            onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
          />
        </div>
      </div>
      <Button type="button" onClick={handleAdd} className="w-full sm:w-auto">
        Add Feature
      </Button>
      <ul className="grid gap-3">
        {features.map((feature) => (
          <li key={feature.id}>
            <Card className="bg-secondary/40">
              <CardContent className="space-y-3 py-4">
                <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{feature.name}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => handleRemove(feature.id)}>
                    Remove
                  </Button>
                </header>
                <dl className={cn('grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2')}>
                  <div>
                    <dt className="font-medium text-foreground">Identifier</dt>
                    <dd>{feature.id}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">Status</dt>
                    <dd>Included in scope</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
