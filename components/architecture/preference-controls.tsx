'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const COMPLIANCE_OPTIONS = [
  'PCI DSS',
  'SOC 2',
  'GDPR',
  'HIPAA',
];

export type PreferenceControlsProps = {
  availabilityTarget: string;
  latencyBudget: string;
  compliance: string[];
  onChange: (preferences: { availabilityTarget: string; latencyBudget: string; compliance: string[] }) => void;
};

export function PreferenceControls({ availabilityTarget, latencyBudget, compliance, onChange }: PreferenceControlsProps) {
  const update = (patch: Partial<PreferenceControlsProps>) => {
    onChange({
      availabilityTarget,
      latencyBudget,
      compliance,
      ...patch,
    });
  };

  const toggleCompliance = (option: string) => {
    update({
      compliance: compliance.includes(option)
        ? compliance.filter((value) => value !== option)
        : [...compliance, option],
    });
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="availability-target">Availability target (e.g. 99.9%)</Label>
        <Input
          id="availability-target"
          placeholder="99.9%"
          inputMode="decimal"
          value={availabilityTarget}
          onChange={(event) => update({ availabilityTarget: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="latency-budget">Latency budget (ms)</Label>
        <Input
          id="latency-budget"
          placeholder="100"
          inputMode="numeric"
          value={latencyBudget}
          onChange={(event) => update({ latencyBudget: event.target.value })}
        />
      </div>
      <fieldset className="space-y-2 sm:col-span-2">
        <legend className="text-sm font-semibold text-foreground">Compliance requirements</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {COMPLIANCE_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
              <Checkbox
                checked={compliance.includes(option)}
                onCheckedChange={() => toggleCompliance(option)}
                aria-label={`Toggle ${option}`}
              />
              <span className="text-sm text-foreground">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
