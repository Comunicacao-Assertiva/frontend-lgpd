'use client';

import { useState } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Answers, AnswerValue } from '@/types';
import { PILLARS } from '@/lib/data';
import { answerKey, countPillarAnswered, isPillarComplete } from '@/lib/scoring';
import { Stepper } from '@/components/ui/Stepper';

interface PillarScreenProps {
  pillarIndex: number;
  answers: Answers;
  onAnswer: (key: string, value: AnswerValue) => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTION_STYLES: Record<AnswerValue, string> = {
  0: 'bg-red-50 border-red-400 text-red-900 font-semibold',
  1: 'bg-amber-50 border-amber-400 text-amber-900 font-semibold',
  2: 'bg-teal-50 border-teal-400 text-teal-900 font-semibold',
};

export function PillarScreen({ pillarIndex, answers, onAnswer, onNext, onBack }: PillarScreenProps) {
  const [showWarning, setShowWarning] = useState(false);
  const pillar = PILLARS[pillarIndex];
  const answered = countPillarAnswered(pillarIndex, answers);
  const isLast = pillarIndex === PILLARS.length - 1;

  function handleNext() {
    if (!isPillarComplete(pillarIndex, answers)) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    onNext();
  }

  return (
    <div>
      <Stepper currentStep={pillarIndex + 1} />

      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500 mb-2">
        {pillar.name} — Pilar {pillarIndex + 1} de 5
      </div>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
        {pillar.name}
      </h2>
      <p className="text-sm text-neutral-500 mb-4">
        Avalie a situação atual da organização para cada item abaixo.
      </p>

      <div className="space-y-2">
        {pillar.questions.map((question, i) => {
          const key = answerKey(pillar.id, i);
          const currentValue = answers[key];
          const isAnswered = currentValue !== undefined;

          return (
            <div
              key={key}
              className={`bg-white dark:bg-neutral-900 border rounded-xl p-4 transition-colors ${
                isAnswered
                  ? 'border-neutral-300 dark:border-neutral-600'
                  : 'border-neutral-200 dark:border-neutral-700'
              }`}
            >
              <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider mb-1">
                Pilar {pillarIndex + 1} · Questão {i + 1}
              </div>
              <p className="text-[13.5px] text-neutral-800 dark:text-neutral-200 leading-relaxed mb-2.5">
                {question}
              </p>
              <div className="flex gap-1.5">
                {([0, 1, 2] as AnswerValue[]).map(v => (
                  <button
                    key={v}
                    onClick={() => {
                      onAnswer(key, v);
                      setShowWarning(false);
                    }}
                    className={`flex-1 py-1.5 px-2 border rounded-lg text-xs text-center leading-tight transition-all cursor-pointer ${
                      currentValue === v
                        ? OPTION_STYLES[v]
                        : 'border-neutral-200 dark:border-neutral-600 text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {v === 0 ? '0 · Inexistente' : v === 1 ? '1 · Parcial' : '2 · Implementado'}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showWarning && (
        <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-red-50 dark:bg-red-950 rounded-lg text-xs text-red-700 dark:text-red-400">
          <AlertCircle size={13} />
          Responda todas as {pillar.questions.length} questões antes de avançar.
        </div>
      )}

      <div className="flex items-center justify-between mt-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <ChevronLeft size={15} />
          Voltar
        </button>
        <span className="text-xs text-neutral-400">{answered}/{pillar.questions.length} respondidas</span>
        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-800 hover:bg-teal-700 text-teal-100 font-semibold rounded-lg text-sm transition-colors"
        >
          {isLast ? 'Ver diagnóstico' : 'Próximo pilar'}
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
