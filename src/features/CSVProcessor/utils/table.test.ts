import { describe, expect, it } from 'vitest';
import { convertTableDataForExport } from './table';
import type { ColumnRule } from '../types';

describe('convertTableDataForExport', () => {
  it('全てのカラムがvisibleな場合、ヘッダー・データがそのまま出力される', () => {
    const tableData = [
      ['A', 'B', 'C'],
      ['1', '2', '3'],
      ['4', '5', '6'],
    ];
    const customRows: ColumnRule[] = [{}, {}, {}];
    expect(convertTableDataForExport(tableData, customRows)).toEqual(tableData);
  });

  it('visible: falseのカラムは除外される', () => {
    const tableData = [
      ['A', 'B', 'C'],
      ['1', '2', '3'],
      ['4', '5', '6'],
    ];
    const customRows: ColumnRule[] = [{ visible: false }, {}, {}];
    expect(convertTableDataForExport(tableData, customRows)).toEqual([
      ['B', 'C'],
      ['2', '3'],
      ['5', '6'],
    ]);
  });

  it('mapTitle/valueChangeが適用される', () => {
    const tableData = [
      ['A', 'B'],
      ['1', '2'],
    ];
    const customRows: ColumnRule[] = [
      {
        mapTitle: (t) => t + '!',
        valueChange: (v) => v + '?',
      },
      {},
    ];
    expect(convertTableDataForExport(tableData, customRows)).toEqual([
      ['A!', 'B'],
      ['1?', '2'],
    ]);
  });

  it('tableDataが空の場合は空配列を返す', () => {
    expect(convertTableDataForExport([], [])).toEqual([]);
  });

  it('customRowsが足りない場合も安全に動作する', () => {
    const tableData = [
      ['A', 'B', 'C'],
      ['1', '2', '3'],
    ];
    const customRows: ColumnRule[] = [{}];
    expect(convertTableDataForExport(tableData, customRows)).toEqual(tableData);
  });
});
