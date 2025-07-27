/**
 * 日付文字列を日本語形式に変換する関数
 *
 * 例:
 * - 2025/07/19 → 2025年7月19日 00:00
 * - 2025/07/27 14:54:20 → 2025年7月27日 14:54:20
 */
export const formatJapaneseDate = (dateStr: string): string => {
  // 時刻情報があるかチェック
  const hasTime = dateStr.includes(' ');

  if (hasTime) {
    // 時刻情報がある場合: "2025/07/27 14:54:20" のような形式
    const [datePart, timePart] = dateStr.split(' ');
    const [year, month, day] = datePart.split('/').map(Number);
    if (!year || !month || !day) return dateStr;

    // 時刻部分が正しい形式かチェック（HH:MM:SS）
    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (!timeRegex.test(timePart)) return dateStr;

    return `${year}年${month}月${day}日 ${timePart}`;
  } else {
    // 時刻情報がない場合: "2025/07/19" のような形式
    const [year, month, day] = dateStr.split('/').map(Number);
    if (!year || !month || !day) return dateStr;
    return `${year}年${month}月${day}日 00:00`;
  }
};
