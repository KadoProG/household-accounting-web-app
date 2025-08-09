import type { ColumnRule } from '@/features/CSVProcessor';
import { formatJapaneseDate } from '@/utils/date';

/**
 * PayPayに対応する変換内容作成関数
 *
 * 1. 「取引内容」が「ポイント、残高の獲得」「投資」の行を削除（←未対応）
 * 2. 「取引内容」で他人から得たものは全て「その他の収入」とする
 * 3. 「取引日」→「日付」とする
 * 4. 「日付」を `2025年2月3日 11:48` フォーマットにする
 * 5. 「金額」列を用意し、出金はマイナス、入金はプラスで入力
 * 6. 「取引方法」→「支払い方法」とする
 * 7. 「支払い方法」を`PayPay`とする
 * 8. 「取引先」→「名前」とする
 *
 * TODO 未対応箇所1つあり
 */
export const makePayPayCustomValues = (headerValues: string[]): ColumnRule[] => {
  return headerValues.map((cellValue) => {
    const customRow: ColumnRule = {};

    // 3. 「取引日」→「日付」とする
    if (cellValue === '取引日') {
      customRow.mapTitle = () => '日付';
      customRow.mapValue = (value) => formatJapaneseDate(value);
    }

    // 8. 「取引先」→「名前」とする
    if (cellValue === '取引先') {
      customRow.mapTitle = () => '名前';
    }

    // 2. 「取引内容」で他人から得たものは全て「その他の収入」とする
    if (cellValue === '取引内容') {
      customRow.mapValue = (value) => {
        // 他人から得たものの判定（例：振込、送金など）
        if (value.includes('振込') || value.includes('送金') || value.includes('受取')) {
          return 'その他の収入';
        }
        return value;
      };
    }

    // 5. 「金額」列を用意し、出金はマイナス、入金はプラスで入力
    if (cellValue === '出金金額（円）') {
      customRow.mapTitle = () => '金額';
      customRow.mapValue = (value, titleValues) => {
        if (value === '-') {
          // 出金金額が `-` となっている場合は入金金額のセルを参照
          const depositAmountIndex = titleValues[0].findIndex(
            (title) => title === '入金金額（円）'
          );
          if (depositAmountIndex === -1) return '';
          const depositAmount = titleValues[1][depositAmountIndex];
          const intDepositAmount = Number(depositAmount.replaceAll(',', ''));
          if (isNaN(intDepositAmount)) {
            return '';
          }
          return String(intDepositAmount);
        }
        const intValue = Number(value.replaceAll(',', ''));
        if (isNaN(intValue)) {
          return '';
        }
        // 出金の場合はマイナス、入金の場合はプラス
        // PayPayの場合、通常は出金なのでマイナスにする
        return String(-Math.abs(intValue));
      };
    }

    // 6. 「取引方法」→「支払い方法」とする
    if (cellValue === '取引方法') {
      customRow.mapTitle = () => '支払い方法';
      // 7. 「支払い方法」を`PayPay`とする
      customRow.mapValue = () => 'PayPay';
    }

    // 必要な列以外は非表示にする
    if (
      !['取引日', '取引先', '取引内容', '出金金額（円）', '取引方法', '取引番号'].includes(
        cellValue
      )
    ) {
      customRow.visible = false;
    }

    return customRow;
  });
};
