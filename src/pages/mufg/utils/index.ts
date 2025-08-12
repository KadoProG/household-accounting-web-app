import type { TablePlan } from '@/features/CSVProcessor/types';

export const mufgPlan: TablePlan = {
  columns: {
    // それ以外の列は非表示
    // 未定義の列は自動的に非表示になります
  },

  // // 行フィルタ
  // rowFilters: [
  //   {
  //     // 1. 「ポイント、残高の獲得」「投資」の行を削除
  //     hideIf: (ctx: CellContext) => {
  //       const type = ctx.get('取引内容');
  //       return !!type && (type.includes('ポイント、残高の獲得') || type.includes('投資'));
  //     },
  //   },
  // ],

  // // 並べ替え（例）
  // reorder: {
  //   // 列順を明示（存在しないものは末尾に温存 or 破棄は実装方針次第）
  //   columns: ['日付', '名前', '取引内容', '金額', '支払い方法', '取引番号'],

  //   // 行は日付昇順で並べる例（文字列→日付比較）
  //   rows: { byHeader: '日付', direction: 'asc', as: 'date' },
  // },
};
