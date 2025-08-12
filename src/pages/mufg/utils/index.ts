import type { CellContext, TablePlan } from '@/features/CSVProcessor/types';
import { formatJapaneseDate } from '@/utils/date';

export const mufgPlan: TablePlan = {
  columns: {
    日付: {
      mapHeader: () => '日付',
      mapValue: (value: string) => formatJapaneseDate(value),
    },
    摘要内容: {
      mapHeader: () => '名前',
      mapValue: (value: string, ctx: CellContext) => {
        const subHeaderText = ctx.get('摘要');
        return `${subHeaderText} ${value}`;
      },
    },
    支払い金額: {
      mapHeader: () => '金額',
      mapValue: (value: string, ctx: CellContext) => {
        if (value === '') {
          const depositAmount = ctx.get('預かり金額');
          if (!depositAmount) return '';
          const n = Number(depositAmount.replaceAll(',', ''));
          return Number.isFinite(n) ? String(n) : '';
        }
        const n = Number(value.replaceAll(',', ''));
        return Number.isFinite(n) ? String(-Math.abs(n)) : '';
      },
    },
    メモ: {
      mapHeader: () => '支払い方法',
      mapValue: () => '三菱UFJ銀行',
    },
    // それ以外の列は非表示
    // 未定義の列は自動的に非表示になります
  },
};
