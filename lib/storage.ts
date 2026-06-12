import { Answers, SavedDiagnostic } from '@/types';
import { calculateResult } from './scoring';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

interface Row {
  id: string; created_at: string; name: string; organization: string;
  total_score: number; percentage: number;
  level_id: number; level_name: string; level_color: string;
  answers: Answers;
}

function mapRow(r: Row): SavedDiagnostic {
  return {
    id: new Date(r.created_at).getTime(), supabaseId: r.id,
    timestamp: new Date(r.created_at).getTime(),
    name: r.name, organization: r.organization,
    totalScore: r.total_score, percentage: r.percentage,
    levelId: r.level_id, levelName: r.level_name, levelColor: r.level_color,
    answers: r.answers,
  };
}

export async function loadHistory(): Promise<SavedDiagnostic[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/diagnosticos?order=created_at.desc&limit=50`, { headers });
  if (!res.ok) throw new Error('Erro ao carregar histórico');
  return (await res.json() as Row[]).map(mapRow);
}

export async function saveDiagnostic(name: string, organization: string, answers: Answers): Promise<SavedDiagnostic> {
  const result = calculateResult(answers);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/diagnosticos`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify({
      name: name || '', organization: organization || '',
      total_score: result.totalScore, percentage: result.percentage,
      level_id: result.level.id, level_name: result.level.name, level_color: result.level.color,
      answers,
    }),
  });
  if (!res.ok) throw new Error('Erro ao salvar');
  return mapRow((await res.json() as Row[])[0]);
}

export async function deleteDiagnostic(supabaseId: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/rest/v1/diagnosticos?id=eq.${supabaseId}`, { method: 'DELETE', headers });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}