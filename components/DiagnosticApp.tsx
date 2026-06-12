'use client';

import { useState, useCallback, useEffect } from 'react';
import { Answers, SavedDiagnostic } from '@/types';
import { calculateResult } from '@/lib/scoring';
import { loadHistory, saveDiagnostic, deleteDiagnostic } from '@/lib/storage';
import { downloadReport } from '@/lib/download';
import { IntroScreen } from '@/components/screens/IntroScreen';
import { QuestionnaireScreen } from '@/components/screens/QuestionnaireScreen';
import { ResultScreen } from '@/components/screens/ResultScreen';
import { HistoryScreen } from '@/components/screens/HistoryScreen';

type Screen = 'intro' | 'questionnaire' | 'result' | 'history';

export function DiagnosticApp() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [history, setHistory] = useState<SavedDiagnostic[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [fromHistory, setFromHistory] = useState(false);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { refreshHistory(); }, []);

  async function refreshHistory() {
    setHistoryLoading(true);
    try { setHistory(await loadHistory()); }
    catch { showToast('Erro ao carregar histórico'); }
    finally { setHistoryLoading(false); }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  }

  const handleAnswer = useCallback((qi: number, oi: number, score: number) => {
    setAnswers(prev => ({ ...prev, [qi]: { optionIndex: oi, score } }));
  }, []);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    try {
      await saveDiagnostic(name, organization, answers);
      await refreshHistory();
      showToast('Diagnóstico salvo com sucesso');
    } catch { showToast('Erro ao salvar'); }
    finally { setSaving(false); }
  }

  function handleDownload() {
    downloadReport(name, organization, answers);
    showToast('Arquivo baixado');
  }

  function handleRestart() {
    setAnswers({});
    setFromHistory(false);
    setScreen('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleViewResult(saved: SavedDiagnostic) {
    setName(saved.name);
    setOrganization(saved.organization);
    setAnswers(saved.answers);
    setFromHistory(true);
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDeleteResult(supabaseId: string) {
    try { await deleteDiagnostic(supabaseId); await refreshHistory(); showToast('Diagnóstico removido'); }
    catch { showToast('Erro ao remover'); }
  }

  const result = screen === 'result' ? calculateResult(answers) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <span className="text-sm font-semibold text-neutral-500 tracking-wide flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-teal-700">
              <path d="M12 2L3 7v7c0 5.25 4.05 10.15 9 11.25C17 24.15 21 19.25 21 14V7L12 2z" />
              <polyline points="9 12 11 14 15 10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Proteção de Dados
          </span>
          {(name || organization) && screen !== 'intro' && (
            <span className="text-xs text-neutral-500 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-1 rounded-lg truncate max-w-[200px]">
              {name || organization}
            </span>
          )}
        </div>

        <div className="p-6">
          {screen === 'intro' && (
            <IntroScreen
              name={name} organization={organization}
              onNameChange={setName} onOrgChange={setOrganization}
              onStart={() => { setScreen('questionnaire'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              history={history} historyLoading={historyLoading}
              onViewResult={handleViewResult}
              onDeleteResult={handleDeleteResult}
              onViewHistory={() => setScreen('history')}
            />
          )}
          {screen === 'questionnaire' && (
            <QuestionnaireScreen
              answers={answers}
              onAnswer={handleAnswer}
              onSubmit={() => { setScreen('result'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            />
          )}
          {screen === 'result' && result && (
            <ResultScreen
              result={result} name={name} organization={organization} answers={answers}
              fromHistory={fromHistory} saving={saving}
              onBack={() => { setScreen(fromHistory ? 'history' : 'questionnaire'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              onSave={handleSave} onDownload={handleDownload} onRestart={handleRestart}
            />
          )}
          {screen === 'history' && (
            <HistoryScreen
              history={history} loading={historyLoading}
              onViewResult={handleViewResult}
              onDeleteResult={handleDeleteResult}
              onNewDiagnostic={handleRestart}
            />
          )}
        </div>

        <div className="text-center text-xs text-neutral-400 px-6 py-4 border-t border-neutral-100 dark:border-neutral-800">
          Diagnóstico de Conscientização em Proteção de Dados
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 text-neutral-100 text-sm px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap z-50">
          {toast}
        </div>
      )}
    </div>
  );
}