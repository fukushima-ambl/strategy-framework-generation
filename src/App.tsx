import { useState, useCallback } from 'react';
import type { FrameworkId, GenerationState, ResultCache } from './types';
import { generateFramework } from './api/anthropic';
import { Sidebar } from './components/Sidebar';
import { ThemeInput } from './components/ThemeInput';
import { FrameworkViewer } from './components/FrameworkViewer';
import { ExportButtons } from './components/ExportButtons';

function App() {
  const [theme, setTheme] = useState('');
  const [selectedFw, setSelectedFw] = useState<FrameworkId>('swot');
  const [darkMode, setDarkMode] = useState(false);
  const [generationState, setGenerationState] = useState<GenerationState>({
    status: 'idle',
    streamingText: '',
    result: null,
    error: null,
  });
  const [cache, setCache] = useState<ResultCache>(new Map());

  const getCacheKey = (t: string, fw: FrameworkId) => `${t}::${fw}`;

  const handleGenerate = useCallback(async (force = false) => {
    if (!theme.trim() || theme.trim().length < 10) return;

    const key = getCacheKey(theme, selectedFw);
    if (!force && cache.has(key)) {
      setGenerationState({
        status: 'success',
        streamingText: '',
        result: cache.get(key)!,
        error: null,
      });
      return;
    }

    setGenerationState({ status: 'loading', streamingText: '', result: null, error: null });

    try {
      const result = await generateFramework(selectedFw, theme, (chunk) => {
        setGenerationState(prev => ({
          ...prev,
          streamingText: prev.streamingText + chunk,
        }));
      });

      setCache(prev => {
        const next = new Map(prev);
        next.set(key, result);
        return next;
      });

      setGenerationState({ status: 'success', streamingText: '', result, error: null });
    } catch (err) {
      setGenerationState({
        status: 'error',
        streamingText: '',
        result: null,
        error: err instanceof Error ? err.message : '不明なエラーが発生しました',
      });
    }
  }, [theme, selectedFw, cache]);

  const handleSelectFw = useCallback((fw: FrameworkId) => {
    setSelectedFw(fw);
    const key = getCacheKey(theme, fw);
    if (cache.has(key)) {
      setGenerationState({
        status: 'success',
        streamingText: '',
        result: cache.get(key)!,
        error: null,
      });
    } else {
      setGenerationState({ status: 'idle', streamingText: '', result: null, error: null });
    }
  }, [theme, cache]);

  const cachedFrameworks = new Set<FrameworkId>(
    [...cache.keys()]
      .filter(k => k.startsWith(theme + '::'))
      .map(k => k.split('::')[1] as FrameworkId)
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <ThemeInput
            theme={theme}
            onThemeChange={setTheme}
            onGenerate={() => handleGenerate(false)}
            isLoading={generationState.status === 'loading'}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode(d => !d)}
          />
          <ExportButtons
            selectedFw={selectedFw}
            result={generationState.result}
            theme={theme}
          />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            selected={selectedFw}
            onSelect={handleSelectFw}
            cachedFrameworks={cachedFrameworks}
          />
          <FrameworkViewer
            selectedFw={selectedFw}
            state={generationState}
            onRegenerate={() => handleGenerate(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
