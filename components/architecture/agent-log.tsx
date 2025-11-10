'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import type { AgentMessage } from '@/types';
import { cn } from '@/lib/utils';

const variantMap: Record<AgentMessage['type'], 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  info: 'secondary',
  warning: 'warning',
  error: 'destructive',
  success: 'success',
  progress: 'secondary',
};

export type AgentLogProps = {
  messages: AgentMessage[];
};

export function AgentLog({ messages }: AgentLogProps) {
  return (
    <ScrollArea className="h-[360px] rounded-lg border bg-background shadow-inner">
      <ul className="flex flex-col gap-3 p-4">
        {messages.map((message) => (
          <li key={message.id} className="rounded-md border border-border/70 bg-card p-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={variantMap[message.type]}>{message.agent}</Badge>
                <span className="text-sm font-medium text-foreground">{message.content}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </span>
            </div>
            {message.metrics && Object.keys(message.metrics).length > 0 ? (
              <dl className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                {Object.entries(message.metrics).map(([key, value]) => (
                  <div key={key} className={cn('flex items-center justify-between gap-2 rounded-sm bg-muted/50 px-2 py-1')}>
                    <dt className="font-medium text-foreground/80">{key}</dt>
                    <dd>{String(value)}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
