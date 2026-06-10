import { Answers, SavedDiagnostic } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL;

interface Row {
  id: string; created_at: string; organization: string;
  total_score: number; percentage: number;
  quadrant_id: number; quadrant_name: string; quadrant_color: string;
  gov_percentage: number; sec_percentage: number;
  pillar_scores: SavedDiagnostic['pillarScores']; answers: Answers;
}

function mapRow(r: Row): SavedDiagnostic {
  return {
    id: new Date(r.created_at).getTime(), supabaseId: r.id,
    timestamp: new Date(r.created_at).getTime(), organization: r.organization,
    totalScore: r.total_score, percentage: r.percentage,
    quadrantId: r.quadrant_id, quadrantName: r.quadrant_name, quadrantColor: r.quadrant_color,
    govPercentage: r.gov_percentage, secPercentage: r.sec_percentage,
    pillarScores: r.pillar_scores, answers: r.answers,
  };
}

export async function loadHistory(): Promise<SavedDiagnostic[]> {
  const res = await fetch(`${API}/api/historico`);
  if (!res.ok) throw new Error('Erro ao carregar histórico');
  const data: Row[] = await res.json();
  return data.map(mapRow);
}

export async function saveDiagnostic(organization: string, answers: Answers): Promise<SavedDiagnostic> {
  const res = await fetch(`${API}/api/diagnostico`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ organization, answers }),
  });
  if (!res.ok) { const { detail } = await res.json(); throw new Error(detail ?? 'Erro ao salvar'); }
  const data: Row = await res.json();
  return mapRow(data);
}

export async function deleteDiagnostic(supabaseId: string): Promise<void> {
  const res = await fetch(`${API}/api/diagnostico/${supabaseId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao remover diagnóstico');
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
