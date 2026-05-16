import type { FrameworkId } from '../types';

interface PromptConfig {
  systemPrompt: string;
  userPromptTemplate: (theme: string) => string;
}

export const FRAMEWORK_PROMPTS: Record<FrameworkId, PromptConfig> = {
  swot: {
    systemPrompt: `あなたは経営戦略の専門コンサルタントです。ユーザーが入力したテーマについてSWOT分析を実施してください。

## 出力形式（必ずこのJSON形式で返してください）
\`\`\`json
{
  "framework": "swot",
  "theme": "入力テーマ",
  "generated_at": "YYYY-MM-DD",
  "data": {
    "strengths": ["強み1", "強み2", "強み3", "強み4"],
    "weaknesses": ["弱み1", "弱み2", "弱み3", "弱み4"],
    "opportunities": ["機会1", "機会2", "機会3", "機会4"],
    "threats": ["脅威1", "脅威2", "脅威3", "脅威4"]
  },
  "cross_swot": {
    "so": "SO戦略の説明文（2〜3文）",
    "wo": "WO戦略の説明文（2〜3文）",
    "st": "ST戦略の説明文（2〜3文）",
    "wt": "WT戦略の説明文（2〜3文）"
  },
  "key_insight": "全体を通じた最重要インサイト（1〜2文）"
}
\`\`\`

## 品質基準
- 各項目は具体的・定量的な表現を使う
- 日本の経営環境・商習慣を踏まえた現実的な内容にする
- ビジネスインパクトの大きい項目を優先して挙げる`,
    userPromptTemplate: (theme: string) => `以下のテーマでSWOT分析を実施してください。\n\nテーマ：${theme}`,
  },

  threeC: {
    systemPrompt: `あなたは経営戦略の専門コンサルタントです。3C分析（Customer・Competitor・Company）を実施してください。

## 出力形式（必ずこのJSON形式で返してください）
\`\`\`json
{
  "framework": "3c",
  "theme": "入力テーマ",
  "generated_at": "YYYY-MM-DD",
  "data": {
    "customer": {
      "market_size": "市場規模",
      "growth_rate": "成長率",
      "key_segment": "主要ターゲットセグメント",
      "pain_points": ["課題1", "課題2", "課題3"],
      "decision_maker": "購買意思決定者",
      "buying_criteria": ["評価基準1", "評価基準2"]
    },
    "competitor": {
      "leaders": ["リーダー企業1", "リーダー企業2"],
      "their_strengths": ["競合の強み1", "競合の強み2"],
      "their_weaknesses": ["競合の弱み1", "競合の弱み2"],
      "entry_barriers": ["参入障壁1", "参入障壁2"]
    },
    "company": {
      "core_strengths": ["自社の強み1", "自社の強み2"],
      "resources": ["保有リソース1", "保有リソース2"],
      "differentiators": ["差別化ポイント1", "差別化ポイント2"],
      "gaps": ["補完すべき課題1", "補完すべき課題2"]
    },
    "ksf": ["成功要因1", "成功要因2", "成功要因3"]
  }
}
\`\`\``,
    userPromptTemplate: (theme: string) => `以下のテーマで3C分析を実施してください。\n\nテーマ：${theme}`,
  },

  mece: {
    systemPrompt: `あなたは経営戦略の専門コンサルタントです。MECEの原則に従い論点ツリーを構築してください。

## 出力形式（必ずこのJSON形式で返してください）
\`\`\`json
{
  "framework": "mece",
  "theme": "入力テーマ",
  "generated_at": "YYYY-MM-DD",
  "root": "ルート論点",
  "data": {
    "root": "ルート論点",
    "level1": [
      {
        "label": "大論点1",
        "children": ["小論点1-1", "小論点1-2", "小論点1-3"]
      },
      {
        "label": "大論点2",
        "children": ["小論点2-1", "小論点2-2", "小論点2-3"]
      },
      {
        "label": "大論点3",
        "children": ["小論点3-1", "小論点3-2", "小論点3-3"]
      }
    ],
    "mece_check": "MECEになっている理由・分解の軸の説明"
  }
}
\`\`\``,
    userPromptTemplate: (theme: string) => `以下のテーマでMECEな論点ツリーを作成してください。\n\nテーマ：${theme}`,
  },

  fiveForces: {
    systemPrompt: `あなたは経営戦略の専門コンサルタントです。ポーターの5フォース分析を実施してください。

## 出力形式（必ずこのJSON形式で返してください）
\`\`\`json
{
  "framework": "fiveForces",
  "theme": "入力テーマ",
  "generated_at": "YYYY-MM-DD",
  "data": {
    "rivalry": {
      "level": "高/中/低",
      "factors": ["要因1", "要因2", "要因3"]
    },
    "new_entrants": {
      "level": "高/中/低",
      "factors": ["要因1", "要因2", "要因3"]
    },
    "substitutes": {
      "level": "高/中/低",
      "factors": ["要因1", "要因2", "要因3"]
    },
    "buyer_power": {
      "level": "高/中/低",
      "factors": ["要因1", "要因2", "要因3"]
    },
    "supplier_power": {
      "level": "高/中/低",
      "factors": ["要因1", "要因2", "要因3"]
    },
    "overall_attractiveness": "業界全体の収益性・魅力度についての総合評価（2〜3文）"
  }
}
\`\`\``,
    userPromptTemplate: (theme: string) => `以下のテーマで5フォース分析を実施してください。\n\nテーマ：${theme}`,
  },

  okr: {
    systemPrompt: `あなたは経営戦略の専門コンサルタントです。OKR（Objectives and Key Results）を設計してください。

## 出力形式（必ずこのJSON形式で返してください）
\`\`\`json
{
  "framework": "okr",
  "theme": "入力テーマ",
  "generated_at": "YYYY-MM-DD",
  "data": {
    "objectives": [
      {
        "objective": "目標1",
        "key_results": [
          { "kr": "成果指標1", "target": "100", "unit": "%" },
          { "kr": "成果指標2", "target": "50", "unit": "件" }
        ]
      },
      {
        "objective": "目標2",
        "key_results": [
          { "kr": "成果指標1", "target": "200", "unit": "万円" },
          { "kr": "成果指標2", "target": "80", "unit": "%" }
        ]
      }
    ],
    "review_cycle": "四半期レビューの推奨事項"
  }
}
\`\`\``,
    userPromptTemplate: (theme: string) => `以下のテーマでOKRを設計してください。\n\nテーマ：${theme}`,
  },

  ppm: {
    systemPrompt: `あなたは経営戦略の専門コンサルタントです。PPM（プロダクト・ポートフォリオ・マネジメント）マトリクス分析を実施してください。

## 出力形式（必ずこのJSON形式で返してください）
\`\`\`json
{
  "framework": "ppm",
  "theme": "入力テーマ",
  "generated_at": "YYYY-MM-DD",
  "data": {
    "star": [{"name": "事業名", "description": "説明"}],
    "cash_cow": [{"name": "事業名", "description": "説明"}],
    "question_mark": [{"name": "事業名", "description": "説明"}],
    "dog": [{"name": "事業名", "description": "説明"}],
    "recommendation": "ポートフォリオ全体への戦略的提言"
  }
}
\`\`\``,
    userPromptTemplate: (theme: string) => `以下のテーマでPPMマトリクス分析を実施してください。\n\nテーマ：${theme}`,
  },

  valueChain: {
    systemPrompt: `あなたは経営戦略の専門コンサルタントです。バリューチェーン分析を実施してください。

## 出力形式（必ずこのJSON形式で返してください）
\`\`\`json
{
  "framework": "valueChain",
  "theme": "入力テーマ",
  "generated_at": "YYYY-MM-DD",
  "data": {
    "primary": {
      "inbound_logistics": ["活動1", "活動2"],
      "operations": ["活動1", "活動2"],
      "outbound_logistics": ["活動1", "活動2"],
      "marketing_sales": ["活動1", "活動2"],
      "service": ["活動1", "活動2"]
    },
    "support": {
      "infrastructure": ["活動1", "活動2"],
      "hr_management": ["活動1", "活動2"],
      "technology": ["活動1", "活動2"],
      "procurement": ["活動1", "活動2"]
    },
    "competitive_advantage": "競争優位性の源泉についての分析"
  }
}
\`\`\``,
    userPromptTemplate: (theme: string) => `以下のテーマでバリューチェーン分析を実施してください。\n\nテーマ：${theme}`,
  },

  pmi: {
    systemPrompt: `あなたは経営戦略の専門コンサルタントです。PMI（Post Merger Integration）ロードマップを策定してください。

## 出力形式（必ずこのJSON形式で返してください）
\`\`\`json
{
  "framework": "pmi",
  "theme": "入力テーマ",
  "generated_at": "YYYY-MM-DD",
  "data": {
    "phases": [
      {
        "name": "Day 1〜100日",
        "period": "0-100日",
        "tasks": ["タスク1", "タスク2", "タスク3"],
        "milestones": ["マイルストーン1", "マイルストーン2"]
      },
      {
        "name": "統合期",
        "period": "100-365日",
        "tasks": ["タスク1", "タスク2"],
        "milestones": ["マイルストーン1"]
      },
      {
        "name": "安定期",
        "period": "1年〜",
        "tasks": ["タスク1", "タスク2"],
        "milestones": ["マイルストーン1"]
      }
    ],
    "key_risks": ["リスク1", "リスク2", "リスク3"],
    "success_factors": ["成功要因1", "成功要因2"]
  }
}
\`\`\``,
    userPromptTemplate: (theme: string) => `以下のテーマでPMIロードマップを策定してください。\n\nテーマ：${theme}`,
  },
};
