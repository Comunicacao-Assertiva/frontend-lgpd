'use client';

import { Clock, Trash2, Plus, Loader2 } from 'lucide-react';
import { SavedDiagnostic } from '@/types';
import { formatDate } from '@/lib/storage';

interface HistoryScreenProps {
  history: SavedDiagnostic[]; loading: boolean;
  onViewResult: (saved: SavedDiagnostic) => void;
  onDeleteResult: (supabaseId: string) => void;
  onNewDiagnostic: () => void;
}

export function HistoryScreen({ history, loading, onViewResult, onDeleteResult, onNewDiagnostic }: HistoryScreenProps) {
  return (
    <div>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500 mb-2">
        <Clock size={12} /> Diagnósticos salvos
      </div>
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Histórico</h2>
      <p className="text-sm text-neutral-500 mb-5">Clique em um diagnóstico para visualizar os resultados.</p>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-neutral-400">
          <Loader2 size={16} className="animate-spin" /> Carregando...
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-10 px-6 bg-neutral-50 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl text-sm text-neutral-400">
          Nenhum diagnóstico salvo ainda.
        </div>
      ) : (
        <div className="space-y-2">
          {history.map(r => (
            <div key={r.supabaseId} onClick={() => onViewResult(r)}
              className="flex items-center gap-3 p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl cursor-pointer hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: r.levelColor }}>{r.levelId}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{r.name || r.organization || 'Sem identificação'}</div>
                <div className="text-xs text-neutral-400 mt-0.5">{r.levelName} · {formatDate(r.timestamp)}</div>
              </div>
              <div className="text-xl font-bold flex-shrink-0" style={{ color: r.levelColor }}>{r.totalScore}<span className="text-xs text-neutral-400">/24</span></div>
              <button onClick={e => { e.stopPropagation(); onDeleteResult(r.supabaseId); }} className="text-neutral-300 hover:text-red-400 transition-colors p-1 flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5">
        <button onClick={onNewDiagnostic} className="w-full flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-700 text-teal-100 font-semibold py-3 rounded-xl text-sm transition-colors">
          <Plus size={16} /> Novo diagnóstico
        </button>
      </div>
    </div>
  );
}