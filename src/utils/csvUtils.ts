import Papa from 'papaparse';

export const parseCsvFile = (file: File, onComplete: (data: string[][]) => void) => {
  Papa.parse(file, {
    complete: (result: Papa.ParseResult<string[]>) => {
      onComplete(result.data as string[][]);
    },
    encoding: 'UTF-8',
  });
};
