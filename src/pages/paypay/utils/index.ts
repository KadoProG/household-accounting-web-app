import type { CustomRow } from '@/components/features/CSVLoader/types';

export const makePayPayCustomValues = (headerValues: string[]) => {
  return headerValues.map((cellValue) => {
    const customRow: CustomRow = {};

    // PayPayのCSVフォーマットに応じて変換ロジックを実装
    // 現在は楽天と同じロジックを使用（後でPayPay専用に変更可能）
    if (cellValue === '利用日') {
      customRow.titleChange = () => '日付';
      customRow.valueChange = (value) => formatJapaneseDate(value);
    }

    if (cellValue === '利用店名・商品名') {
      customRow.titleChange = () => '名前';
    }

    if (cellValue === '支払総額') {
      customRow.titleChange = () => '金額';
      customRow.valueChange = (value) => {
        const intValue = Number(value);
        if (isNaN(intValue)) {
          return '';
        }
        return String(-intValue);
      };
    }

    if (cellValue === '支払方法') {
      customRow.titleChange = () => '支払い方法';
      customRow.valueChange = () => 'PayPay';
    }

    if (!['利用日', '利用店名・商品名', '支払総額', '支払方法'].includes(cellValue))
      customRow.visible = false;

    return customRow;
  });
};

/** 2025/07/19 → 2025年2月3日 11:48 のようなフォーマットにする関数 */
const formatJapaneseDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('/').map(Number);
  if (!year || !month || !day) return dateStr;
  return `${year}年${month}月${day}日 00:00`;
};
