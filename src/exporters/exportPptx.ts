import pptxgen from 'pptxgenjs';
import type { FrameworkId, FrameworkResult, SwotData, ThreeCData, MeceData } from '../types';

const BRAND = {
  navy: '1B3A6B',
  accent: '2D7DD2',
  bg: 'F5F7FA',
  text: '333333',
};

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

function addTitleSlide(pptx: pptxgen, theme: string, fwLabel: string, date: string) {
  const slide = pptx.addSlide();
  slide.background = { color: BRAND.navy };
  slide.addText(theme, {
    x: 0.5, y: 1.8, w: '90%', h: 1.5,
    fontSize: 28, bold: true, color: 'FFFFFF', align: 'center',
  });
  slide.addText(fwLabel, {
    x: 0.5, y: 3.5, w: '90%', h: 0.5,
    fontSize: 18, color: 'AABBCC', align: 'center',
  });
  slide.addText(date, {
    x: 0.5, y: 4.2, w: '90%', h: 0.4,
    fontSize: 12, color: '7799BB', align: 'center',
  });
}

function exportSwot(pptx: pptxgen, result: FrameworkResult) {
  const data = result.data as SwotData;
  const slide = pptx.addSlide();
  slide.background = { color: BRAND.bg };
  slide.addText('SWOT分析', {
    x: 0.3, y: 0.15, w: '95%', h: 0.45,
    fontSize: 18, bold: true, color: BRAND.navy,
  });

  const cells = [
    { label: 'Strengths　強み', items: data.strengths, x: 0.3, y: 0.75, color: '1D9E75' },
    { label: 'Weaknesses　弱み', items: data.weaknesses, x: 5.1, y: 0.75, color: 'D85A30' },
    { label: 'Opportunities　機会', items: data.opportunities, x: 0.3, y: 3.05, color: '378ADD' },
    { label: 'Threats　脅威', items: data.threats, x: 5.1, y: 3.05, color: 'E24B4A' },
  ];

  cells.forEach(cell => {
    slide.addShape('rect', {
      x: cell.x, y: cell.y, w: 4.6, h: 2.1,
      fill: { color: 'FFFFFF' },
      line: { color: 'DDDDDD', width: 0.5 },
    });
    slide.addText(cell.label, {
      x: cell.x + 0.1, y: cell.y + 0.08, w: 4.4, h: 0.3,
      fontSize: 10, bold: true, color: cell.color,
    });
    slide.addText(
      cell.items.map(i => `・${i}`).join('\n'),
      { x: cell.x + 0.1, y: cell.y + 0.42, w: 4.4, h: 1.6, fontSize: 9, color: '444444', valign: 'top' }
    );
  });

  if (data.cross_swot) {
    const csSlide = pptx.addSlide();
    csSlide.background = { color: BRAND.bg };
    csSlide.addText('クロスSWOT戦略', {
      x: 0.3, y: 0.15, w: '95%', h: 0.45,
      fontSize: 18, bold: true, color: BRAND.navy,
    });
    const crossCells = [
      { label: 'SO戦略（強み×機会）', text: data.cross_swot.so, x: 0.3, y: 0.75, color: '1D9E75' },
      { label: 'WO戦略（弱み×機会）', text: data.cross_swot.wo, x: 5.1, y: 0.75, color: '378ADD' },
      { label: 'ST戦略（強み×脅威）', text: data.cross_swot.st, x: 0.3, y: 3.05, color: 'D85A30' },
      { label: 'WT戦略（弱み×脅威）', text: data.cross_swot.wt, x: 5.1, y: 3.05, color: 'E24B4A' },
    ];
    crossCells.forEach(cell => {
      csSlide.addShape('rect', {
        x: cell.x, y: cell.y, w: 4.6, h: 2.1,
        fill: { color: 'FFFFFF' },
        line: { color: 'DDDDDD', width: 0.5 },
      });
      csSlide.addText(cell.label, {
        x: cell.x + 0.1, y: cell.y + 0.08, w: 4.4, h: 0.3,
        fontSize: 10, bold: true, color: cell.color,
      });
      csSlide.addText(cell.text, {
        x: cell.x + 0.1, y: cell.y + 0.42, w: 4.4, h: 1.6,
        fontSize: 10, color: '444444', valign: 'top',
      });
    });
  }
}

function exportThreeC(pptx: pptxgen, result: FrameworkResult) {
  const data = result.data as ThreeCData;
  const slide = pptx.addSlide();
  slide.background = { color: BRAND.bg };
  slide.addText('3C分析', {
    x: 0.3, y: 0.15, w: '95%', h: 0.45,
    fontSize: 18, bold: true, color: BRAND.navy,
  });
  const cols = [
    { label: 'Customer　顧客', color: '378ADD', x: 0.2, items: [
      `市場規模: ${data.customer.market_size}`,
      `成長率: ${data.customer.growth_rate}`,
      `セグメント: ${data.customer.key_segment}`,
      ...data.customer.pain_points.map(p => `・${p}`),
    ]},
    { label: 'Competitor　競合', color: 'E24B4A', x: 3.5, items: [
      ...data.competitor.leaders.map(l => `・${l}`),
      '強み:',
      ...data.competitor.their_strengths.map(s => `  ・${s}`),
    ]},
    { label: 'Company　自社', color: '1D9E75', x: 6.8, items: [
      ...data.company.core_strengths.map(s => `・${s}`),
      '差別化:',
      ...data.company.differentiators.map(d => `  ・${d}`),
    ]},
  ];
  cols.forEach(col => {
    slide.addText(col.label, {
      x: col.x, y: 0.75, w: 3.0, h: 0.35,
      fontSize: 11, bold: true, color: col.color,
    });
    slide.addShape('rect', {
      x: col.x, y: 1.15, w: 3.0, h: 3.8,
      fill: { color: 'FFFFFF' },
      line: { color: 'DDDDDD', width: 0.5 },
    });
    slide.addText(col.items.join('\n'), {
      x: col.x + 0.1, y: 1.25, w: 2.8, h: 3.6,
      fontSize: 9, color: '444444', valign: 'top',
    });
  });
}

function exportMece(pptx: pptxgen, result: FrameworkResult) {
  const data = result.data as MeceData;
  const slide = pptx.addSlide();
  slide.background = { color: BRAND.bg };
  slide.addText('MECEツリー', {
    x: 0.3, y: 0.15, w: '95%', h: 0.45,
    fontSize: 18, bold: true, color: BRAND.navy,
  });
  slide.addText(data.root, {
    x: 3.5, y: 0.8, w: 3.0, h: 0.5,
    fontSize: 12, bold: true, color: 'FFFFFF',
    fill: { color: BRAND.navy },
    align: 'center',
  });
  const totalCols = data.level1.length;
  const colW = 9.5 / totalCols;
  data.level1.forEach((node, i) => {
    const x = 0.3 + i * colW;
    slide.addText(node.label, {
      x, y: 1.6, w: colW - 0.1, h: 0.4,
      fontSize: 10, bold: true, color: 'FFFFFF',
      fill: { color: BRAND.accent },
      align: 'center',
    });
    node.children.forEach((child, j) => {
      slide.addText(child, {
        x, y: 2.2 + j * 0.6, w: colW - 0.1, h: 0.5,
        fontSize: 9, color: BRAND.text,
        fill: { color: 'FFFFFF' },
        line: { color: 'CCDDEE', width: 0.5 },
        align: 'center',
      });
    });
  });
}

export async function exportToPptx(fw: FrameworkId, result: FrameworkResult, theme: string) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';

  addTitleSlide(pptx, theme, FW_LABELS[fw], result.generated_at);

  switch (fw) {
    case 'swot': exportSwot(pptx, result); break;
    case 'threeC': exportThreeC(pptx, result); break;
    case 'mece': exportMece(pptx, result); break;
    default: {
      const slide = pptx.addSlide();
      slide.background = { color: BRAND.bg };
      slide.addText(FW_LABELS[fw], {
        x: 0.3, y: 0.15, w: '95%', h: 0.45,
        fontSize: 18, bold: true, color: BRAND.navy,
      });
      slide.addText(JSON.stringify(result.data, null, 2), {
        x: 0.3, y: 0.75, w: 9.5, h: 4.5,
        fontSize: 9, color: BRAND.text, fontFace: 'Courier New',
      });
    }
  }

  await pptx.writeFile({ fileName: `${FW_LABELS[fw]}_${theme}_${result.generated_at}.pptx` });
}
