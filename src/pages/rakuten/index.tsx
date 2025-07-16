import { useState } from 'react';
import { TableDisplay } from '@/components/DataDisplay/TableDisplay';
import { parseCsvFile } from '@/utils/csvUtils';

export const RakutenPage = () => {
  const [tableData, setTableData] = useState<string[][]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseCsvFile(file, setTableData);
  };

  return (
    <div>
      <h1>Rakuten Page</h1>
      <p>This page is dedicated to Rakuten services.</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      <TableDisplay data={tableData} />
    </div>
  );
};
