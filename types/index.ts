export type AnswerValue = 0 | 1 | 2;

export interface Answers {
  [key: string]: AnswerValue;
}

export interface PillarData {
  id: number;
  axis: 'governance' | 'security';
  name: string;
  questions: string[];
}

export interface QuadrantData {
  id: 1 | 2 | 3 | 4;
  name: string;
  range: [number, number];
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  situation: string;
  action: string;
  nextQuadrant: string | null;
  nextSteps: string[];
}

export interface PillarScore {
  id: number;
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface DiagnosticResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  quadrant: QuadrantData;
  govPercentage: number;
  secPercentage: number;
  pillarScores: PillarScore[];
}

export interface SavedDiagnostic {
  id: number;               // timestamp (compat)
  supabaseId: string;       // UUID do Supabase
  timestamp: number;
  organization: string;
  totalScore: number;
  percentage: number;
  quadrantId: number;
  quadrantName: string;
  quadrantColor: string;
  govPercentage: number;
  secPercentage: number;
  pillarScores: PillarScore[];
  answers: Answers;
}

// ─── API (FastAPI) ────────────────────────────────────────
export interface DiagnosticRequest {
  organization: string;
  answers: Answers;
}

export interface DiagnosticResponse {
  organization: string;
  total_score: number;
  max_score: number;
  percentage: number;
  quadrant_id: number;
  quadrant_name: string;
  situation: string;
  action: string;
  next_quadrant: string | null;
  next_steps: string[];
  gov_percentage: number;
  sec_percentage: number;
  pillar_scores: {
    id: number;
    name: string;
    score: number;
    max_score: number;
    percentage: number;
  }[];
}
