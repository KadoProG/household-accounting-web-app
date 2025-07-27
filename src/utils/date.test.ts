import { describe, it, expect } from 'vitest';
import { formatJapaneseDate } from './date';

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
