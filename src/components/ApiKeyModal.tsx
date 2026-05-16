import { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
}

export function ApiKeyModal({ onSave }: ApiKeyModalProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    const trimmed = input.trim();
    if (!trimmed.startsWith('AIza') || trimmed.length < 20) {
      setError('有効なAPIキーを入力してください（AIzaSy... の形式）');
      return;
    }
    localStorage.setItem('gemini_api_key', trimmed);
    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
          Gemini API キーを設定
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Google AI Studio で無料取得できます。キーはお使いのブラウザ内にのみ保存されます。
        </p>

        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          → Google AI Studio でAPIキーを取得
        </a>

        <div className="mb-1">
          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!input.trim()}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#1B3A6B' }}
          >
            保存して始める
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          無料枠：1日1,500リクエスト／毎分15リクエスト
        </p>
      </div>
    </div>
  );
}
