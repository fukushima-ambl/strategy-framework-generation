import type { ThreeCData } from '../../types';

interface ThreeCViewProps {
  data: ThreeCData;
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 dark:border-gray-700" style={{ borderColor: color + '44' }}>
      <h3 className="text-sm font-bold mb-3" style={{ color }}>{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | string[] }) {
  return (
    <div className="mb-2">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
      {Array.isArray(value) ? (
        <ul>
          {value.map((v, i) => (
            <li key={i} contentEditable suppressContentEditableWarning className="text-sm text-gray-700 dark:text-gray-200 cursor-text rounded px-1">
              ・{v}
            </li>
          ))}
        </ul>
      ) : (
        <p contentEditable suppressContentEditableWarning className="text-sm text-gray-700 dark:text-gray-200 font-medium cursor-text rounded px-1">{value}</p>
      )}
    </div>
  );
}

export function ThreeCView({ data }: ThreeCViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Section title="Customer　顧客" color="#378ADD">
          <Row label="市場規模" value={data.customer.market_size} />
          <Row label="成長率" value={data.customer.growth_rate} />
          <Row label="主要セグメント" value={data.customer.key_segment} />
          <Row label="購買意思決定者" value={data.customer.decision_maker} />
          <Row label="ペインポイント" value={data.customer.pain_points} />
          <Row label="評価基準" value={data.customer.buying_criteria} />
        </Section>

        <Section title="Competitor　競合" color="#E24B4A">
          <Row label="主要企業" value={data.competitor.leaders} />
          <Row label="競合の強み" value={data.competitor.their_strengths} />
          <Row label="競合の弱み" value={data.competitor.their_weaknesses} />
          <Row label="参入障壁" value={data.competitor.entry_barriers} />
        </Section>

        <Section title="Company　自社" color="#1D9E75">
          <Row label="コアの強み" value={data.company.core_strengths} />
          <Row label="保有リソース" value={data.company.resources} />
          <Row label="差別化ポイント" value={data.company.differentiators} />
          <Row label="補完すべき課題" value={data.company.gaps} />
        </Section>
      </div>

      {data.ksf && data.ksf.length > 0 && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 p-4">
          <h3 className="text-sm font-bold text-yellow-700 dark:text-yellow-400 mb-2">重要成功要因（KSF）</h3>
          <div className="flex flex-wrap gap-2">
            {data.ksf.map((factor, i) => (
              <span
                key={i}
                contentEditable
                suppressContentEditableWarning
                className="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-sm cursor-text"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
