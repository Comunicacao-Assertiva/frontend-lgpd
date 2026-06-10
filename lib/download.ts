import { Answers } from '@/types';
import { calculateResult } from './scoring';
import { QUADRANTS } from './data';

export function downloadReport(organization: string, answers: Answers): void {
  const result = calculateResult(answers);
  const q = result.quadrant;
  const date = new Date().toLocaleDateString('pt-BR');

  const pillarBars = result.pillarScores
    .map(p => {
      const color =
        p.percentage >= 76 ? '#378ADD'
        : p.percentage >= 51 ? '#1D9E75'
        : p.percentage >= 26 ? '#EF9F27'
        : '#E24B4A';
      return `
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
            <span>${p.name}</span>
            <span style="color:#666">${p.score}/${p.maxScore} · ${p.percentage}%</span>
          </div>
          <div style="height:6px;background:#eee;border-radius:3px">
            <div style="height:100%;width:${p.percentage}%;background:${color};border-radius:3px"></div>
          </div>
        </div>`;
    })
    .join('');

  const nextSteps = q.nextSteps
    .map(
      (step, i) => `
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
        <span style="width:22px;height:22px;border-radius:50%;background:${q.color};color:#fff;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">${i + 1}</span>
        <span style="font-size:13px">${step}</span>
      </div>`
    )
    .join('');

  const quadrantGrid = QUADRANTS.map(qx => `
    <div style="padding:.875rem;border-radius:10px;border:${qx.id === q.id ? `2px solid ${qx.borderColor}` : '1px solid rgba(0,0,0,.1)'};background:${qx.id === q.id ? qx.bgColor : '#f7f7f5'};opacity:${qx.id === q.id ? 1 : 0.5}">
      <div style="font-size:10px;color:${qx.id === q.id ? qx.textColor : '#999'}">Q${qx.id}</div>
      <div style="font-size:12px;font-weight:600;color:${qx.id === q.id ? qx.textColor : '#666'}">${qx.name}</div>
      ${qx.id === q.id ? `<div style="font-size:11px;color:${qx.color};margin-top:2px">← você está aqui</div>` : ''}
    </div>`).join('');

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>4Q-LGPD — ${organization || 'Diagnóstico'}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f0efeb; padding: 2rem 1rem; color: #1a1a1a; }
    .shell { max-width: 680px; margin: 0 auto; background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,.12); overflow: hidden; }
    .header { background: #085041; color: #9FE1CB; padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; }
    .body { padding: 1.75rem 1.5rem; }
    h2 { font-size: 20px; font-weight: 700; margin-bottom: .25rem; }
    .sub { font-size: 14px; color: #666; margin-bottom: 1.5rem; }
    .hero { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 1.5rem; }
    .hcard { background: #f7f7f5; border: 1px solid rgba(0,0,0,.1); border-radius: 12px; padding: 1.25rem; }
    .quad-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 1.5rem; }
    .section-title { font-size: 15px; font-weight: 700; margin: 1.5rem 0 .75rem; }
    .card { background: #fff; border: 1px solid rgba(0,0,0,.1); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: .75rem; }
    footer { text-align: center; font-size: 11px; color: #999; padding: 1rem 1.5rem; border-top: 1px solid rgba(0,0,0,.08); }
    @media print { body { padding: 0; background: #fff; } .shell { border: none; border-radius: 0; max-width: 100%; } }
  </style>
</head>
<body>
  <div class="shell">
    <div class="header">
      <span style="font-size:14px;font-weight:600;letter-spacing:.06em">🔐 Matriz 4Q-LGPD</span>
      <span style="font-size:12px;opacity:.8">Emitido em ${date}</span>
    </div>
    <div class="body">
      <h2>Q${q.id} — ${q.name}</h2>
      <p class="sub">${organization} · ${q.situation}</p>

      <div class="hero">
        <div class="hcard" style="text-align:center">
          <div style="font-size:48px;font-weight:700;color:${q.color};line-height:1">${result.totalScore}<span style="font-size:22px;color:#999">/120</span></div>
          <div style="font-size:12px;color:#666;margin-top:4px">${result.percentage}% de maturidade</div>
        </div>
        <div class="hcard">
          <div style="margin-bottom:.75rem">
            <div style="font-size:11px;color:#666;margin-bottom:3px">Eixo X — Governança</div>
            <div style="font-size:20px;font-weight:700">${result.govPercentage}%</div>
            <div style="height:5px;background:#eee;border-radius:3px;margin-top:4px">
              <div style="height:100%;width:${result.govPercentage}%;background:#378ADD;border-radius:3px"></div>
            </div>
          </div>
          <div>
            <div style="font-size:11px;color:#666;margin-bottom:3px">Eixo Y — Segurança e Operação</div>
            <div style="font-size:20px;font-weight:700">${result.secPercentage}%</div>
            <div style="height:5px;background:#eee;border-radius:3px;margin-top:4px">
              <div style="height:100%;width:${result.secPercentage}%;background:#1D9E75;border-radius:3px"></div>
            </div>
          </div>
        </div>
      </div>

      <p class="section-title">Posicionamento</p>
      <div class="quad-grid">${quadrantGrid}</div>

      <p class="section-title">Pontuação por pilar</p>
      <div class="card">${pillarBars}</div>

      <div style="border-radius:12px;padding:1rem 1.25rem;margin:.75rem 0;border:1px solid ${q.borderColor};background:${q.bgColor}">
        <div style="font-size:12px;font-weight:700;color:${q.textColor};margin-bottom:.4rem">Ação recomendada</div>
        <div style="font-size:13.5px;line-height:1.65">${q.action}</div>
      </div>

      ${q.nextSteps.length ? `<p class="section-title">Próximos passos — rumo a ${q.nextQuadrant}</p>${nextSteps}` : ''}
    </div>
    <footer>Matriz 4Q-LGPD · Diagnóstico emitido em ${date} · ${organization}</footer>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const slug = (organization || 'diagnostico').replace(/[^a-zA-Z0-9\u00C0-\u024F]/g, '-').toLowerCase();
  a.href = url;
  a.download = `4q-lgpd-${slug}-${new Date().toISOString().slice(0, 10)}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
