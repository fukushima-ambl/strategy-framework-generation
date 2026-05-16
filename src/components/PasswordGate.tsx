import { useState } from 'react';

const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD ?? '';

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem('app_authed') === 'true'
  );

  if (!CORRECT_PASSWORD || authed) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === CORRECT_PASSWORD) {
      sessionStorage.setItem('app_authed', 'true');
      setAuthed(true);
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <p className="text-2xl mb-2">📊</p>
          <h1 className="text-lg font-bold text-gray-800">戦略フレームワーク生成ツール</h1>
          <p className="text-sm text-gray-500 mt-1">このツールは社内専用です</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              value={input}
              onChange={e => { setInput(e.target.value); setError(false); }}
              placeholder="パスワードを入力"
              autoFocus
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'
              }`}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">パスワードが正しくありません</p>
            )}
          </div>
          <button
            type="submit"
            disabled={!input}
            className="w-full py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: '#1B3A6B' }}
          >
            入力
          </button>
        </form>
      </div>
    </div>
  );
}
