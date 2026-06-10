'use client';

import { Check } from 'lucide-react';
import { PILLARS } from '@/lib/data';

interface StepperProps {
  currentStep: number; // 1–5
}

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex items-center gap-1 mb-7">
      {PILLARS.map((pillar, i) => {
        const step = i + 1;
        const isDone = currentStep > step;
        const isActive = currentStep === step;

        return (
          <div key={pillar.id} className="flex items-center flex-1 last:flex-none">
            <div
              title={`Pilar ${step}: ${pillar.name}`}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 border transition-all ${
                isDone
                  ? 'bg-teal-800 border-teal-800 text-teal-100'
                  : isActive
                  ? 'bg-teal-500 border-teal-500 text-white'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-400 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-500'
              }`}
            >
              {isDone ? <Check size={11} strokeWidth={3} /> : step}
            </div>
            {i < PILLARS.length - 1 && (
              <div
                className={`flex-1 h-px mx-1 transition-colors ${
                  currentStep > step ? 'bg-teal-500' : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
