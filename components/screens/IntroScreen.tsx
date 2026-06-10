'use client';

import { ShieldCheck, Clock, Trash2, ChevronRight, Loader2 } from 'lucide-react';
import { SavedDiagnostic } from '@/types';
import { formatDate } from '@/lib/storage';

interface IntroScreenProps {
  organization: string;
  onOrgChange: (value: string) => void;
  onStart: () => void;
  history: SavedDiagnostic[];
  historyLoading: boolean;
  onViewResult: (saved: SavedDiagnostic) => void;
  onDeleteResult: (supabaseId: string) => void;
  onViewHistory: () => void;
}

export function IntroScreen({
  organization, onOrgChange, onStart,
  history, historyLoading, onViewResult, onDeleteResult, onViewHistory,
}: IntroScreenProps) {
  const recent = history.slice(0, 3);

  return (
    <div>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500 mb-3">
        <ShieldCheck size={12} /> Diagnóstico de maturidade LGPD
      </div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1 leading-tight">Matriz 4Q-LGPD</h1>
      <p className="text-sm text-neutral-500 leading-relaxed mb-5">
        Radar de Maturidade em Proteção de Dados. Responda as questões de forma intuitiva em 5 pilares
        e receba um diagnóstico completo com posicionamento gráfico e plano de evolução entre quadrantes.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {[['5','pilares'],['0–120','pontuação'],['~15','minutos']].map(([v,l]) => (
          <div key={l} className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{v}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{l}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-3">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2.5">Nome da organização</p>
        <input
          type="text"
          value={organization}
          onChange={e => onOrgChange(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 outline-none focus:border-teal-500 transition-colors"
        />
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2.5">Escala de resposta</p>
        <div className="flex gap-2">
          <div className="flex-1 text-center py-2 px-1 rounded-lg border bg-red-50 border-red-300">
            <div className="text-xl font-bold text-red-800">0</div>
            <div className="text-[11px] text-red-600 mt-0.5">Inexistente</div>
          </div>
          <div className="flex-1 text-center py-2 px-1 rounded-lg border bg-amber-50 border-amber-300">
            <div className="text-xl font-bold text-amber-900">1</div>
            <div className="text-[11px] text-amber-700 mt-0.5">Parcialmente<br />implementado</div>
          </div>
          <div className="flex-1 text-center py-2 px-1 rounded-lg border bg-teal-50 border-teal-300">
            <div className="text-xl font-bold text-teal-900">2</div>
            <div className="text-[11px] text-teal-700 mt-0.5">Implementado</div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-5 text-sm text-neutral-500 leading-relaxed">
        <strong className="text-neutral-700 dark:text-neutral-300">Como os eixos funcionam:</strong><br />
        Eixo X (Governança) — Pilares 1, 2 e 5 · Eixo Y (Segurança e Operação) — Pilares 3 e 4.
      </div>

      <button onClick={onStart} className="w-full flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-700 text-teal-100 font-semibold py-3.5 rounded-xl text-[15px] transition-colors">
        Iniciar diagnóstico <ChevronRight size={18} />
      </button>

      {/* Recent history */}
      <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-5" />
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Diagnósticos salvos</h3>
        {recent.length > 0 && (
          <button onClick={onViewHistory} className="text-xs text-teal-600 hover:text-teal-700 font-medium">
            Ver todos
          </button>
        )}
      </div>

      {historyLoading ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-neutral-400">
          <Loader2 size={16} className="animate-spin" /> Carregando...
        </div>
      ) : recent.length === 0 ? (
        <div className="text-center py-6 text-sm text-neutral-400 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-600">
          Nenhum diagnóstico salvo ainda.
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map(r => (
            <div key={r.supabaseId} onClick={() => onViewResult(r)}
              className="flex items-center gap-3 p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl cursor-pointer hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: r.quadrantColor }}>
                {r.quadrantId}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{r.organization}</div>
                <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
                  <Clock size={10} /> {r.quadrantName} · {formatDate(r.timestamp)}
                </div>
              </div>
              <div className="text-lg font-bold flex-shrink-0" style={{ color: r.quadrantColor }}>
                {r.totalScore}<span className="text-xs text-neutral-400">/120</span>
              </div>
              <button onClick={e => { e.stopPropagation(); onDeleteResult(r.supabaseId); }}
                className="text-neutral-300 hover:text-red-400 transition-colors p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
