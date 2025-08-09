import type { ColumnRule } from '../types';

/**
 * TableDisplayと同じ変換・除外ロジックでエクスポート用2次元配列を生成する
 */
export const convertTableDataForExport = (
  tableData: string[][],
  customRows: ColumnRule[]
): string[][] => {
  if (!tableData || tableData.length === 0) return [];
  // 変換後のヘッダー
  const exportHeader = tableData[0].reduce<string[]>((acc, header, idx) => {
    const customRow = customRows[idx];
    if (customRow?.hidden === true) return acc;
    if (customRow?.mapTitle) {
      acc.push(customRow.mapTitle(header));
    } else {
      acc.push(header);
    }
    return acc;
  }, []);
  // 変換後のデータ本体
  const exportBody = tableData.slice(1).map((row) =>
    row.reduce<string[]>((acc, cell, idx) => {
      const customRow = customRows[idx];
      if (customRow?.hidden === true) return acc;
      if (customRow?.mapValue) {
        acc.push(customRow.mapValue(cell, [tableData[0], row]));
      } else {
        acc.push(cell);
      }
      return acc;
    }, [])
  );
  return [exportHeader, ...exportBody];
};
