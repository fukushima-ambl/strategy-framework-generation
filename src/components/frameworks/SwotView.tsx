import type { SwotData } from '../../types';

interface SwotViewProps {
  data: SwotData;
}

const QUADRANTS = [
  { key: 'strengths' as const, label: 'Strengths　強み', color: '#1D9E75', bg: '#f0fdf8' },
  { key: 'weaknesses' as const, label: 'Weaknesses　弱み', color: '#D85A30', bg: '#fff7f5' },
  { key: 'opportunities' as const, label: 'Opportunities　機会', color: '#378ADD', bg: '#f0f7ff' },
  { key: 'threats' as const, label: 'Threats　脅威', color: '#E24B4A', bg: '#fff5f5' },
];

const CROSS_LABELS: Record<string, string> = {
  so: 'SO戦略（強み×機会）',
  wo: 'WO戦略（弱み×機会）',
  st: 'ST戦略（強み×脅威）',
  wt: 'WT戦略（弱み×脅威）',
};

export function SwotView({ data }: SwotViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {QUADRANTS.map(q => (
          <div
            key={q.key}
            className="rounded-xl border p-4 dark:bg-gray-800 dark:border-gray-700"
            style={{ borderColor: q.color + '44', backgroundColor: q.bg }}
          >
            <p className="text-xs font-bold mb-2 dark:text-gray-200" style={{ color: q.color }}>
              {q.label}
            </p>
            <ul className="space-y-1">
              {data[q.key].map((item, i) => (
                <li
                  key={i}
                  contentEditable
                  suppressContentEditableWarning
                  className="text-sm text-gray-700 dark:text-gray-200 px-1 rounded cursor-text"
                >
                  ・{item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">クロスSWOT戦略</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(data.cross_swot).map(([key, val]) => (
            <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{CROSS_LABELS[key]}</p>
              <p
                contentEditable
                suppressContentEditableWarning
                className="text-sm text-gray-700 dark:text-gray-200 cursor-text rounded px-1"
              >
                {val}
              </p>
            </div>
          ))}
        </div>
      </div>

      {data.key_insight && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 p-4">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">最重要インサイト</p>
          <p
            contentEditable
            suppressContentEditableWarning
            className="text-sm text-gray-700 dark:text-gray-200 cursor-text rounded px-1"
          >
            {data.key_insight}
          </p>
        </div>
      )}
    </div>
  );
}
