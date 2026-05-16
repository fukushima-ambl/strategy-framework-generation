import type { FrameworkId, FrameworkResult } from '../types';
import { FRAMEWORK_PROMPTS } from '../prompts/frameworkPrompts';

const MODEL = 'gemini-2.5-flash';
const MAX_RETRIES = 3;

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getBaseUrl(apiKey: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;
}

export async function generateFramework(
  frameworkId: FrameworkId,
  theme: string,
  onChunk: (text: string) => void
): Promise<FrameworkResult> {
  const config = FRAMEWORK_PROMPTS[frameworkId];
  const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('APIキーが設定されていません。画面上部の「APIキー設定」から登録してください。');
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await sleep(Math.pow(2, attempt) * 1000);
    }

    try {
      const response = await fetch(getBaseUrl(apiKey), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: config.systemPrompt }],
          },
          contents: [
            { role: 'user', parts: [{ text: config.userPromptTemplate(theme) }] },
          ],
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        const errBody = await response.text().catch(() => '');
        if (response.status === 429) {
          lastError = new Error(`APIのレート制限に達しました（1分あたり5回・1日20回が上限）。しばらく待ってから再試行してください。詳細: ${errBody}`);
        } else {
          lastError = new Error(`APIエラーが発生しました（ステータス: ${response.status}）。${errBody}`);
        }
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
            const jsonStr = line.slice(6).trim();
            if (!jsonStr || jsonStr === '[DONE]') continue;
            const data = JSON.parse(jsonStr);
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              fullText += text;
              onChunk(text);
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
