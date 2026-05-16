import type { FiveForcesData } from '../../types';

interface FiveForcesViewProps {
  data: FiveForcesData;
}

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '高': { bg: '#fff1f0', text: '#cf1322', border: '#ffa39e' },
  '中': { bg: '#fffbe6', text: '#ad6800', border: '#ffe58f' },
  '低': { bg: '#f6ffed', text: '#135200', border: '#b7eb8f' },
};

function ForceCard({ title, force }: { title: string; force: { level: string; factors: string[] } }) {
  const colors = LEVEL_COLORS[force.level] || LEVEL_COLORS['中'];
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">{title}</h3>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
        >
          {force.level}
        </span>
      </div>
      <ul className="space-y-1">
        {force.factors.map((f, i) => (
          <li key={i} contentEditable suppressContentEditableWarning className="text-sm text-gray-600 dark:text-gray-300 cursor-text rounded px-1">
            ・{f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FiveForcesView({ data }: FiveForcesViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <ForceCard title="新規参入の脅威" force={data.new_entrants} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <ForceCard title="売り手の交渉力" force={data.supplier_power} />
        <ForceCard title="業界内競合" force={data.rivalry} />
        <ForceCard title="買い手の交渉力" force={data.buyer_power} />
      </div>
      <div className="flex justify-center">
        <ForceCard title="代替品の脅威" force={data.substitutes} />
      </div>
      {data.overall_attractiveness && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-4">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">業界魅力度総評</p>
          <p contentEditable suppressContentEditableWarning className="text-sm text-gray-700 dark:text-gray-200 cursor-text rounded px-1">
            {data.overall_attractiveness}
          </p>
        </div>
      )}
    </div>
  );
}
