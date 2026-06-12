import { Answers, SavedDiagnostic } from '@/types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

interface Row {
  id: string;
  created_at: string;
  organization: string;
  total_score: number;
  percentage: number;
  quadrant_id: number;
  quadrant_name: string;
  quadrant_color: string;
  gov_percentage: number;
  sec_percentage: number;
  pillar_scores: SavedDiagnostic['pillarScores'];
  answers: Answers;
}

function mapRow(r: Row): SavedDiagnostic {
  return {
    id: new Date(r.created_at).getTime(),
    supabaseId: r.id,
    timestamp: new Date(r.created_at).getTime(),
    organization: r.organization,
    totalScore: r.total_score,
    percentage: r.percentage,
    quadrantId: r.quadrant_id,
    quadrantName: r.quadrant_name,
    quadrantColor: r.quadrant_color,
    govPercentage: r.gov_percentage,
    secPercentage: r.sec_percentage,
    pillarScores: r.pillar_scores,
    answers: r.answers,
  };
}

export async function loadHistory(): Promise<SavedDiagnostic[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/diagnosticos?order=created_at.desc&limit=50`,
    { headers }
  );
  if (!res.ok) throw new Error('Erro ao carregar histórico');
  const data: Row[] = await res.json();
  return data.map(mapRow);
}

export async function saveDiagnostic(
  organization: string,
  answers: Answers
): Promise<SavedDiagnostic> {
  const { calculateResult } = await import('./scoring');
  const result = calculateResult(answers);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/diagnosticos`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify({
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
    }),
  });
  if (!res.ok) throw new Error('Erro ao salvar diagnóstico');
  const data: Row[] = await res.json();
  return mapRow(data[0]);
}

export async function deleteDiagnostic(supabaseId: string): Promise<void> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/diagnosticos?id=eq.${supabaseId}`,
    { method: 'DELETE', headers }
  );
  if (!res.ok) throw new Error('Erro ao remover diagnóstico');
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}