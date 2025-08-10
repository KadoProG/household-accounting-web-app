import React, { useCallback, useState } from 'react';
import { CSVDataTable } from './CSVDataTable';
import { parseCsvFile, exportCsv } from './utils/csv';
import { DropOverlay } from '@/components/DropOverlay';
import { useGlobalDropOverlay } from '@/components/DropOverlay/useGlobalDropOverlay';
import { Switch } from '@/components/Inputs/Switch';
import { convertTableDataForExport } from './utils/table';
import type { TablePlan } from './types';

type Props = {
  title: string;
  description: string;
  exportFileName: string;
  tablePlan: TablePlan;
  encoding?: 'UTF-8' | 'SHIFT_JIS';
};

export const CSVProcessor = ({
  title,
  description,
  exportFileName,
  tablePlan,
  encoding = 'UTF-8',
}: Props) => {
  const [tableData, setTableData] = useState<string[][]>([]);
  const [customRows, setCustomRows] = useState<TablePlan>({ columns: {} });
  const [hiddenDisable, setHiddenDisable] = useState<boolean>(false);

  const handleCsvFileUpload = useCallback(
    async (file: File) => {
      const newTableData = await parseCsvFile(file);
      console.log(newTableData);
      if (
        newTableData[newTableData.length - 1]?.length === 1 &&
        newTableData[newTableData.length - 1][0] === ''
      ) {
        newTableData.pop();
      }
      setTableData(newTableData);
      setCustomRows(tablePlan);
    },
    [tablePlan]
  );

  const isDragging = useGlobalDropOverlay(handleCsvFileUpload);

  // input[type=file]用のアップロードハンドラ
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      handleCsvFileUpload(file);
    },
    [handleCsvFileUpload]
  );

  // CSVDataTableと同じ変換・除外ロジックでエクスポートする関数
  const handleExportCsv = useCallback(() => {
    const exportData = convertTableDataForExport(tableData, customRows);
    exportCsv(exportData, exportFileName, encoding);
  }, [tableData, customRows, exportFileName, encoding]);

  // 再変換処理を実行する関数
  const handleReconvert = useCallback(() => {
    if (tableData.length === 0) return;

    setCustomRows(tablePlan);
  }, [tableData, tablePlan]);

  return (
    <div className="relative">
      {isDragging && <DropOverlay>CSVファイルをここにドロップ</DropOverlay>}
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p>{description}</p>
      <label className="inline-flex gap-2 p-2">
        <span>非表示のコンテンツを省略</span>
        <Switch checked={hiddenDisable} onChange={() => setHiddenDisable((prev) => !prev)} />
      </label>

      <input type="file" accept=".csv" onChange={handleFileUpload} className="bg-secondary p-2" />
      <button
        type="button"
        className="ml-2 cursor-pointer rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        onClick={handleExportCsv}
        disabled={tableData.length === 0}
      >
        エクスポート
      </button>
      <button
        type="button"
        className="bg-warning text-warning-foreground hover:bg-warning/90 ml-2 cursor-pointer rounded px-4 py-2"
        onClick={handleReconvert}
        disabled={tableData.length === 0}
      >
        再変換
      </button>
      <CSVDataTable data={tableData} tablePlan={customRows} hiddenDisable={hiddenDisable} />
    </div>
  );
};

// 型定義もエクスポート
export type { TablePlan, ColumnTransform, CellContext } from './types';
