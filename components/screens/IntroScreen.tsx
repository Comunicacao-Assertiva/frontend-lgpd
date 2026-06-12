'use client';

import { ShieldCheck, ChevronRight, Clock, Trash2, Loader2 } from 'lucide-react';
import { SavedDiagnostic } from '@/types';
import { formatDate } from '@/lib/storage';

interface IntroScreenProps {
  name: string; organization: string;
  onNameChange: (v: string) => void; onOrgChange: (v: string) => void;
  onStart: () => void;
  history: SavedDiagnostic[]; historyLoading: boolean;
  onViewResult: (saved: SavedDiagnostic) => void;
  onDeleteResult: (supabaseId: string) => void;
  onViewHistory: () => void;
}

export function IntroScreen({ name, organization, onNameChange, onOrgChange, onStart, history, historyLoading, onViewResult, onDeleteResult, onViewHistory }: IntroScreenProps) {
  const recent = history.slice(0, 3);

  return (
    <div>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500 mb-3">
        <ShieldCheck size={12} /> Diagnóstico de Conscientização
      </div>
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1 leading-tight">
        Diagnóstico de Conscientização em Proteção de Dados
      </h1>
      <p className="text-sm text-neutral-500 leading-relaxed mb-5">
        Responda as questões de forma intuitiva e receba um diagnóstico completo com seu nível de conscientização e plano de desenvolvimento.
      </p>

      <div className="grid grid-cols-3 gap-2 mb-5">
        {[['12','questões'],['0–24','pontuação'],['~5','minutos']].map(([v,l]) => (
          <div key={l} className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{v}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{l}</div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-5">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2.5">Identificação</p>
        <div className="flex flex-col gap-2">
          <input type="text" placeholder="Seu nome" value={name} onChange={e => onNameChange(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 outline-none focus:border-teal-500 transition-colors" />
          <input type="text" placeholder="Nome da organização" value={organization} onChange={e => onOrgChange(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 outline-none focus:border-teal-500 transition-colors" />
        </div>
      </div>

      <button onClick={onStart} className="w-full flex items-center justify-center gap-2 bg-teal-800 hover:bg-teal-700 text-teal-100 font-semibold py-3.5 rounded-xl text-[15px] transition-colors">
        Iniciar diagnóstico <ChevronRight size={18} />
      </button>

      <div className="h-px bg-neutral-200 dark:bg-neutral-700 my-5" />
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Diagnósticos salvos</h3>
        {recent.length > 0 && <button onClick={onViewHistory} className="text-xs text-teal-600 hover:text-teal-700 font-medium">Ver todos</button>}
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
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: r.levelColor }}>
                {r.levelId}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{r.name || r.organization || 'Sem identificação'}</div>
                <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1"><Clock size={10} /> {r.levelName} · {formatDate(r.timestamp)}</div>
              </div>
              <div className="text-lg font-bold flex-shrink-0" style={{ color: r.levelColor }}>{r.totalScore}<span className="text-xs text-neutral-400">/24</span></div>
              <button onClick={e => { e.stopPropagation(); onDeleteResult(r.supabaseId); }} className="text-neutral-300 hover:text-red-400 transition-colors p-1">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}