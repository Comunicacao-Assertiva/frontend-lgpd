'use client';

import { ShieldCheck, ChevronLeft, Save, Download, RotateCcw, Lightbulb, Loader2 } from 'lucide-react';
import { DiagnosticResult } from '@/types';
import { QUADRANTS } from '@/lib/data';
import { getBarColor } from '@/lib/scoring';
import { QuadrantMatrix } from '@/components/ui/QuadrantMatrix';

interface ResultScreenProps {
  result: DiagnosticResult;
  organization: string;
  fromHistory?: boolean;
  saving?: boolean;
  onBack: () => void;
  onSave: () => void;
  onDownload: () => void;
  onRestart: () => void;
}

export function ResultScreen({ result, organization, fromHistory = false, saving = false, onBack, onSave, onDownload, onRestart }: ResultScreenProps) {
  const q = result.quadrant;

  return (
    <div>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500 mb-2">
        <ShieldCheck size={12} /> Diagnóstico concluído
      </div>
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Q{q.id} — {q.name}</h2>
      <p className="text-sm text-neutral-500 mb-5">{q.situation}{organization ? ` · ${organization}` : ''}</p>

      {/* Score hero */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 text-center">
          <div className="text-5xl font-bold leading-none" style={{ color: q.color }}>
            {result.totalScore}<span className="text-xl text-neutral-400">/120</span>
          </div>
          <div className="text-xs text-neutral-400 mt-1.5">{result.percentage}% de maturidade</div>
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 space-y-3">
          {[{ label: 'Eixo X — Governança', value: result.govPercentage, color: '#378ADD' }, { label: 'Eixo Y — Segurança e Operação', value: result.secPercentage, color: '#1D9E75' }].map(axis => (
            <div key={axis.label}>
              <div className="text-[11px] text-neutral-400 mb-0.5">{axis.label}</div>
              <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{axis.value}%</div>
              <div className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full mt-1 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${axis.value}%`, background: axis.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2D Matrix */}
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Posicionamento nos quadrantes</h3>
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-4">
        <QuadrantMatrix govPercentage={result.govPercentage} secPercentage={result.secPercentage} dotColor={q.color} />
      </div>

      {/* Pillar scores */}
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Pontuação por pilar</h3>
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-4 space-y-3">
        {result.pillarScores.map(p => (
          <div key={p.id}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm text-neutral-800 dark:text-neutral-200">{p.name}</span>
              <span className="text-xs text-neutral-400">{p.score}/{p.maxScore} · {p.percentage}%</span>
            </div>
            <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${p.percentage}%`, background: getBarColor(p.percentage) }} />
            </div>
          </div>
        ))}
      </div>

      {/* Action */}
      <div className="rounded-xl p-4 mb-4 border" style={{ borderColor: q.borderColor, background: q.bgColor }}>
        <div className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: q.textColor }}>
          <Lightbulb size={14} /> Ação recomendada
        </div>
        <p className="text-[13.5px] leading-relaxed text-neutral-800">{q.action}</p>
      </div>

      {/* Evolution plan */}
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Plano de evolução</h3>
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 mb-4">
        <div className="flex">
          {QUADRANTS.map((qx, i) => {
            const isCur = qx.id === q.id; const isPast = qx.id < q.id;
            return (
              <div key={qx.id} className="flex items-center flex-1">
                {i > 0 && <span className="text-neutral-300 text-xs px-0.5 flex-shrink-0">›</span>}
                <div className={`flex-1 py-2 px-1.5 border text-center ${isCur ? 'font-semibold' : isPast ? 'opacity-40' : ''}`}
                  style={{ borderColor: isCur ? qx.borderColor : undefined, borderWidth: isCur ? 2 : 1, background: isCur ? qx.bgColor : undefined }}>
                  <div className="text-[10px]" style={{ color: isCur ? qx.textColor : undefined }}>Q{qx.id}</div>
                  <div className="text-[11px] font-semibold" style={{ color: isCur ? qx.textColor : undefined }}>{qx.name}</div>
                </div>
              </div>
            );
          })}
        </div>
        {q.nextQuadrant && (
          <p className="text-xs text-neutral-400 text-center mt-2">
            Para avançar ao quadrante <strong className="text-neutral-600">{q.nextQuadrant}</strong>, foque nas ações abaixo
          </p>
        )}
      </div>

      {/* Next steps */}
      {q.nextSteps.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Próximos passos — rumo a {q.nextQuadrant}</h3>
          <div className="space-y-1.5 mb-5">
            {q.nextSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl">
                <span className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center text-white flex-shrink-0" style={{ background: q.color }}>{i + 1}</span>
                <span className="text-sm text-neutral-800 dark:text-neutral-200">{step}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Actions */}
      {fromHistory ? (
        <button onClick={onBack} className="flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 transition-colors">
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
              {saving ? 'Salvando...' : 'Salvar diagnóstico'}
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
