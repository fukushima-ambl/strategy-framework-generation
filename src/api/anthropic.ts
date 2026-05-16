import type { FrameworkId, FrameworkResult } from '../types';
import { FRAMEWORK_PROMPTS } from '../prompts/frameworkPrompts';

const BASE_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 2000;
const MAX_RETRIES = 3;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateFramework(
  frameworkId: FrameworkId,
  theme: string,
  onChunk: (text: string) => void
): Promise<FrameworkResult> {
  const config = FRAMEWORK_PROMPTS[frameworkId];
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey.includes('ここに')) {
    throw new Error('APIキーが設定されていません。.env.localファイルにVITE_ANTHROPIC_API_KEYを設定してください。');
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await sleep(Math.pow(2, attempt) * 1000);
    }

    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          stream: true,
          system: config.systemPrompt,
          messages: [
            { role: 'user', content: config.userPromptTemplate(theme) },
          ],
        }),
      });

      if (response.status === 429) {
        lastError = new Error('APIのレート制限に達しました。しばらく待ってから再試行してください。');
        continue;
      }

      if (!response.ok) {
        lastError = new Error(`APIエラーが発生しました（ステータス: ${response.status}）。しばらく待ってから再試行してください。`);
        continue;
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          try {
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') continue;
            const data = JSON.parse(jsonStr);
            if (data.type === 'content_block_delta' && data.delta?.text) {
              fullText += data.delta.text;
              onChunk(data.delta.text);
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }

      const jsonMatch = fullText.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        return {
          framework: frameworkId,
          theme,
          generated_at: new Date().toISOString().split('T')[0],
          data: {} as never,
          rawText: fullText,
        };
      }

      const parsed = JSON.parse(jsonMatch[1]);
      return {
        ...parsed,
        framework: frameworkId,
        theme,
        generated_at: parsed.generated_at || new Date().toISOString().split('T')[0],
      } as FrameworkResult;

    } catch (err) {
      lastError = err instanceof Error ? err : new Error('不明なエラーが発生しました');
      if (attempt === MAX_RETRIES - 1) break;
    }
  }

  throw lastError || new Error('フレームワークの生成に失敗しました');
}
