import { cn } from '@/utils/className';
import React from 'react';

interface TableDisplayProps {
  data: string[][];
  headerRowCustom: { visible: boolean }[];
}

export const TableDisplay: React.FC<TableDisplayProps> = ({ data, headerRowCustom }) => {
  if (!data || data.length === 0) return null;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            {data[0].map((header, idx) => (
              <th
                key={idx}
                className={cn(
                  'border bg-gray-100 px-2 py-1',
                  !headerRowCustom[idx]?.visible && 'opacity-10'
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className={cn(
                    'border px-2 py-1',
                    !headerRowCustom[cellIdx]?.visible && 'opacity-10'
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
