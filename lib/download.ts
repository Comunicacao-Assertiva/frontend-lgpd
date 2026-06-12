import { Answers } from '@/types';
import { calculateResult } from './scoring';
import { QUESTIONS, LEVELS } from './data';

export function downloadReport(name: string, organization: string, answers: Answers): void {
  const result = calculateResult(answers);
  const l = result.level;
  const date = new Date().toLocaleDateString('pt-BR');

  const rows = QUESTIONS.map((q, qi) => {
    const a = answers[qi];
    const chosen = a !== undefined ? q.options[a.optionIndex] : null;
    const isCorrect = chosen?.score === 2;
    const isPartial = chosen?.score === 1;
    const bc = isCorrect ? '#1D9E75' : isPartial ? '#EF9F27' : '#E24B4A';
    const bg = isCorrect ? '#E1F5EE' : isPartial ? '#FAEEDA' : '#FCEBEB';
    const label = isCorrect ? 'Correto' : isPartial ? 'Parcial' : 'Atenção';
    return `<div style="padding:.75rem;border-radius:8px;background:${bg};border:1px solid ${bc};margin-bottom:6px">
<div style="display:flex;justify-content:space-between;margin-bottom:.25rem">
<span style="font-size:12px;font-weight:600">${q.id}. ${q.text}</span>
<span style="font-size:11px;font-weight:700;color:${bc}">${label}</span>
</div>
<div style="font-size:12px;color:#666">Resposta: <strong>${chosen?.text ?? '—'}</strong></div>
</div>`;
  }).join('');

  const steps = l.steps.map((s, i) => `
<div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
<span style="width:20px;height:20px;border-radius:50%;background:${l.color};color:#fff;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</span>
<span style="font-size:13px">${s}</span></div>`).join('');

  const levelGrid = LEVELS.map(lv => `
<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
<div style="width:8px;height:8px;border-radius:50%;background:${lv.color}"></div>
<span style="font-size:11px;color:${lv.id===l.id?lv.color:'#999'};font-weight:${lv.id===l.id?'700':'400'}">${lv.name}${lv.id===l.id?' ← você':''}</span>
</div>`).join('');

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Conscientização — ${name||'Resultado'}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;background:#f0efeb;padding:2rem 1rem;color:#1a1a1a}
.shell{max-width:640px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid rgba(0,0,0,.12);overflow:hidden}
.header{background:#085041;color:#9FE1CB;padding:1.5rem;display:flex;justify-content:space-between;align-items:center}
.body{padding:1.75rem 1.5rem}.hero{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1.25rem}
.hc{background:#f7f7f5;border:1px solid rgba(0,0,0,.1);border-radius:12px;padding:1.25rem}
.h3{font-size:15px;font-weight:700;margin:1.25rem 0 .75rem}
footer{text-align:center;font-size:11px;color:#999;padding:1rem;border-top:1px solid rgba(0,0,0,.08)}
@media print{body{padding:0;background:#fff}.shell{border:none;border-radius:0;max-width:100%}}</style></head>
<body><div class="shell">
<div class="header"><span style="font-size:14px;font-weight:600">🔐 Diagnóstico de Conscientização — LGPD</span><span style="font-size:12px;opacity:.8">${date}</span></div>
<div class="body">
<h2 style="font-size:20px;font-weight:700;margin-bottom:.25rem">${l.name}</h2>
<p style="font-size:14px;color:#666;margin-bottom:1.25rem">${l.situation}${name?' · '+name:''}${organization?' · '+organization:''}</p>
<div class="hero">
<div class="hc" style="text-align:center"><div style="font-size:48px;font-weight:700;color:${l.color};line-height:1">${result.totalScore}<span style="font-size:22px;color:#999">/24</span></div><div style="font-size:12px;color:#666;margin-top:4px">${result.percentage}% de acerto</div></div>
<div class="hc"><div style="font-size:12px;font-weight:600;color:#333;margin-bottom:.5rem">Nível</div>${levelGrid}</div>
</div>
<div style="border-radius:12px;padding:1rem;background:${l.bgColor};border:1px solid ${l.borderColor};margin:.75rem 0">
<div style="font-size:12px;font-weight:700;color:${l.textColor};margin-bottom:.35rem">Recomendação</div>
<div style="font-size:13px;line-height:1.65">${l.action}</div>
</div>
<h3 class="h3">Próximos passos</h3>${steps}
<h3 class="h3">Revisão das respostas</h3>${rows}
</div>
<footer>Diagnóstico de Conscientização em Proteção de Dados · ${date}</footer>
</div></body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const slug = (name||organization||'diagnostico').replace(/[^a-zA-Z0-9\u00C0-\u024F]/g,'-').toLowerCase();
  a.href = url; a.download = `consciencializacao-${slug}-${new Date().toISOString().slice(0,10)}.html`;
  a.click(); URL.revokeObjectURL(url);
}