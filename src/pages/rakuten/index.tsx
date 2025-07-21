import { useCallback, useState } from 'react';
import { TableDisplay } from '@/components/DataDisplay/TableDisplay';
import { parseCsvFile } from '@/utils/csvUtils';
import { DropOverlay } from '@/components/DropOverlay';
import { useGlobalDropOverlay } from '@/components/DropOverlay/useGlobalDropOverlay';
import type { CustomRow } from '@/pages/rakuten/types';
import { makeRakutenCustomValues } from './utils';
import { Switch } from '@/components/Inputs/Switch';

export const RakutenPage = () => {
  const [tableData, setTableData] = useState<string[][]>([]);
  const [customRows, setCustomRows] = useState<CustomRow[]>([]);
  const [hiddenDisable, setHiddenDisable] = useState<boolean>(false);

  const handleCsvFileUpload = useCallback(async (file: File) => {
    const newTableData = await parseCsvFile(file);
    if (
      newTableData[newTableData.length - 1]?.length === 1 &&
      newTableData[newTableData.length - 1][0] === ''
    ) {
      newTableData.pop();
    }
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
      <label className="inline-flex gap-2 p-2">
        <span>非表示のコンテンツを省略</span>

        <Switch checked={hiddenDisable} onChange={() => setHiddenDisable((prev) => !prev)} />
      </label>

      <input type="file" accept=".csv" onChange={handleFileUpload} className="bg-bg-second p-2" />
      <TableDisplay data={tableData} customRows={customRows} hiddenDisable={hiddenDisable} />
    </div>
  );
};
