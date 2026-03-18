export type TechTierId = 'core' | 'architecture' | 'data';

export interface TechTier {
  id: TechTierId;
  titleKey: string;
  subtitleKey: string;
  proofKey: string;
  iconName: 'Zap' | 'Shield' | 'BarChart3';
  tools: string[];
  color: string;
}
