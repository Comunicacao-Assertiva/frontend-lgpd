'use client';

interface QuadrantMatrixProps {
  govPercentage: number;
  secPercentage: number;
  dotColor: string;
}

const CELLS = [
  { label: 'Q2\nConf. Inicial',    top: 0, left: 0,  textColor: '#633806', bg: '#FAEEDA' },
  { label: 'Q4\nExcelência',       top: 0, right: 0, textColor: '#0C447C', bg: '#E6F1FB', alignRight: true },
  { label: 'Q1\nRisco Crítico',    bottom: 0, left: 0,  textColor: '#A32D2D', bg: '#FCEBEB', alignBottom: true },
  { label: 'Q3\nGov. Estruturada', bottom: 0, right: 0, textColor: '#085041', bg: '#E1F5EE', alignBottom: true, alignRight: true },
];

export function QuadrantMatrix({ govPercentage, secPercentage, dotColor }: QuadrantMatrixProps) {
  return (
    <div className="flex gap-2 items-stretch">
      {/* Plot area */}
      <div className="flex-1 min-w-0">
        <div className="relative w-full pb-[100%] border border-neutral-300 dark:border-neutral-600 rounded-xl overflow-hidden">
          <div className="absolute inset-0">
            {/* Quadrant cells */}
            {CELLS.map((cell, i) => (
              <div
                key={i}
                className="absolute w-1/2 h-1/2 flex p-2"
                style={{
                  top: cell.top !== undefined ? cell.top : undefined,
                  bottom: cell.bottom !== undefined ? cell.bottom : undefined,
                  left: cell.left !== undefined ? cell.left : undefined,
                  right: cell.right !== undefined ? cell.right : undefined,
                  background: cell.bg,
                  opacity: 0.55,
                  alignItems: cell.alignBottom ? 'flex-end' : 'flex-start',
                  justifyContent: cell.alignRight ? 'flex-end' : 'flex-start',
                  textAlign: cell.alignRight ? 'right' : 'left',
                }}
              >
                <span
                  className="text-[10px] font-semibold leading-snug whitespace-pre-line"
                  style={{ color: cell.textColor }}
                >
                  {cell.label}
                </span>
              </div>
            ))}

            {/* Axis lines */}
            <div className="absolute left-1/2 top-0 w-px h-full bg-neutral-300 dark:bg-neutral-600" />
            <div className="absolute top-1/2 left-0 h-px w-full bg-neutral-300 dark:bg-neutral-600" />

            {/* Dot ring */}
            <div
              className="absolute w-7 h-7 rounded-full transition-all duration-700 ease-in-out z-10"
              style={{
                left: `${govPercentage}%`,
                bottom: `${secPercentage}%`,
                transform: 'translate(-50%, 50%)',
                background: dotColor,
                opacity: 0.22,
              }}
            />
            {/* Dot */}
            <div
              className="absolute w-3.5 h-3.5 rounded-full transition-all duration-700 ease-in-out z-20 shadow-[0_0_0_3px_rgba(255,255,255,0.5)]"
              style={{
                left: `${govPercentage}%`,
                bottom: `${secPercentage}%`,
                transform: 'translate(-50%, 50%)',
                background: dotColor,
              }}
            />
          </div>
        </div>
        {/* X-axis label */}
        <div className="flex justify-between text-[10px] text-neutral-400 mt-1 px-0.5">
          <span>Baixa governança</span>
          <span className="font-semibold">Eixo X — Governança →</span>
          <span>Alta governança</span>
        </div>
      </div>

      {/* Y-axis label */}
      <div className="flex flex-col justify-between text-[10px] text-neutral-400 w-14 shrink-0 text-right pb-6">
        <span>Alta<br />segurança</span>
        <span>Eixo Y —<br />Segurança →</span>
        <span>Baixa<br />segurança</span>
      </div>
    </div>
  );
}
