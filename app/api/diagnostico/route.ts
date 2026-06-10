import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { calculateResult } from '@/lib/scoring';
import { PILLARS } from '@/lib/data';
import { Answers } from '@/types';

const QUESTIONS_PER_PILLAR = 12;

function answerKey(pillarId: number, questionIndex: number) {
  return `p${pillarId}q${questionIndex}`;
}

function validate(answers: Answers): string | null {
  for (let p = 1; p <= PILLARS.length; p++) {
    for (let q = 0; q < QUESTIONS_PER_PILLAR; q++) {
      const key = answerKey(p, q);
      if (answers[key] === undefined) return `Resposta ausente: ${key}`;
      if (![0, 1, 2].includes(answers[key])) return `Valor inválido: ${key}`;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organization = '', answers } = body as { organization: string; answers: Answers };

    const error = validate(answers);
    if (error) return NextResponse.json({ error }, { status: 422 });

    const result = calculateResult(answers);

    const { data, error: dbError } = await supabaseServer
      .from('diagnosticos')
      .insert({
        organization: organization || 'Organização',
        total_score: result.totalScore,
        percentage: result.percentage,
        quadrant_id: result.quadrant.id,
        quadrant_name: result.quadrant.name,
        quadrant_color: result.quadrant.color,
        gov_percentage: result.govPercentage,
        sec_percentage: result.secPercentage,
        pillar_scores: result.pillarScores,
        answers,
      })
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({
      id: data.id,
      organization: data.organization,
      total_score: result.totalScore,
      max_score: result.maxScore,
      percentage: result.percentage,
      quadrant_id: result.quadrant.id,
      quadrant_name: result.quadrant.name,
      situation: result.quadrant.situation,
      action: result.quadrant.action,
      next_quadrant: result.quadrant.nextQuadrant,
      next_steps: result.quadrant.nextSteps,
      gov_percentage: result.govPercentage,
      sec_percentage: result.secPercentage,
      pillar_scores: result.pillarScores,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
