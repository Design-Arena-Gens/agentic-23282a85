import { NextResponse } from 'next/server';
import { z } from 'zod';
import { orchestrateArchitecture } from '@/lib/agents';
import type { SupervisorEvent } from '@/types';
import { TelemetryLogger } from '@/lib/logger';

const logger = new TelemetryLogger('api.architecture');

export const runtime = 'nodejs';

const requestSchema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters').max(120),
  projectDescription: z.string().min(30, 'Provide a richer description to guide the agents'),
  features: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(3, 'Feature name must be descriptive'),
        description: z.string().min(10, 'Feature description must cover intent'),
      }),
    )
    .min(1, 'Add at least one feature'),
  technologies: z.array(z.string()).min(1, 'Select at least one technology'),
  preferences: z.object({
    availabilityTarget: z.string().min(1),
    latencyBudget: z.string().min(1),
    compliance: z.array(z.string()),
  }),
});

export async function POST(req: Request) {
  let payload: z.infer<typeof requestSchema>;
  try {
    const body = await req.json();
    payload = requestSchema.parse(body);
  } catch (error) {
    const message = error instanceof z.ZodError ? error.issues.map((issue) => issue.message).join(', ') : 'Invalid request body';
    logger.warn('Request validation failed', { message });
    return NextResponse.json({ error: message }, { status: 400 });
  }

  logger.info('Supervisor session initiated', { projectName: payload.projectName });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const pushEvent = (event: SupervisorEvent) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        await orchestrateArchitecture(payload, (event) => {
          pushEvent(event);
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected error';
        logger.error('Supervisor execution failed', { message });
        pushEvent({ type: 'error', payload: { message } });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/jsonl; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
