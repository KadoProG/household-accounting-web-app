import { describe, it, expect } from 'vitest';
import { formatJapaneseDate, formatNumericDateToJapanese } from './date';

describe('formatJapaneseDate', () => {
  it('正常な日付文字列を日本語形式に変換する', () => {
    expect(formatJapaneseDate('2025/07/19')).toBe('2025年7月19日 00:00');
    expect(formatJapaneseDate('2024/12/31')).toBe('2024年12月31日 00:00');
    expect(formatJapaneseDate('2023/01/01')).toBe('2023年1月1日 00:00');
  });

  it('時刻情報を含む日付文字列を日本語形式に変換する', () => {
    expect(formatJapaneseDate('2025/07/27 14:54:20')).toBe('2025年7月27日 14:54:20');
    expect(formatJapaneseDate('2024/12/31 23:59:59')).toBe('2024年12月31日 23:59:59');
    expect(formatJapaneseDate('2023/01/01 00:00:00')).toBe('2023年1月1日 00:00:00');
    expect(formatJapaneseDate('2025/02/03 11:48:30')).toBe('2025年2月3日 11:48:30');
  });

  it('不正な日付文字列の場合は元の文字列を返す', () => {
    expect(formatJapaneseDate('invalid')).toBe('invalid');
    expect(formatJapaneseDate('2025/')).toBe('2025/');
    expect(formatJapaneseDate('2025/07')).toBe('2025/07');
  });

  it('空文字列の場合は空文字列を返す', () => {
    expect(formatJapaneseDate('')).toBe('');
  });

  it('数値に変換できない部分がある場合は元の文字列を返す', () => {
    expect(formatJapaneseDate('2025/abc/19')).toBe('2025/abc/19');
    expect(formatJapaneseDate('abc/07/19')).toBe('abc/07/19');
    expect(formatJapaneseDate('2025/07/abc')).toBe('2025/07/abc');
    expect(formatJapaneseDate('2025/07/19 abc:def:ghi')).toBe('2025/07/19 abc:def:ghi');
  });

  it('0を含む日付も正しく処理する', () => {
    expect(formatJapaneseDate('2025/01/01')).toBe('2025年1月1日 00:00');
    expect(formatJapaneseDate('2025/12/01')).toBe('2025年12月1日 00:00');
    expect(formatJapaneseDate('2025/01/01 09:05:00')).toBe('2025年1月1日 09:05:00');
  });
});

describe('formatNumericDateToJapanese', () => {
  it('8桁の数字形式の日付文字列を日本語形式に変換する', () => {
    expect(formatNumericDateToJapanese('20250505')).toBe('2025年5月5日 00:00');
    expect(formatNumericDateToJapanese('20250719')).toBe('2025年7月19日 00:00');
    expect(formatNumericDateToJapanese('20241225')).toBe('2024年12月25日 00:00');
    expect(formatNumericDateToJapanese('20230101')).toBe('2023年1月1日 00:00');
  });

  it('0が含まれる日付も正しく処理する', () => {
    expect(formatNumericDateToJapanese('20250101')).toBe('2025年1月1日 00:00');
    expect(formatNumericDateToJapanese('20251201')).toBe('2025年12月1日 00:00');
    expect(formatNumericDateToJapanese('20250801')).toBe('2025年8月1日 00:00');
  });

  it('月や日が一桁の場合も正しく処理する', () => {
    expect(formatNumericDateToJapanese('20250305')).toBe('2025年3月5日 00:00');
    expect(formatNumericDateToJapanese('20251003')).toBe('2025年10月3日 00:00');
  });

  it('不正な形式の場合は元の文字列を返す', () => {
    // 8桁でない場合
    expect(formatNumericDateToJapanese('2025050')).toBe('2025050');
    expect(formatNumericDateToJapanese('202505055')).toBe('202505055');
    expect(formatNumericDateToJapanese('20250')).toBe('20250');

    // 数字以外が含まれる場合
    expect(formatNumericDateToJapanese('2025050a')).toBe('2025050a');
    expect(formatNumericDateToJapanese('abcd1234')).toBe('abcd1234');
    expect(formatNumericDateToJapanese('2025/05/05')).toBe('2025/05/05');
  });

  it('無効な日付の場合は元の文字列を返す', () => {
    // 無効な月
    expect(formatNumericDateToJapanese('20250005')).toBe('20250005');
    expect(formatNumericDateToJapanese('20251305')).toBe('20251305');

    // 無効な日
    expect(formatNumericDateToJapanese('20250100')).toBe('20250100');
    expect(formatNumericDateToJapanese('20250132')).toBe('20250132');

    // 年が小さすぎる場合
    expect(formatNumericDateToJapanese('09990505')).toBe('09990505');
  });

  it('空文字列や特殊なケースを処理する', () => {
    expect(formatNumericDateToJapanese('')).toBe('');
    expect(formatNumericDateToJapanese('00000000')).toBe('00000000');
    expect(formatNumericDateToJapanese('12345678')).toBe('12345678'); // 年が有効でない
  });
});
