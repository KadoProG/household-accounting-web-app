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

/**
 * 8桁の数字形式の日付文字列を日本語形式に変換する関数
 *
 * 例:
 * - 20250505 → 2025年5月5日 00:00
 * - 20250719 → 2025年7月19日 00:00
 */
export const formatNumericDateToJapanese = (dateStr: string): string => {
  // 8桁の数字かチェック
  if (!/^\d{8}$/.test(dateStr)) {
    return dateStr; // 形式が正しくない場合はそのまま返す
  }

  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10);
  const day = parseInt(dateStr.substring(6, 8), 10);

  // 日付の妥当性をチェック
  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) {
    return dateStr; // 無効な日付の場合はそのまま返す
  }

  return `${year}年${month}月${day}日 00:00`;
};
