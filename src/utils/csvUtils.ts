import Papa from 'papaparse';
import { toast } from 'react-hot-toast';

export const parseCsvFile = (file: File, onComplete: (data: string[][]) => void) => {
  // CSVファイルかどうか判定
  const isCsvExtension = file.name.toLowerCase().endsWith('.csv');
  const isCsvMimeType = file.type === 'text/csv';
  if (!isCsvExtension && !isCsvMimeType) {
    // CSVでなければエラートーストを表示
    toast.error('CSVファイルのみアップロード可能です');
    return;
  }
  Papa.parse(file, {
    complete: (result: Papa.ParseResult<string[]>) => {
      onComplete(result.data as string[][]);
    },
    encoding: 'UTF-8',
  });
};
