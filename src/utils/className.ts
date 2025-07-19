import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 複数のクラス名を結合し、Tailwind CSSの競合も解決するユーティリティ関数。
 * @param inputs クラス名（文字列、配列、オブジェクトなど）
 * @returns 結合・最適化されたクラス名文字列
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
