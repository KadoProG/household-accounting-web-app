import { useCallback, useState } from 'react';
import { TableDisplay } from '@/components/DataDisplay/TableDisplay';
import { parseCsvFile } from '@/utils/csvUtils';
import { DropOverlay } from '@/components/DropOverlay';
import { useGlobalDropOverlay } from '@/components/DropOverlay/useGlobalDropOverlay';

export const RakutenPage = () => {
  const [tableData, setTableData] = useState<string[][]>([]);
  const isDragging = useGlobalDropOverlay((file) => parseCsvFile(file, setTableData));

  // input[type=file]用のアップロードハンドラ
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseCsvFile(file, setTableData);
  }, []);

  return (
    <div className="relative">
      {isDragging && <DropOverlay>CSVファイルをここにドロップ</DropOverlay>}
      <h1>Rakuten Page</h1>
      <p>This page is dedicated to Rakuten services.</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <TableDisplay data={tableData} />
    </div>
  );
};
