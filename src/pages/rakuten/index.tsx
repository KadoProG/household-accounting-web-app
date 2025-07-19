import { useCallback, useState } from 'react';
import { TableDisplay } from '@/components/DataDisplay/TableDisplay';
import { parseCsvFile } from '@/utils/csvUtils';
import { DropOverlay } from '@/components/DropOverlay';
import { useGlobalDropOverlay } from '@/components/DropOverlay/useGlobalDropOverlay';
import type { CustomRow } from '@/pages/rakuten/types';
import { makeRakutenCustomValues } from './utils';

export const RakutenPage = () => {
  const [tableData, setTableData] = useState<string[][]>([]);
  const [customRows, setCustomRows] = useState<CustomRow[]>([]);

  const handleCsvFileUpload = useCallback(async (file: File) => {
    const newTableData = await parseCsvFile(file);
    setTableData(newTableData);

    setCustomRows(makeRakutenCustomValues(newTableData[0]));
  }, []);

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

  return (
    <div className="relative">
      {isDragging && <DropOverlay>CSVファイルをここにドロップ</DropOverlay>}
      <h1>Rakuten Page</h1>
      <p>This page is dedicated to Rakuten services.</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <TableDisplay data={tableData} customRows={customRows} />
    </div>
  );
};
