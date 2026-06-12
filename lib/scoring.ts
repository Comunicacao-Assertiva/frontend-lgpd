import { Answers, DiagnosticResult } from '@/types';
import { QUESTIONS, LEVELS, MAX_SCORE } from './data';

export function getLevel(totalScore: number) {
  return LEVELS.find(l => totalScore >= l.range[0] && totalScore <= l.range[1]) ?? LEVELS[3];
}

export function calculateResult(answers: Answers): DiagnosticResult {
  const totalScore = Object.values(answers).reduce((sum, a) => sum + a.score, 0);
  return {
    totalScore,
    maxScore: MAX_SCORE,
    percentage: Math.round((totalScore / MAX_SCORE) * 100),
    level: getLevel(totalScore),
  };
}

export function isDone(answers: Answers): boolean {
  return Object.keys(answers).length === QUESTIONS.length;
}