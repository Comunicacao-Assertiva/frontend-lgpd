'use client';

import { useState, useCallback, useEffect } from 'react';
import { Answers, AnswerValue, SavedDiagnostic } from '@/types';
import { PILLARS } from '@/lib/data';
import { calculateResult } from '@/lib/scoring';
import { loadHistory, saveDiagnostic, deleteDiagnostic } from '@/lib/storage';
import { downloadReport } from '@/lib/download';
import { IntroScreen } from '@/components/screens/IntroScreen';
import { PillarScreen } from '@/components/screens/PillarScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';
import { HistoryScreen } from '@/components/screens/HistoryScreen';

type Screen =
  | { type: 'intro' }
  | { type: 'pillar'; index: number }
  | { type: 'result'; fromHistory: boolean }
  | { type: 'history' };

export function DiagnosticApp() {
  const [screen, setScreen] = useState<Screen>({ type: 'intro' });
  const [organization, setOrganization] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [history, setHistory] = useState<SavedDiagnostic[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { refreshHistory(); }, []);

  async function refreshHistory() {
    setHistoryLoading(true);
    try {
      const data = await loadHistory();
      setHistory(data);
    } catch (err) {
      showToast('Erro ao carregar histórico');
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  }

  const handleAnswer = useCallback((key: string, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  }, []);

  function handleNext(currentIndex: number) {
    if (currentIndex < PILLARS.length - 1) {
      setScreen({ type: 'pillar', index: currentIndex + 1 });
    } else {
      setScreen({ type: 'result', fromHistory: false });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBack(currentIndex: number) {
    setScreen(currentIndex === 0 ? { type: 'intro' } : { type: 'pillar', index: currentIndex - 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      await saveDiagnostic(organization, answers);
      await refreshHistory();
      showToast('Diagnóstico salvo com sucesso');
    } catch (err) {
      showToast('Erro ao salvar diagnóstico');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleDownload() {
    downloadReport(organization, answers);
    showToast('Arquivo baixado');
  }

  function handleRestart() {
    setAnswers({});
    setScreen({ type: 'intro' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleViewResult(saved: SavedDiagnostic) {
    setOrganization(saved.organization);
    setAnswers(saved.answers);
    setScreen({ type: 'result', fromHistory: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDeleteResult(supabaseId: string) {
    try {
      await deleteDiagnostic(supabaseId);
      await refreshHistory();
      showToast('Diagnóstico removido');
    } catch (err) {
      showToast('Erro ao remover diagnóstico');
      console.error(err);
    }
  }

  const result = screen.type === 'result' ? calculateResult(answers) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <span className="text-sm font-semibold text-neutral-500 tracking-wide flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-teal-700">
              <path d="M12 2L3 7v7c0 5.25 4.05 10.15 9 11.25C17 24.15 21 19.25 21 14V7L12 2z" />
              <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            4Q-LGPD
          </span>
          {organization && screen.type !== 'intro' && (
            <span className="text-xs text-neutral-500 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 rounded-lg truncate max-w-[200px]">
              {organization}
            </span>
          )}
        </div>

        {/* Screens */}
        <div className="p-6">
          {screen.type === 'intro' && (
            <IntroScreen
              organization={organization}
              onOrgChange={setOrganization}
              onStart={() => setScreen({ type: 'pillar', index: 0 })}
              history={history}
              historyLoading={historyLoading}
              onViewResult={handleViewResult}
              onDeleteResult={handleDeleteResult}
              onViewHistory={() => setScreen({ type: 'history' })}
            />
          )}
          {screen.type === 'pillar' && (
            <PillarScreen
              pillarIndex={screen.index}
              answers={answers}
              onAnswer={handleAnswer}
              onNext={() => handleNext(screen.index)}
              onBack={() => handleBack(screen.index)}
            />
          )}
          {screen.type === 'result' && result && (
            <ResultScreen
              result={result}
              organization={organization}
              fromHistory={screen.fromHistory}
              saving={saving}
              onBack={() => {
                setScreen(screen.fromHistory
                  ? { type: 'history' }
                  : { type: 'pillar', index: PILLARS.length - 1 });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSave={handleSave}
              onDownload={handleDownload}
              onRestart={handleRestart}
            />
          )}
          {screen.type === 'history' && (
            <HistoryScreen
              history={history}
              loading={historyLoading}
              onViewResult={handleViewResult}
              onDeleteResult={handleDeleteResult}
              onNewDiagnostic={handleRestart}
            />
          )}
        </div>

        <div className="text-center text-xs text-neutral-400 px-6 py-4 border-t border-neutral-100 dark:border-neutral-800">
          Matriz 4Q-LGPD · Diagnóstico de Maturidade em Proteção de Dados
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-neutral-100 text-sm px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
