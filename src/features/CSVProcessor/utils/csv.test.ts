import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import { parseCsvFile, exportCsv } from './csv';

// Fileのモック作成用
function createMockCsvFile(content: string, name = 'test.csv', type = 'text/csv') {
  return new File([content], name, { type });
}

describe('parseCsvFile', () => {
  it('正常なCSVファイルをパースできる', async () => {
    const csvContent = 'a,b,c\n1,2,3';
    const file = createMockCsvFile(csvContent);
    const result = await parseCsvFile(file);
    expect(result).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });

  it('CSV以外のファイルはエラーになる', async () => {
    const file = createMockCsvFile('a,b,c', 'test.txt', 'text/plain');
    await expect(parseCsvFile(file)).rejects.toBe('CSVファイルのみアップロード可能です');
  });
});

type MockLink = {
  setAttribute: (name: string, value: string) => void;
  click: () => void;
  href: string;
};

describe('exportCsv', () => {
  let createElementSpy: MockInstance;
  let appendChildSpy: MockInstance;
  let removeChildSpy: MockInstance;
  let clickSpy: ReturnType<typeof vi.fn>;
  let mockLink: MockLink;

  beforeEach(() => {
    clickSpy = vi.fn();
    mockLink = {
      setAttribute: vi.fn(),
      click: clickSpy,
      href: '',
    };
    createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation(
        () => mockLink as unknown as HTMLAnchorElement
      ) as unknown as MockInstance;
    appendChildSpy = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation((node: Node) => node) as unknown as MockInstance;
    removeChildSpy = vi
      .spyOn(document.body, 'removeChild')
      .mockImplementation((child: Node) => child) as unknown as MockInstance;

    // ここでグローバルにダミーをセット
    if (!globalThis.URL.createObjectURL) {
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:url');
    }
    if (!globalThis.URL.revokeObjectURL) {
      globalThis.URL.revokeObjectURL = vi.fn();
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('CSVファイルをダウンロードするリンクを生成しクリックする', () => {
    const data = [
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ];
    exportCsv(data, 'test.csv');
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  it('空データの場合は何もしない', () => {
    exportCsv([], 'empty.csv');
    expect(createElementSpy).not.toHaveBeenCalled();
  });

  it('SHIFT-JISエンコーディングでエクスポートできる', () => {
    const data = [
      ['名前', '住所', '値段'],
      ['田中', '東京', '1000'],
    ];
    exportCsv(data, 'test_sjis.csv', 'SHIFT_JIS');
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  it('UTF-8エンコーディングでエクスポートできる（デフォルト）', () => {
    const data = [
      ['名前', '住所', '値段'],
      ['田中', '東京', '1000'],
    ];
    exportCsv(data, 'test_utf8.csv', 'UTF-8');
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });
});
