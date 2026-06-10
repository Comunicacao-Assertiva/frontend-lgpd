import { Answers, DiagnosticResult, PillarScore, QuadrantData } from '@/types';
import { PILLARS, QUADRANTS, MAX_SCORE } from './data';

export function answerKey(pillarId: number, questionIndex: number): string {
  return `p${pillarId}q${questionIndex}`;
}

export function getPillarScore(pillarIndex: number, answers: Answers): number {
  const pillar = PILLARS[pillarIndex];
  return pillar.questions.reduce((sum, _, i) => {
    const key = answerKey(pillar.id, i);
    return sum + (answers[key] ?? 0);
  }, 0);
}

export function getTotalScore(answers: Answers): number {
  return PILLARS.reduce((sum, _, i) => sum + getPillarScore(i, answers), 0);
}

export function getGovernanceScore(answers: Answers): number {
  // Pillars 1, 2, 5 (indices 0, 1, 4)
  return getPillarScore(0, answers) + getPillarScore(1, answers) + getPillarScore(4, answers);
}

export function getSecurityScore(answers: Answers): number {
  // Pillars 3, 4 (indices 2, 3)
  return getPillarScore(2, answers) + getPillarScore(3, answers);
}

export function getGovernancePercentage(answers: Answers): number {
  const maxGov = (12 * 3) * 2; // 3 pillars × 12 questions × 2 points = 72
  return Math.round((getGovernanceScore(answers) / maxGov) * 100);
}

export function getSecurityPercentage(answers: Answers): number {
  const maxSec = (12 * 2) * 2; // 2 pillars × 12 questions × 2 points = 48
  return Math.round((getSecurityScore(answers) / maxSec) * 100);
}

export function getQuadrant(totalScore: number): QuadrantData {
  return QUADRANTS.find(q => totalScore >= q.range[0] && totalScore <= q.range[1]) ?? QUADRANTS[3];
}

export function getPillarScores(answers: Answers): PillarScore[] {
  return PILLARS.map((pillar, i) => {
    const score = getPillarScore(i, answers);
    const maxScore = pillar.questions.length * 2;
    return {
      id: pillar.id,
      name: pillar.name,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
    };
  });
}

export function calculateResult(answers: Answers): DiagnosticResult {
  const totalScore = getTotalScore(answers);
  const quadrant = getQuadrant(totalScore);

  return {
    totalScore,
    maxScore: MAX_SCORE,
    percentage: Math.round((totalScore / MAX_SCORE) * 100),
    quadrant,
    govPercentage: getGovernancePercentage(answers),
    secPercentage: getSecurityPercentage(answers),
    pillarScores: getPillarScores(answers),
  };
}

export function isPillarComplete(pillarIndex: number, answers: Answers): boolean {
  const pillar = PILLARS[pillarIndex];
  return pillar.questions.every((_, i) => answers[answerKey(pillar.id, i)] !== undefined);
}

export function countPillarAnswered(pillarIndex: number, answers: Answers): number {
  const pillar = PILLARS[pillarIndex];
  return pillar.questions.filter((_, i) => answers[answerKey(pillar.id, i)] !== undefined).length;
}

export function getBarColor(percentage: number): string {
  if (percentage >= 76) return '#378ADD';
  if (percentage >= 51) return '#1D9E75';
  if (percentage >= 26) return '#EF9F27';
  return '#E24B4A';
}
