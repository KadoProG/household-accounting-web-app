import type { TablePlan, CellContext } from '../types';

/**
 * TableDisplayと同じ変換・除外ロジックでエクスポート用2次元配列を生成する
 */
export const convertTableDataForExport = (
  tableData: string[][],
  tablePlan: TablePlan
): string[][] => {
  if (!tableData || tableData.length === 0) return [];

  const headers = tableData[0];

  // ヘルパー関数：CellContextを作成
  const createCellContext = (rowIndex: number, row: string[]): CellContext => ({
    header: '', // 後で設定
    headers,
    row,
    rowIndex,
    get: (headerName: string) => {
      const headerIndex = headers.findIndex((h) => h === headerName);
      return headerIndex >= 0 ? row[headerIndex] : undefined;
    },
  });

  // 行フィルタを適用して表示する行を決定（エクスポート時は常に適用）
  const visibleRows = tableData.slice(1).filter((row, rowIndex) => {
    if (!tablePlan.rowFilters) return true;

    const ctx = createCellContext(rowIndex, row);
    return !tablePlan.rowFilters.some((filter) => filter.hideIf(ctx));
  });

  // 列の並び替えを適用
  let columnOrder = headers;
  if (tablePlan.reorder?.columns) {
    const specifiedColumns = tablePlan.reorder.columns.filter((col) => headers.includes(col));
    const remainingColumns = headers.filter((h) => !tablePlan.reorder!.columns!.includes(h));
    columnOrder = [...specifiedColumns, ...remainingColumns];
  }

  // 行の並び替えを適用
  let sortedRows = [...visibleRows];
  if (tablePlan.reorder?.rows) {
    const sortConfig = tablePlan.reorder.rows;
    if (typeof sortConfig === 'function') {
      sortedRows.sort((a, b) => {
        const ctxA = createCellContext(0, a);
        const ctxB = createCellContext(0, b);
        return sortConfig(ctxA, ctxB);
      });
    } else {
      const { byHeader, direction = 'asc', as = 'string' } = sortConfig;
      const headerIndex = headers.findIndex((h) => h === byHeader);
      if (headerIndex >= 0) {
        sortedRows.sort((a, b) => {
          const aVal = a[headerIndex];
          const bVal = b[headerIndex];

          let comparison = 0;
          if (as === 'number') {
            comparison = Number(aVal) - Number(bVal);
          } else if (as === 'date') {
            comparison = new Date(aVal).getTime() - new Date(bVal).getTime();
          } else {
            comparison = aVal.localeCompare(bVal);
          }

          return direction === 'desc' ? -comparison : comparison;
        });
      }
    }
  }

  // 変換後のヘッダー（非表示列を除外し、列順を適用）
  const exportHeader = columnOrder.reduce<string[]>((acc, header) => {
    const columnTransform = tablePlan.columns[header];
    // 未定義の列は隠す
    if (!columnTransform || columnTransform?.hide === true) return acc;
    if (columnTransform?.mapHeader) {
      acc.push(columnTransform.mapHeader(header));
    } else {
      acc.push(header);
    }
    return acc;
  }, []);

  // 変換後のデータ本体
  const exportBody = sortedRows.map((row, rowIndex) =>
    columnOrder.reduce<string[]>((acc, header) => {
      const columnTransform = tablePlan.columns[header];
      // 未定義の列は隠す
      if (!columnTransform || columnTransform?.hide === true) return acc;

      const cellIndex = headers.findIndex((h) => h === header);
      const cell = cellIndex >= 0 ? row[cellIndex] : '';

      const ctx = createCellContext(rowIndex, row);
      ctx.header = header;

      if (columnTransform?.mapValue) {
        acc.push(columnTransform.mapValue(cell, ctx));
      } else {
        acc.push(cell);
      }
      return acc;
    }, [])
  );

  return [exportHeader, ...exportBody];
};
