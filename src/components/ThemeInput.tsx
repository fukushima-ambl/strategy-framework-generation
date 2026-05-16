import { useState } from 'react';

interface ThemeInputProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  darkMode: boolean;
  onToggleDark: () => void;
}

export function ThemeInput({ theme, onThemeChange, onGenerate, isLoading, darkMode, onToggleDark }: ThemeInputProps) {
  const [touched, setTouched] = useState(false);
  const isValid = theme.trim().length >= 10;
  const showWarning = touched && !isValid;

  return (
    <>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={theme}
            onChange={e => {
              onThemeChange(e.target.value);
              setTouched(true);
            }}
            placeholder="例：国内製造業DX市場への新規参入戦略"
            className={`flex-1 px-3 py-2 rounded-lg border text-sm bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showWarning ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          <button
            onClick={onGenerate}
            disabled={!isValid || isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#1B3A6B' }}
          >
            {isLoading ? '生成中...' : '生成'}
          </button>
        </div>
        {showWarning && (
          <p className="text-xs text-red-500 pl-1">テーマは10文字以上入力してください</p>
        )}
      </div>
      <button
        onClick={onToggleDark}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title={darkMode ? 'ライトモード' : 'ダークモード'}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </>
  );
}
