import type { TablePlan } from '@/features/CSVProcessor';
import { formatJapaneseDate } from '@/utils/date';

export const rakutenPlan: TablePlan = {
  columns: {
    // 1. 「利用日」→「日付」と名称変更
    // 2. 「日付」→フォーマットを 2025年2月3日 11:48 のようにする
    利用日: {
      mapHeader: () => '日付',
      mapValue: (value: string) => formatJapaneseDate(value),
    },

    // 3. 「利用店名・商品名」→「名前」にする
    '利用店名・商品名': {
      mapHeader: () => '名前',
    },

    // 4. 「支払総額」→「金額」にする
    // 5. 「金額」→全てマイナスにする
    支払総額: {
      mapHeader: () => '金額',
      mapValue: (value: string) => {
        const intValue = Number(value);
        if (isNaN(intValue)) {
          return '';
        }
        return String(-intValue);
      },
    },

    // 6. 「支払方法」→「支払い方法」とし、値を「楽天クレカ」とする
    支払方法: {
      mapHeader: () => '支払い方法',
      mapValue: () => '楽天クレカ',
    },

    // 7. それ以外の項目を削除。残るのは、「日付（利用日）」「名前（利用店名・商品名）」「金額（支払総額）」「支払い方法（支払方法）」
    // 定義されていない列は表示されません（CSVDataTableとtable.tsで対応済み）
  },

  // 並べ替え（列順を指定）
  reorder: {
    columns: ['日付', '名前', '金額', '支払い方法'],
    // 行は日付昇順で並べる
    rows: { byHeader: '日付', direction: 'asc', as: 'date' },
  },
};
