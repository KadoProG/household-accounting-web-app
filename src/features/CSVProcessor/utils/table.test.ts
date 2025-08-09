import { describe, it, expect } from 'vitest';
import { convertTableDataForExport } from './table';
import type { TablePlan } from '../types';

describe('convertTableDataForExport', () => {
  describe('基本的な変換', () => {
    it('プレーンなデータをそのまま変換できる', () => {
      const tableData = [
        ['Name', 'Age', 'City'],
        ['Alice', '25', 'Tokyo'],
        ['Bob', '30', 'Osaka'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: {},
          City: {},
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'Age', 'City'],
        ['Alice', '25', 'Tokyo'],
        ['Bob', '30', 'Osaka'],
      ]);
    });

    it('空のデータを処理できる', () => {
      const tableData: string[][] = [];
      const tablePlan: TablePlan = {
        columns: {},
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([]);
    });

    it('未定義の列は除外される', () => {
      const tableData = [
        ['Name', 'Age', 'Secret'],
        ['Alice', '25', 'hidden'],
        ['Bob', '30', 'data'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: {},
          // Secret列は未定義
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'Age'],
        ['Alice', '25'],
        ['Bob', '30'],
      ]);
    });
  });

  describe('列変換', () => {
    it('hide: trueで列を非表示にできる', () => {
      const tableData = [
        ['Name', 'Age', 'City'],
        ['Alice', '25', 'Tokyo'],
        ['Bob', '30', 'Osaka'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: { hide: true },
          City: {},
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'City'],
        ['Alice', 'Tokyo'],
        ['Bob', 'Osaka'],
      ]);
    });

    it('mapHeaderでヘッダ名を変更できる', () => {
      const tableData = [
        ['Name', 'Age', 'City'],
        ['Alice', '25', 'Tokyo'],
        ['Bob', '30', 'Osaka'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: { mapHeader: () => '名前' },
          Age: { mapHeader: () => '年齢' },
          City: { mapHeader: () => '都市' },
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['名前', '年齢', '都市'],
        ['Alice', '25', 'Tokyo'],
        ['Bob', '30', 'Osaka'],
      ]);
    });

    it('mapValueでセル値を変換できる', () => {
      const tableData = [
        ['Name', 'Age', 'Active'],
        ['Alice', '25', 'true'],
        ['Bob', '30', 'false'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: { mapValue: (value) => `${value}歳` },
          Active: { mapValue: (value) => (value === 'true' ? '有効' : '無効') },
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'Age', 'Active'],
        ['Alice', '25歳', '有効'],
        ['Bob', '30歳', '無効'],
      ]);
    });

    it('mapValueでCellContextを使用して他の列にアクセスできる', () => {
      const tableData = [
        ['FirstName', 'LastName', 'FullName'],
        ['Alice', 'Smith', ''],
        ['Bob', 'Johnson', ''],
      ];
      const tablePlan: TablePlan = {
        columns: {
          FirstName: {},
          LastName: {},
          FullName: {
            mapValue: (_, ctx) => `${ctx.get('FirstName')} ${ctx.get('LastName')}`,
          },
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['FirstName', 'LastName', 'FullName'],
        ['Alice', 'Smith', 'Alice Smith'],
        ['Bob', 'Johnson', 'Bob Johnson'],
      ]);
    });
  });

  describe('行フィルタリング', () => {
    it('rowFiltersで条件に合う行を除外できる', () => {
      const tableData = [
        ['Name', 'Age', 'Active'],
        ['Alice', '25', 'true'],
        ['Bob', '30', 'false'],
        ['Charlie', '35', 'true'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: {},
          Active: {},
        },
        rowFilters: [
          {
            hideIf: (ctx) => ctx.get('Active') === 'false',
          },
        ],
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'Age', 'Active'],
        ['Alice', '25', 'true'],
        ['Charlie', '35', 'true'],
      ]);
    });

    it('複数のrowFiltersが適用される', () => {
      const tableData = [
        ['Name', 'Age', 'Active'],
        ['Alice', '20', 'true'],
        ['Bob', '30', 'false'],
        ['Charlie', '25', 'true'],
        ['Dave', '40', 'true'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: {},
          Active: {},
        },
        rowFilters: [
          {
            hideIf: (ctx) => ctx.get('Active') === 'false',
          },
          {
            hideIf: (ctx) => Number(ctx.get('Age')) < 25,
          },
        ],
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'Age', 'Active'],
        ['Charlie', '25', 'true'],
        ['Dave', '40', 'true'],
      ]);
    });
  });

  describe('並び替え', () => {
    it('reorder.columnsで列順を変更できる', () => {
      const tableData = [
        ['Name', 'Age', 'City'],
        ['Alice', '25', 'Tokyo'],
        ['Bob', '30', 'Osaka'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: {},
          City: {},
        },
        reorder: {
          columns: ['City', 'Name'],
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['City', 'Name', 'Age'], // City, Name, Age の順
        ['Tokyo', 'Alice', '25'],
        ['Osaka', 'Bob', '30'],
      ]);
    });

    it('reorder.rows（string比較）で行を並び替えできる', () => {
      const tableData = [
        ['Name', 'Age'],
        ['Charlie', '25'],
        ['Alice', '30'],
        ['Bob', '20'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: {},
        },
        reorder: {
          rows: {
            byHeader: 'Name',
            direction: 'asc',
            as: 'string',
          },
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'Age'],
        ['Alice', '30'],
        ['Bob', '20'],
        ['Charlie', '25'],
      ]);
    });

    it('reorder.rows（number比較）で行を並び替えできる', () => {
      const tableData = [
        ['Name', 'Age'],
        ['Charlie', '25'],
        ['Alice', '30'],
        ['Bob', '20'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: {},
        },
        reorder: {
          rows: {
            byHeader: 'Age',
            direction: 'desc',
            as: 'number',
          },
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'Age'],
        ['Alice', '30'],
        ['Charlie', '25'],
        ['Bob', '20'],
      ]);
    });

    it('reorder.rows（date比較）で行を並び替えできる', () => {
      const tableData = [
        ['Name', 'Date'],
        ['Event1', '2023-12-01'],
        ['Event2', '2023-11-15'],
        ['Event3', '2023-12-15'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Date: {},
        },
        reorder: {
          rows: {
            byHeader: 'Date',
            direction: 'asc',
            as: 'date',
          },
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'Date'],
        ['Event2', '2023-11-15'],
        ['Event1', '2023-12-01'],
        ['Event3', '2023-12-15'],
      ]);
    });

    it('reorder.rows（関数）でカスタム並び替えができる', () => {
      const tableData = [
        ['Name', 'Score'],
        ['Alice', '85'],
        ['Bob', '92'],
        ['Charlie', '78'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Score: {},
        },
        reorder: {
          rows: (a, b) => {
            const scoreA = Number(a.get('Score'));
            const scoreB = Number(b.get('Score'));
            return scoreB - scoreA; // 降順
          },
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'Score'],
        ['Bob', '92'],
        ['Alice', '85'],
        ['Charlie', '78'],
      ]);
    });
  });

  describe('複合的なケース', () => {
    it('列変換・行フィルタ・並び替えが組み合わせて適用される', () => {
      const tableData = [
        ['Name', 'Age', 'Score', 'Active'],
        ['Alice', '25', '85', 'true'],
        ['Bob', '30', '92', 'false'],
        ['Charlie', '20', '78', 'true'],
        ['Dave', '35', '88', 'true'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: { mapHeader: () => '名前' },
          Age: { hide: true }, // Age列は非表示
          Score: { mapValue: (value) => `${value}点` },
          Active: {},
        },
        rowFilters: [
          {
            hideIf: (ctx) => ctx.get('Active') === 'false', // 非アクティブ行を除外
          },
          {
            hideIf: (ctx) => Number(ctx.get('Age')) < 25, // 25歳未満を除外
          },
        ],
        reorder: {
          columns: ['Score', 'Name'], // Score, Name, Active の順
          rows: {
            byHeader: 'Score',
            direction: 'desc',
            as: 'number',
          },
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Score', '名前', 'Active'],
        ['88点', 'Dave', 'true'],
        ['85点', 'Alice', 'true'],
      ]);
    });
  });

  describe('エッジケース', () => {
    it('ヘッダのみのデータを処理できる', () => {
      const tableData = [['Name', 'Age', 'City']];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: {},
          City: {},
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([['Name', 'Age', 'City']]);
    });

    it('存在しないヘッダでの並び替えは無視される', () => {
      const tableData = [
        ['Name', 'Age'],
        ['Alice', '25'],
        ['Bob', '30'],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: {},
        },
        reorder: {
          rows: {
            byHeader: 'NonExistent',
            direction: 'asc',
            as: 'string',
          },
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'Age'],
        ['Alice', '25'],
        ['Bob', '30'],
      ]);
    });

    it('CellContext.getで存在しないヘッダを取得するとundefinedを返す', () => {
      const tableData = [
        ['Name', 'Age', 'TestColumn'],
        ['Alice', '25', ''],
      ];
      const tablePlan: TablePlan = {
        columns: {
          Name: {},
          Age: {},
          TestColumn: {
            mapValue: (_, ctx) => ctx.get('NonExistent') || 'default',
          },
        },
      };

      const result = convertTableDataForExport(tableData, tablePlan);

      expect(result).toEqual([
        ['Name', 'Age', 'TestColumn'],
        ['Alice', '25', 'default'],
      ]);
    });
  });
});
