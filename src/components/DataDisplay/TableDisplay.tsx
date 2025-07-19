import type { CustomRow } from '@/pages/rakuten/types';
import { cn } from '@/utils/className';
import React from 'react';

interface TableDisplayProps {
  data: string[][];
  customRows: CustomRow[];
}

export const TableDisplay: React.FC<TableDisplayProps> = ({ data, customRows }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            {data[0].map((header, idx) => {
              const customRow = customRows[idx];
              return (
                <th
                  key={idx}
                  className={cn(
                    'border bg-gray-100 px-2 py-1',
                    customRow?.visible === false && 'opacity-10'
                  )}
                >
                  {customRow?.titleChange ? (
                    <>
                      <s className="text-xs opacity-20">{header}</s>
                      <br />
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
                return (
                  <td
                    key={cellIdx}
                    className={cn('border px-2 py-1', customRow?.visible === false && 'opacity-10')}
                  >
                    {customRow?.valueChange ? (
                      <>
                        <s className="text-xs opacity-20">{cell}</s>
                        <br />
                        {customRow.valueChange(cell)}
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
