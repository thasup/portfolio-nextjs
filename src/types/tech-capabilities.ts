export type CapabilityId = 'frontend' | 'fullstack' | 'product' | 'ai';

export interface Tool {
  name: string;
  primary?: boolean;
}

export interface Subsystem {
  name: string;
  tools: Tool[];
}

export interface Capability {
  id: CapabilityId;
  number: string;
  titleKey: string;
  taglineKey: string;
  signalKey: string;
  outcomeTextKey: string;
  outcomeProject: string;
  iconName: 'LayoutTemplate' | 'Server' | 'Target' | 'Sparkles';
  emphasized: boolean;
  accentColor: string;
  accentRgb: string;
  subsystems: Subsystem[];
}
