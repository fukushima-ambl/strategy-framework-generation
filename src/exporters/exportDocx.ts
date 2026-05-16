import {
  Document, Packer, Paragraph, Table, TableCell, TableRow,
  TextRun, HeadingLevel, WidthType, AlignmentType, Footer,
} from 'docx';
import type { FrameworkId, FrameworkResult, SwotData, ThreeCData, MeceData } from '../types';

const FW_LABELS: Record<FrameworkId, string> = {
  swot: 'SWOT分析', threeC: '3C分析', mece: 'MECEツリー',
  fiveForces: '5フォース分析', ppm: 'PPMマトリクス',
  valueChain: 'バリューチェーン分析', okr: 'OKR設計', pmi: 'PMIロードマップ',
};

function makeHeader(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel]) {
  return new Paragraph({ text, heading: level });
}

function makePara(text: string) {
  return new Paragraph({ children: [new TextRun(text)] });
}

function buildSwotTable(data: SwotData): Table {
  const cell = (items: string[]) => new TableCell({
    children: items.map(t => new Paragraph({ children: [new TextRun(`・${t}`)] })),
    width: { size: 50, type: WidthType.PERCENTAGE },
  });
  const headerCell = (text: string) => new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
    width: { size: 50, type: WidthType.PERCENTAGE },
  });
  return new Table({
    rows: [
      new TableRow({ children: [headerCell('Strengths（強み）'), headerCell('Weaknesses（弱み）')] }),
      new TableRow({ children: [cell(data.strengths), cell(data.weaknesses)] }),
      new TableRow({ children: [headerCell('Opportunities（機会）'), headerCell('Threats（脅威）')] }),
      new TableRow({ children: [cell(data.opportunities), cell(data.threats)] }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function buildThreeCSection(data: ThreeCData): (Paragraph | Table)[] {
  return [
    makeHeader('Customer（顧客）', HeadingLevel.HEADING_2),
    makePara(`市場規模: ${data.customer.market_size}`),
    makePara(`成長率: ${data.customer.growth_rate}`),
    makePara(`主要セグメント: ${data.customer.key_segment}`),
    ...data.customer.pain_points.map(p => makePara(`・${p}`)),
    makeHeader('Competitor（競合）', HeadingLevel.HEADING_2),
    ...data.competitor.leaders.map(l => makePara(`・${l}`)),
    makeHeader('Company（自社）', HeadingLevel.HEADING_2),
    ...data.company.core_strengths.map(s => makePara(`・${s}`)),
    makeHeader('KSF（重要成功要因）', HeadingLevel.HEADING_2),
    ...data.ksf.map(k => makePara(`・${k}`)),
  ];
}

function buildMeceSection(data: MeceData): Paragraph[] {
  const items: Paragraph[] = [
    makePara(`ルート論点: ${data.root}`),
    new Paragraph({ text: '' }),
  ];
  data.level1.forEach(node => {
    items.push(new Paragraph({ children: [new TextRun({ text: node.label, bold: true })] }));
    node.children.forEach(child => items.push(makePara(`　・${child}`)));
    items.push(new Paragraph({ text: '' }));
  });
  if (data.mece_check) {
    items.push(makeHeader('MECEチェック', HeadingLevel.HEADING_2));
    items.push(makePara(data.mece_check));
  }
  return items;
}

export async function exportToDocx(fw: FrameworkId, result: FrameworkResult, theme: string) {
  const fwLabel = FW_LABELS[fw];
  const children: (Paragraph | Table)[] = [
    makeHeader(theme, HeadingLevel.HEADING_1),
    makePara(`${fwLabel}　生成日: ${result.generated_at}`),
    new Paragraph({ text: '' }),
    makeHeader(fwLabel, HeadingLevel.HEADING_2),
    new Paragraph({ text: '' }),
  ];

  switch (fw) {
    case 'swot': {
      const data = result.data as SwotData;
      children.push(buildSwotTable(data));
      children.push(new Paragraph({ text: '' }));
      children.push(makeHeader('クロスSWOT戦略', HeadingLevel.HEADING_2));
      Object.entries(data.cross_swot).forEach(([key, val]) => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${key.toUpperCase()}戦略: `, bold: true }),
            new TextRun(val),
          ],
        }));
      });
      if (data.key_insight) {
        children.push(new Paragraph({ text: '' }));
        children.push(makeHeader('最重要インサイト', HeadingLevel.HEADING_2));
        children.push(makePara(data.key_insight));
      }
      break;
    }
    case 'threeC':
      children.push(...buildThreeCSection(result.data as ThreeCData));
      break;
    case 'mece':
      children.push(...buildMeceSection(result.data as MeceData));
      break;
    default:
      children.push(makePara(JSON.stringify(result.data, null, 2)));
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children,
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun(`生成日: ${result.generated_at}`)],
            }),
          ],
        }),
      },
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fwLabel}_${theme}_${result.generated_at}.docx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
