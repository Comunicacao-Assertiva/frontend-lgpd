import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Diagnóstico de Conscientização em Proteção de Dados',
  description: 'Responda as questões e receba um diagnóstico completo com seu nível de conscientização.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}