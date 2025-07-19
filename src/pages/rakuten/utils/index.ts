import type { CustomRow } from '../types';

export const makeRakutenCustomValues = (headerValues: string[]) => {
  return headerValues.map((cellValue) => {
    const customRow: CustomRow = {};
    if (cellValue === '利用日') {
      customRow.titleChange = () => '日付';
      customRow.valueChange = (value) => value;
    }

    if (['新規サイン', '利用者'].includes(cellValue)) customRow.visible = false;
    return customRow;
  });
};
