import type { TablePlan } from '@/features/CSVProcessor';
// import { formatJapaneseDate } from '@/utils/date';

export const rakutenBankPlan: TablePlan = {
  columns: {},

  // columns: {
  //   // 1. 「取引日」→「日付」と名称変更
  //   // 2. 「日付」→フォーマットを 2025年2月3日 11:48 のようにする
  //   取引日: {
  //     mapHeader: () => '日付',
  //     mapValue: (value: string) => formatJapaneseDate(value),
  //   },

  //   // 3. 「お取扱内容」→「名前」にする
  //   お取扱内容: {
  //     mapHeader: () => '名前',
  //   },

  //   // 4. 「お支払金額」または「出金額」→「金額」にする
  //   // 5. 「金額」→出金の場合はマイナスにする
  //   お支払金額: {
  //     mapHeader: () => '金額',
  //     mapValue: (value: string) => {
  //       const intValue = Number(value);
  //       if (isNaN(intValue)) {
  //         return '';
  //       }
  //       return String(-intValue);
  //     },
  //   },

  //   // 出金額がある場合の処理
  //   出金額: {
  //     mapHeader: () => '金額',
  //     mapValue: (value: string) => {
  //       const intValue = Number(value);
  //       if (isNaN(intValue)) {
  //         return '';
  //       }
  //       return String(-intValue);
  //     },
  //   },

  //   // 入金額がある場合の処理
  //   入金額: {
  //     mapHeader: () => '金額',
  //     mapValue: (value: string) => {
  //       const intValue = Number(value);
  //       if (isNaN(intValue)) {
  //         return '';
  //       }
  //       return String(intValue);
  //     },
  //   },

  //   // 6. 「支払い方法」の値を「楽天銀行」とする
  //   // この列が存在しない場合は新しく追加される
  //   '': {
  //     mapHeader: () => '支払い方法',
  //     mapValue: () => '楽天銀行',
  //   },

  //   // 7. それ以外の項目を削除。残るのは、「日付（取引日）」「名前（お取扱内容）」「金額（お支払金額/出金額/入金額）」「支払い方法」
  //   // 定義されていない列は表示されません（CSVDataTableとtable.tsで対応済み）
  // },

  // // 並べ替え（列順を指定）
  // reorder: {
  //   columns: ['日付', '名前', '金額', '支払い方法'],
  //   // 行は日付昇順で並べる
  //   rows: { byHeader: '日付', direction: 'asc', as: 'date' },
  // },
};
