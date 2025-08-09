import type { TablePlan, CellContext } from '@/features/CSVProcessor/types';
import { formatJapaneseDate } from '@/utils/date';

export const paypayPlan: TablePlan = {
  columns: {
    // 3. 「取引日」→「日付」、日付フォーマット
    取引日: {
      mapHeader: () => '日付',
      mapValue: (value: string) => formatJapaneseDate(value),
    },

    // 8. 「取引先」→「名前」
    取引先: {
      mapHeader: () => '名前',
    },

    // 2. 取引内容で他人から得たものは「その他の収入」
    取引内容: {
      mapValue: (value: string) =>
        value.includes('振込') || value.includes('送金') || value.includes('受取')
          ? 'その他の収入'
          : value,
    },

    // 5. 金額列（出金はマイナス、入金はプラス）
    '出金金額（円）': {
      mapHeader: () => '金額',
      mapValue: (value: string, ctx: CellContext) => {
        if (value === '-') {
          const deposit = ctx.get('入金金額（円）');
          if (!deposit) return '';
          const n = Number(deposit.replaceAll(',', ''));
          return Number.isFinite(n) ? String(n) : '';
        }
        const n = Number(value.replaceAll(',', ''));
        return Number.isFinite(n) ? String(-Math.abs(n)) : '';
      },
    },

    // 6,7. 「取引方法」→「支払い方法」, 値は常に PayPay
    取引方法: {
      mapHeader: () => '支払い方法',
      mapValue: () => 'PayPay',
    },

    // 入金金額（円）列は非表示（出金金額の計算で使用されるが表示不要）
    '入金金額（円）': {
      hide: true,
    },

    // それ以外の列は非表示
    // 未定義の列は自動的に非表示になります
  },

  // 行フィルタ（未対応だった TODO の実装）
  rowFilters: [
    {
      // 1. 「ポイント、残高の獲得」「投資」の行を削除
      hideIf: (ctx: CellContext) => {
        const type = ctx.get('取引内容');
        return !!type && (type.includes('ポイント、残高の獲得') || type.includes('投資'));
      },
    },
  ],

  // 並べ替え（例）
  reorder: {
    // 列順を明示（存在しないものは末尾に温存 or 破棄は実装方針次第）
    columns: ['日付', '名前', '取引内容', '金額', '支払い方法', '取引番号'],

    // 行は日付昇順で並べる例（文字列→日付比較）
    rows: { byHeader: '日付', direction: 'asc', as: 'date' },
  },
};
