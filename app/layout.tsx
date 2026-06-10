import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Matriz 4Q-LGPD — Diagnóstico de Maturidade em Proteção de Dados',
  description:
    'Radar de Maturidade em Proteção de Dados. Avalie sua organização em 5 pilares e receba um diagnóstico completo com posicionamento gráfico e plano de evolução.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
