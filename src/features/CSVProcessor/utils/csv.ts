import Papa from 'papaparse';
import { toast } from 'react-hot-toast';
import Encoding from 'encoding-japanese';

/**
 * ファイルのエンコーディングを検出し、適切にデコードされたテキストを返す
 */
const detectEncodingAndDecode = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);

        // エンコーディングを検出
        const detected = Encoding.detect(uint8Array);

        // 検出されたエンコーディングでデコード
        const unicodeArray = Encoding.convert(uint8Array, {
          to: 'UNICODE',
          from: detected || 'AUTO',
        });

        // Unicode配列を文字列に変換
        const decodedText = Encoding.codeToString(unicodeArray);
        resolve(decodedText);
      } catch (error) {
        console.error('エンコーディング検出・変換エラー:', error);
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

export const parseCsvFile = (file: File): Promise<string[][]> => {
  // CSVファイルかどうか判定
  const isCsvExtension = file.name.toLowerCase().endsWith('.csv');
  const isCsvMimeType = file.type === 'text/csv';
  if (!isCsvExtension && !isCsvMimeType) {
    // CSVでなければエラートーストを表示
    toast.error('CSVファイルのみアップロード可能です');
    return Promise.reject('CSVファイルのみアップロード可能です');
  }

  return detectEncodingAndDecode(file)
    .then((decodedText) => {
      return new Promise<string[][]>((resolve, reject) => {
        // デコードされたテキストをPapaparseで解析
        Papa.parse<string[]>(decodedText, {
          complete: (result: Papa.ParseResult<string[]>) => {
            resolve(result.data as string[][]);
          },
          error: (error: Error) => {
            toast.error('ファイル解釈中にエラーが発生しました');
            reject(error);
          },
        });
      });
    })
    .catch((error) => {
      toast.error('ファイル読み込み中にエラーが発生しました');
      return Promise.reject(error);
    });
};

/**
 * 2次元配列データをCSV文字列に変換し、ファイルとしてダウンロードする
 * @param data エクスポートする2次元配列データ
 * @param filename ダウンロード時のファイル名（デフォルト: export.csv）
 * @param encoding エクスポート時のエンコーディング（'UTF-8' | 'SHIFT_JIS'、デフォルト: 'UTF-8'）
 */
export const exportCsv = (
  data: string[][],
  filename = 'export.csv',
  encoding: 'UTF-8' | 'SHIFT_JIS' = 'UTF-8'
) => {
  if (!data || data.length === 0) return;

  // CSV文字列に変換
  const csv = data
    .map((row) => row.map((cell) => `"${(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  let blob: Blob;

  if (encoding === 'SHIFT_JIS') {
    // SHIFT-JISでエンコード
    try {
      const sjisArray = Encoding.convert(Encoding.stringToCode(csv), {
        to: 'SJIS',
        from: 'UNICODE',
      });
      const uint8Array = new Uint8Array(sjisArray);
      blob = new Blob([uint8Array], { type: 'text/csv;charset=shift_jis;' });
    } catch (error) {
      console.error('SHIFT-JISエンコードエラー:', error);
      toast.error('SHIFT-JISエンコード中にエラーが発生しました');
      return;
    }
  } else {
    // BOM付きUTF-8
    const bom = '\uFEFF';
    blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
