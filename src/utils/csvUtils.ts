import Papa from 'papaparse';
import { toast } from 'react-hot-toast';

export const parseCsvFile = (file: File): Promise<string[][]> =>
  new Promise((resolve, reject) => {
    // CSVファイルかどうか判定
    const isCsvExtension = file.name.toLowerCase().endsWith('.csv');
    const isCsvMimeType = file.type === 'text/csv';
    if (!isCsvExtension && !isCsvMimeType) {
      // CSVでなければエラートーストを表示
      toast.error('CSVファイルのみアップロード可能です');
      reject('CSVファイルのみアップロード可能です');
    }
    Papa.parse(file, {
      complete: (result: Papa.ParseResult<string[]>) => {
        resolve(result.data as string[][]);
      },
      error: (...error) => {
        toast.error('ファイル解釈中にエラーが発生しました');
        reject(error);
      },
      encoding: 'UTF-8',
    });
  });
