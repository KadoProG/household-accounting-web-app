import type { ColumnRule } from '@/features/CSVProcessor';
import { formatJapaneseDate } from '@/utils/date';

export const makeRakutenCustomValues = (headerValues: string[]) => {
  return headerValues.map((cellValue) => {
    const customRow: ColumnRule = {};
    if (cellValue === '利用日') {
      // 1. 「利用日」→「日付」と名称変更
      customRow.mapTitle = () => '日付';
      // 2. 「日付」→フォーマットを 2025年2月3日 11:48 のようにする
      customRow.valueChange = (value) => formatJapaneseDate(value);
    }

    // 3. 「利用店名・商品名」→「名前」にする
    if (cellValue === '利用店名・商品名') {
      customRow.mapTitle = () => '名前';
    }

    if (cellValue === '支払総額') {
      // 4. 「支払総額」→「金額」にする
      customRow.mapTitle = () => '金額';
      // 5. 「金額」→全てマイナスにする
      customRow.valueChange = (value) => {
        const intValue = Number(value);
        if (isNaN(intValue)) {
          return '';
        }
        return String(-intValue);
      };
    }
    // 6. 「支払方法」→「支払い方法」とし、値を「楽天クレカ」とする
    if (cellValue === '支払方法') {
      customRow.mapTitle = () => '支払い方法';
      customRow.valueChange = () => '楽天クレカ';
    }

    // 7. それ以外の項目を削除。残るのは、「日付（利用日）」「名前（利用店名・商品名）」「金額（支払総額）」「支払い方法（支払方法）」
    // if (isMonthCarryOverBalance(cellValue)) customRow.visible = false;
    if (!['利用日', '利用店名・商品名', '支払総額', '支払方法'].includes(cellValue))
      customRow.visible = false;
    return customRow;
  });
};
