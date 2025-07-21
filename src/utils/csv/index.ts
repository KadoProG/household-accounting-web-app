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

/**
 * 2次元配列データをCSV文字列に変換し、ファイルとしてダウンロードする
 * @param data エクスポートする2次元配列データ
 * @param filename ダウンロード時のファイル名（デフォルト: export.csv）
 */
export const exportCsv = (data: string[][], filename = 'export.csv') => {
  if (!data || data.length === 0) return;
  // CSV文字列に変換
  const csv = data
    .map((row) => row.map((cell) => `"${(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  // BOM付きUTF-8
  const bom = '\uFEFF';
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
