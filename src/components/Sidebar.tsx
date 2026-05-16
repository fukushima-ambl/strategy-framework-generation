import type { FrameworkId, FrameworkInfo } from '../types';

const FRAMEWORKS: FrameworkInfo[] = [
  { id: 'swot', label: 'SWOT分析', category: '戦略分析', priority: 'required' },
  { id: 'threeC', label: '3C分析', category: '戦略分析', priority: 'required' },
  { id: 'mece', label: 'MECEツリー', category: '戦略分析', priority: 'required' },
  { id: 'fiveForces', label: '5フォース分析', category: '事業評価', priority: 'high' },
  { id: 'ppm', label: 'PPMマトリクス', category: '事業評価', priority: 'high' },
  { id: 'valueChain', label: 'バリューチェーン', category: '事業評価', priority: 'medium' },
  { id: 'okr', label: 'OKR設計', category: '組織・実行', priority: 'medium' },
  { id: 'pmi', label: 'PMIロードマップ', category: '組織・実行', priority: 'low' },
];

const CATEGORIES = ['戦略分析', '事業評価', '組織・実行'];

interface SidebarProps {
  selected: FrameworkId;
  onSelect: (id: FrameworkId) => void;
  cachedFrameworks: Set<FrameworkId>;
}

export function Sidebar({ selected, onSelect, cachedFrameworks }: SidebarProps) {
  return (
    <aside className="w-52 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-3">
        {CATEGORIES.map(category => (
          <div key={category} className="mb-4">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 px-2">
              {category}
            </p>
            {FRAMEWORKS.filter(fw => fw.category === category).map(fw => (
              <button
                key={fw.id}
                onClick={() => onSelect(fw.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-0.5 flex items-center gap-2 transition-colors ${
                  selected === fw.id
                    ? 'bg-navy-700 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                style={selected === fw.id ? { backgroundColor: '#1B3A6B' } : {}}
              >
                {cachedFrameworks.has(fw.id) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" title="生成済み" />
                )}
                {!cachedFrameworks.has(fw.id) && <span className="w-1.5 h-1.5 shrink-0" />}
                {fw.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}

export { FRAMEWORKS };
