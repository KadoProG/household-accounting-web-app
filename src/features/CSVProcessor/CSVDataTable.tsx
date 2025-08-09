import { cn } from '@/utils/className';
import React from 'react';
import type { TablePlan, CellContext } from './types';

interface CSVDataTableProps {
  data: string[][];
  customRows: TablePlan;
  hiddenDisable: boolean;
}

export const CSVDataTable: React.FC<CSVDataTableProps> = ({ data, customRows, hiddenDisable }) => {
  if (!data || data.length === 0) return null;

  const headers = data[0];

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

  // 行フィルタを適用して表示する行を決定
  const visibleRows = data.slice(1).filter((row, rowIndex) => {
    if (!customRows.rowFilters || !hiddenDisable) return true;

    const ctx = createCellContext(rowIndex, row);
    return !customRows.rowFilters.some((filter) => filter.hideIf(ctx));
  });

  // 列の並び替えを適用
  let columnOrder = headers;
  if (customRows.reorder?.columns) {
    const specifiedColumns = customRows.reorder.columns.filter((col) => headers.includes(col));
    const remainingColumns = headers.filter((h) => !customRows.reorder!.columns!.includes(h));
    columnOrder = [...specifiedColumns, ...remainingColumns];
  }

  // 行の並び替えを適用
  const sortedRows = [...visibleRows];
  if (customRows.reorder?.rows) {
    const sortConfig = customRows.reorder.rows;
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

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border border-border dark:border-border-dark">
        <thead>
          <tr>
            {columnOrder.map((header) => {
              const columnTransform = customRows.columns[header];
              // 未定義の列は隠す
              const shouldHide = !columnTransform || columnTransform?.hide === true;
              if (shouldHide && hiddenDisable) return null;

              return (
                <th
                  key={header}
                  className={cn(
                    'border border-border bg-bg-active px-2 py-1 dark:border-border-dark dark:bg-bg-active-dark',
                    shouldHide && 'opacity-10'
                  )}
                >
                  {columnTransform?.mapHeader ? (
                    <>
                      {!hiddenDisable && (
                        <>
                          <s className="text-xs opacity-20">{header}</s>
                          <br />
                        </>
                      )}
                      {columnTransform.mapHeader(header)}
                    </>
                  ) : (
                    header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => {
            // この行が本来非表示になるかチェック
            const shouldHideRow = customRows.rowFilters?.some((filter) => {
              const ctx = createCellContext(rowIndex, row);
              return filter.hideIf(ctx);
            });

            return (
              <tr
                key={rowIndex}
                className={cn(shouldHideRow && !hiddenDisable && 'bg-gray-100 dark:bg-gray-800')}
              >
                {columnOrder.map((header) => {
                  const columnTransform = customRows.columns[header];
                  // 未定義の列は隠す
                  const shouldHide = !columnTransform || columnTransform?.hide === true;
                  if (shouldHide && hiddenDisable) return null;

                  const cellIndex = headers.findIndex((h) => h === header);
                  const cell = cellIndex >= 0 ? row[cellIndex] : '';

                  const ctx = createCellContext(rowIndex, row);
                  ctx.header = header;

                  return (
                    <td
                      key={header}
                      className={cn(
                        'border border-border px-2 py-1 dark:border-border-dark',
                        shouldHide && 'opacity-10'
                      )}
                    >
                      {columnTransform?.mapValue ? (
                        <>
                          {!hiddenDisable && (
                            <>
                              <s className="text-xs opacity-20">{cell}</s>
                              <br />
                            </>
                          )}
                          {columnTransform.mapValue(cell, ctx)}
                        </>
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
