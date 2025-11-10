export type AgentMessage = {
  id: string;
  agent: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'progress';
  content: string;
  timestamp: string;
  metrics?: Record<string, string | number>;
};

export type ArchitectureFeature = {
  id: string;
  name: string;
  description: string;
};

export type ArchitecturePlan = {
  projectName: string;
  summary: string;
  architecture: string;
  decisions: string[];
  risks: string[];
  mitigation: string[];
  verificationChecklist: string[];
  acceptanceCriteria: string[];
  metrics: {
    agentLatencyMs: number;
    selfCorrectionRate: number;
    generationTimeMs: number;
    verificationCoverage: number;
    systemAvailability: number;
  };
};

export type SupervisorEvent =
  | { type: 'start'; payload: { sessionId: string } }
  | { type: 'message'; payload: AgentMessage }
  | { type: 'metrics'; payload: ArchitecturePlan['metrics'] }
  | { type: 'complete'; payload: { plan: ArchitecturePlan } }
  | { type: 'error'; payload: { message: string } };

export type ArchitectureRequestPayload = {
  projectName: string;
  projectDescription: string;
  features: ArchitectureFeature[];
  technologies: string[];
  preferences: {
    availabilityTarget: string;
    latencyBudget: string;
    compliance: string[];
  };
};
