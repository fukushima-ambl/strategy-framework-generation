import type { FrameworkId, FrameworkResult, GenerationState } from '../types';
import { SwotView } from './frameworks/SwotView';
import { ThreeCView } from './frameworks/ThreeCView';
import { MeceView } from './frameworks/MeceView';
import { FiveForcesView } from './frameworks/FiveForcesView';
import { OkrView } from './frameworks/OkrView';
import { ErrorBoundary } from './ErrorBoundary';
import type { SwotData, ThreeCData, MeceData, FiveForcesData, OkrData } from '../types';

interface FrameworkViewerProps {
  selectedFw: FrameworkId;
  state: GenerationState;
  onRegenerate: () => void;
}

const FW_LABELS: Record<FrameworkId, string> = {
  swot: 'SWOT分析',
  threeC: '3C分析',
  mece: 'MECEツリー',
  fiveForces: '5フォース分析',
  ppm: 'PPMマトリクス',
  valueChain: 'バリューチェーン分析',
  okr: 'OKR設計',
  pmi: 'PMIロードマップ',
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="rounded-xl bg-gray-200 dark:bg-gray-700 h-40" />
        ))}
      </div>
      <div className="rounded-xl bg-gray-200 dark:bg-gray-700 h-32" />
    </div>
  );
}

function StreamingView({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-mono">生成中...</p>
      <pre className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap font-mono leading-relaxed">
        {text}
      </pre>
    </div>
  );
}

function renderFramework(fw: FrameworkId, result: FrameworkResult) {
  const data = result.data;
  if (result.rawText) {
    return (
      <div className="rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/20 p-4">
        <p className="text-sm font-bold text-orange-600 mb-2">生成結果（テキスト表示）：</p>
        <pre className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{result.rawText}</pre>
      </div>
    );
  }

  let inner: React.ReactNode;
  try {
    switch (fw) {
      case 'swot': inner = <SwotView data={data as SwotData} />; break;
      case 'threeC': inner = <ThreeCView data={data as ThreeCData} />; break;
      case 'mece': inner = <MeceView data={data as MeceData} />; break;
      case 'fiveForces': inner = <FiveForcesView data={data as FiveForcesData} />; break;
      case 'okr': inner = <OkrView data={data as OkrData} />; break;
      default:
        inner = (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <pre className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  } catch {
    inner = (
      <div className="rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/20 p-4">
        <p className="text-sm font-bold text-orange-600 mb-2">表示処理でエラーが発生しました。生データ表示：</p>
        <pre className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  return <ErrorBoundary>{inner}</ErrorBoundary>;
}

export function FrameworkViewer({ selectedFw, state, onRegenerate }: FrameworkViewerProps) {
  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100" style={{ color: '#1B3A6B' }}>
          {FW_LABELS[selectedFw]}
        </h2>
        {state.status === 'success' && (
          <button
            onClick={onRegenerate}
            className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            再生成
          </button>
        )}
      </div>

      {state.status === 'idle' && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-600">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-sm">テーマを入力して「生成」ボタンを押してください</p>
        </div>
      )}

      {state.status === 'loading' && (
        state.streamingText ? <StreamingView text={state.streamingText} /> : <LoadingSkeleton />
      )}

      {state.status === 'error' && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">エラーが発生しました</p>
          <p className="text-sm text-red-500">{state.error}</p>
          <button
            onClick={onRegenerate}
            className="mt-3 text-sm px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-200 transition-colors"
          >
            再試行
          </button>
        </div>
      )}

      {state.status === 'success' && state.result && (
        renderFramework(selectedFw, state.result)
      )}
    </div>
  );
}
