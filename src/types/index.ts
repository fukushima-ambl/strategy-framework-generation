export type FrameworkId =
  | 'swot'
  | 'threeC'
  | 'mece'
  | 'fiveForces'
  | 'ppm'
  | 'valueChain'
  | 'okr'
  | 'pmi';

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  cross_swot: { so: string; wo: string; st: string; wt: string };
  key_insight: string;
}

export interface ThreeCData {
  customer: {
    market_size: string;
    growth_rate: string;
    key_segment: string;
    pain_points: string[];
    decision_maker: string;
    buying_criteria: string[];
  };
  competitor: {
    leaders: string[];
    their_strengths: string[];
    their_weaknesses: string[];
    entry_barriers: string[];
  };
  company: {
    core_strengths: string[];
    resources: string[];
    differentiators: string[];
    gaps: string[];
  };
  ksf: string[];
}

export interface MeceNode {
  label: string;
  children: string[];
}

export interface MeceData {
  root: string;
  level1: MeceNode[];
  mece_check: string;
}

export interface FiveForcesData {
  rivalry: { level: string; factors: string[] };
  new_entrants: { level: string; factors: string[] };
  substitutes: { level: string; factors: string[] };
  buyer_power: { level: string; factors: string[] };
  supplier_power: { level: string; factors: string[] };
  overall_attractiveness: string;
}

export interface OkrData {
  objectives: Array<{
    objective: string;
    key_results: Array<{
      kr: string;
      target: string;
      unit: string;
    }>;
  }>;
  review_cycle: string;
}

export type FrameworkData = SwotData | ThreeCData | MeceData | FiveForcesData | OkrData;

export interface FrameworkResult {
  framework: FrameworkId;
  theme: string;
  generated_at: string;
  data: FrameworkData;
  rawText?: string;
}

export interface GenerationState {
  status: 'idle' | 'loading' | 'success' | 'error';
  streamingText: string;
  result: FrameworkResult | null;
  error: string | null;
}

export type ResultCache = Map<string, FrameworkResult>;

export interface FrameworkInfo {
  id: FrameworkId;
  label: string;
  category: string;
  priority: 'required' | 'high' | 'medium' | 'low';
}
