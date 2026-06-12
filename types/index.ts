export interface Answers {
  [questionIndex: number]: { optionIndex: number; score: number };
}

export interface QuestionOption {
  text: string;
  score: number;
}

export interface QuestionData {
  id: number;
  text: string;
  options: QuestionOption[];
}

export interface LevelData {
  id: 1 | 2 | 3 | 4;
  name: string;
  range: [number, number];
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  situation: string;
  action: string;
  steps: string[];
}

export interface DiagnosticResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: LevelData;
}

export interface SavedDiagnostic {
  id: number;
  supabaseId: string;
  timestamp: number;
  name: string;
  organization: string;
  totalScore: number;
  percentage: number;
  levelId: number;
  levelName: string;
  levelColor: string;
  answers: Answers;
}