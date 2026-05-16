import type { FrameworkId, FrameworkResult } from '../types';
import { exportToPptx } from '../exporters/exportPptx';
import { exportToDocx } from '../exporters/exportDocx';

interface ExportButtonsProps {
  selectedFw: FrameworkId;
  result: FrameworkResult | null;
  theme: string;
}

export function ExportButtons({ selectedFw, result, theme }: ExportButtonsProps) {
  const disabled = !result || !!result.rawText;

  const handlePptx = async () => {
    if (!result) return;
    try {
      await exportToPptx(selectedFw, result, theme);
    } catch (e) {
      alert('PPTX出力に失敗しました: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleDocx = async () => {
    if (!result) return;
    try {
      await exportToDocx(selectedFw, result, theme);
    } catch (e) {
      alert('DOCX出力に失敗しました: ' + (e instanceof Error ? e.message : String(e)));
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handlePptx}
        disabled={disabled}
        className="px-3 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: '#1B3A6B', color: '#1B3A6B' }}
        title="PowerPoint形式でエクスポート"
      >
        ↓ PPTX
      </button>
      <button
        onClick={handleDocx}
        disabled={disabled}
        className="px-3 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: '#2D7DD2', color: '#2D7DD2' }}
        title="Word形式でエクスポート"
      >
        ↓ DOCX
      </button>
    </div>
  );
}
