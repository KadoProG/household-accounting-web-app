import type { TablePlan } from '@/features/CSVProcessor';
import { formatNumericDateToJapanese } from '@/utils/date';

export const rakutenBankPlan: TablePlan = {
  columns: {
    取引日: {
      mapHeader: () => '日付',
      mapValue: (value: string) => formatNumericDateToJapanese(value),
    },
    '入出金(円)': {
      mapHeader: () => '金額',
    },
    お取扱内容: {
      mapHeader: () => '名前',
    },
    '取引後残高(円)': {
      mapHeader: () => '支払い方法',
      mapValue: () => '楽天銀行',
    },
    入出金内容: {
      mapHeader: () => '内容',
    },
  },
};
