import type { OkrData } from '../../types';

interface OkrViewProps {
  data: OkrData;
}

export function OkrView({ data }: OkrViewProps) {
  return (
    <div className="space-y-4">
      {data.objectives.map((obj, i) => (
        <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="px-4 py-3 text-white text-sm font-bold" style={{ backgroundColor: '#1B3A6B' }}>
            O{i + 1}: {obj.objective}
          </div>
          <div className="p-4 space-y-2">
            {obj.key_results.map((kr, j) => (
              <div key={j} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">KR{j + 1}</span>
                <div className="flex-1">
                  <p contentEditable suppressContentEditableWarning className="text-sm text-gray-700 dark:text-gray-200 cursor-text rounded">
                    {kr.kr}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    目標値: <span contentEditable suppressContentEditableWarning className="font-semibold cursor-text">{kr.target} {kr.unit}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {data.review_cycle && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800 p-4">
          <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">レビューサイクル</p>
          <p contentEditable suppressContentEditableWarning className="text-sm text-gray-700 dark:text-gray-200 cursor-text rounded px-1">
            {data.review_cycle}
          </p>
        </div>
      )}
    </div>
  );
}
