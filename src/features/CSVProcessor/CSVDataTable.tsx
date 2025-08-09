import { cn } from '@/utils/className';
import React from 'react';
import type { ColumnRule } from './types';

interface CSVDataTableProps {
  data: string[][];
  customRows: ColumnRule[];
  hiddenDisable: boolean;
}

export const CSVDataTable: React.FC<CSVDataTableProps> = ({ data, customRows, hiddenDisable }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border border-border dark:border-border-dark">
        <thead>
          <tr>
            {data[0].map((header, idx) => {
              const customRow = customRows[idx];
              if (customRow?.visible === false && hiddenDisable) return null;
              return (
                <th
                  key={idx}
                  className={cn(
                    'border border-border bg-bg-active px-2 py-1 dark:border-border-dark dark:bg-bg-active-dark',
                    customRow?.visible === false && 'opacity-10'
                  )}
                >
                  {customRow?.titleChange ? (
                    <>
                      {!hiddenDisable && (
                        <>
                          <s className="text-xs opacity-20">{header}</s>
                          <br />
                        </>
                      )}
                      {customRow.titleChange(header)}
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
          {data.slice(1).map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => {
                const customRow = customRows[cellIdx];
                if (customRow?.visible === false && hiddenDisable) return null;
                return (
                  <td
                    key={cellIdx}
                    className={cn(
                      'border border-border px-2 py-1 dark:border-border-dark',
                      customRow?.visible === false && 'opacity-10'
                    )}
                  >
                    {customRow?.valueChange ? (
                      <>
                        {!hiddenDisable && (
                          <>
                            <s className="text-xs opacity-20">{cell}</s>
                            <br />
                          </>
                        )}
                        {customRow.valueChange(cell, [data[0], row])}
                      </>
                    ) : (
                      cell
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
