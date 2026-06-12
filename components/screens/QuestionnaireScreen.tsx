'use client';

import { useState } from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Answers } from '@/types';
import { QUESTIONS } from '@/lib/data';
import { isDone } from '@/lib/scoring';

interface QuestionnaireScreenProps {
  answers: Answers;
  onAnswer: (qi: number, oi: number, score: number) => void;
  onSubmit: () => void;
}

export function QuestionnaireScreen({ answers, onAnswer, onSubmit }: QuestionnaireScreenProps) {
  const [showWarning, setShowWarning] = useState(false);

  function handleSubmit() {
    if (!isDone(answers)) { setShowWarning(true); return; }
    onSubmit();
  }

  return (
    <div>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500 mb-2">
        Diagnóstico de Conscientização
      </div>
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Responda as questões abaixo</h2>
      <p className="text-sm text-neutral-500 mb-5">Selecione a opção que melhor descreve sua situação atual.</p>

      <div className="space-y-3">
        {QUESTIONS.map((q, qi) => {
          const answered = answers[qi] !== undefined;
          return (
            <div key={q.id} className={`bg-white dark:bg-neutral-900 border rounded-xl p-4 transition-colors ${answered ? 'border-neutral-300 dark:border-neutral-600' : 'border-neutral-200 dark:border-neutral-700'}`}>
              <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mb-1">Questão {q.id}</div>
              <p className="text-[13.5px] text-neutral-800 dark:text-neutral-200 leading-relaxed mb-3 font-medium">{q.text}</p>
              <div className="flex flex-col gap-1.5">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi]?.optionIndex === oi;
                  return (
                    <button key={oi} onClick={() => { onAnswer(qi, oi, opt.score); setShowWarning(false); }}
                      className={`flex items-center gap-2.5 px-3 py-2 border rounded-lg text-sm text-left transition-all cursor-pointer ${isSelected ? 'bg-teal-50 border-teal-400 text-teal-900 dark:bg-teal-950 dark:border-teal-600 dark:text-teal-100 font-medium' : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800'}`}>
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? 'border-teal-500 bg-teal-500' : 'border-neutral-300 dark:border-neutral-600'}`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                      </span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showWarning && (
        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-red-50 dark:bg-red-950 rounded-lg text-xs text-red-700 dark:text-red-400">
          <AlertCircle size={13} /> Responda todas as {QUESTIONS.length} questões antes de enviar.
        </div>
      )}

      <button onClick={handleSubmit} className="w-full flex items-center justify-center gap-2 mt-5 bg-teal-800 hover:bg-teal-700 text-teal-100 font-semibold py-3.5 rounded-xl text-[15px] transition-colors">
        Ver resultado <ChevronRight size={18} />
      </button>
    </div>
  );
}