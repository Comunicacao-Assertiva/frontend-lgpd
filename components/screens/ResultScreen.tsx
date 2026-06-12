'use client';

import { ShieldCheck, ChevronLeft, Save, Download, RotateCcw, Lightbulb, Loader2 } from 'lucide-react';
import { Answers, DiagnosticResult } from '@/types';
import { LEVELS, QUESTIONS } from '@/lib/data';

interface ResultScreenProps {
  result: DiagnosticResult; name: string; organization: string; answers: Answers;
  fromHistory?: boolean; saving?: boolean;
  onBack: () => void; onSave: () => void; onDownload: () => void; onRestart: () => void;
}

export function ResultScreen({ result, name, organization, answers, fromHistory = false, saving = false, onBack, onSave, onDownload, onRestart }: ResultScreenProps) {
  const l = result.level;

  return (
    <div>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500 mb-2">
        <ShieldCheck size={12} /> Diagnóstico concluído
      </div>
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">{l.name}</h2>
      <p className="text-sm text-neutral-500 mb-5">{l.situation}{name ? ` · ${name}` : ''}{organization ? ` · ${organization}` : ''}</p>

      <div className="grid grid-cols-2 gap-2 mb-5">
        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-center">
          <div className="text-5xl font-bold leading-none" style={{ color: l.color }}>
            {result.totalScore}<span className="text-xl text-neutral-400">/24</span>
          </div>
          <div className="text-xs text-neutral-400 mt-1.5">{result.percentage}% de acerto</div>
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 flex flex-col justify-center gap-2">
          {LEVELS.map(lv => (
            <div key={lv.id} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: lv.color }} />
              <span className={`text-xs flex-1 ${lv.id === l.id ? 'font-semibold' : 'text-neutral-400'}`} style={{ color: lv.id === l.id ? lv.color : undefined }}>{lv.name}</span>
              {lv.id === l.id && <span className="text-[10px] font-semibold" style={{ color: lv.color }}>← você</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4 mb-4 border" style={{ borderColor: l.borderColor, background: l.bgColor }}>
        <div className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: l.textColor }}>
          <Lightbulb size={14} /> Recomendação
        </div>
        <p className="text-[13.5px] leading-relaxed text-neutral-800">{l.action}</p>
      </div>

      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Próximos passos</h3>
      <div className="space-y-1.5 mb-5">
        {l.steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2.5 p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <span className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center text-white flex-shrink-0" style={{ background: l.color }}>{i+1}</span>
            <span className="text-sm text-neutral-800 dark:text-neutral-200">{step}</span>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Revisão das respostas</h3>
      <div className="space-y-2 mb-5">
        {QUESTIONS.map((q, qi) => {
          const a = answers[qi];
          const chosen = a !== undefined ? q.options[a.optionIndex] : null;
          const isCorrect = chosen?.score === 2; const isPartial = chosen?.score === 1;
          const bc = isCorrect ? '#1D9E75' : isPartial ? '#EF9F27' : '#E24B4A';
          const bg = isCorrect ? '#E1F5EE' : isPartial ? '#FAEEDA' : '#FCEBEB';
          const label = isCorrect ? 'Correto' : isPartial ? 'Parcial' : 'Atenção';
          return (
            <div key={q.id} className="p-3 rounded-xl" style={{ background: bg, border: `1px solid ${bc}` }}>
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="text-xs font-semibold text-neutral-800">{q.id}. {q.text}</span>
                <span className="text-[10px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded" style={{ color: bc, background: 'white', border: `1px solid ${bc}` }}>{label}</span>
              </div>
              <p className="text-xs text-neutral-500">Resposta: <strong className="text-neutral-700">{chosen?.text ?? '—'}</strong></p>
            </div>
          );
        })}
      </div>

      {fromHistory ? (
        <button onClick={onBack} className="flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
          <ChevronLeft size={15} /> Voltar ao histórico
        </button>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            <button onClick={onBack} className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-500 hover:bg-neutral-50 transition-colors">
              <ChevronLeft size={14} /> Rever respostas
            </button>
            <button onClick={onSave} disabled={saving} className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-500 hover:bg-neutral-50 transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={onDownload} className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-800 hover:bg-teal-700 text-teal-100 font-semibold rounded-lg text-sm transition-colors">
              <Download size={14} /> Baixar resultado
            </button>
          </div>
          <button onClick={onRestart} className="w-full flex items-center justify-center gap-1.5 mt-2 px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-400 hover:bg-neutral-50 transition-colors">
            <RotateCcw size={14} /> Novo diagnóstico
          </button>
        </>
      )}
    </div>
  );
}