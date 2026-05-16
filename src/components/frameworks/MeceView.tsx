import type { MeceData } from '../../types';

interface MeceViewProps {
  data: MeceData;
}

const COLORS = ['#1B3A6B', '#2D7DD2', '#378ADD', '#64a9e8'];

export function MeceView({ data }: MeceViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <div
          className="px-6 py-3 rounded-xl text-white text-sm font-bold shadow-md mb-6"
          style={{ backgroundColor: COLORS[0] }}
        >
          {data.root}
        </div>

        <div className="w-full grid gap-4" style={{ gridTemplateColumns: `repeat(${data.level1.length}, 1fr)` }}>
          {data.level1.map((node, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div
                className="w-full px-3 py-2 rounded-lg text-white text-sm font-semibold text-center"
                style={{ backgroundColor: COLORS[1] }}
              >
                {node.label}
              </div>
              <div className="w-full space-y-2">
                {node.children.map((child, j) => (
                  <div
                    key={j}
                    contentEditable
                    suppressContentEditableWarning
                    className="w-full px-3 py-2 rounded-lg text-sm text-center border cursor-text"
                    style={{
                      borderColor: COLORS[2] + '66',
                      backgroundColor: '#f0f7ff',
                      color: '#1B3A6B',
                    }}
                  >
                    {child}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {data.mece_check && (
        <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 p-4">
          <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-1">MECEチェック</p>
          <p contentEditable suppressContentEditableWarning className="text-sm text-gray-700 dark:text-gray-200 cursor-text rounded px-1">
            {data.mece_check}
          </p>
        </div>
      )}
    </div>
  );
}
