import React from 'react';
import type { TablePlan, CellContext } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface CSVDataTableProps {
  data: string[][];
  tablePlan: TablePlan;
  hiddenDisable: boolean;
}

export const CSVDataTable: React.FC<CSVDataTableProps> = ({ data, tablePlan, hiddenDisable }) => {
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
    if (!tablePlan.rowFilters || !hiddenDisable) return true;

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
  const sortedRows = [...visibleRows];
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

  return (
    <div className="mt-4 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columnOrder.map((header) => {
              const columnTransform = tablePlan.columns[header];
              // 未定義の列は隠す
              const shouldHide = !columnTransform || columnTransform?.hide === true;
              if (shouldHide && hiddenDisable) return null;

              return (
                <TableHead key={header} className={cn(shouldHide && 'opacity-10')}>
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
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row, rowIndex) => {
            // この行が本来非表示になるかチェック
            const shouldHideRow = tablePlan.rowFilters?.some((filter) => {
              const ctx = createCellContext(rowIndex, row);
              return filter.hideIf(ctx);
            });

            return (
              <TableRow
                key={rowIndex}
                className={cn(shouldHideRow && !hiddenDisable && 'bg-gray-100 dark:bg-gray-800')}
              >
                {columnOrder.map((header) => {
                  const columnTransform = tablePlan.columns[header];
                  // 未定義の列は隠す
                  const shouldHide = !columnTransform || columnTransform?.hide === true;
                  if (shouldHide && hiddenDisable) return null;

                  const cellIndex = headers.findIndex((h) => h === header);
                  const cell = cellIndex >= 0 ? row[cellIndex] : '';

                  const ctx = createCellContext(rowIndex, row);
                  ctx.header = header;

                  return (
                    <TableCell key={header} className={cn(shouldHide && 'opacity-10')}>
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
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
