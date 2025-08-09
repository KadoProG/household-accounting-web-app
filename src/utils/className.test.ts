import { describe, it, expect } from 'vitest';
import { cn } from './className';

describe('cn関数', () => {
  describe('基本的な機能', () => {
    it('単一の文字列クラス名を返す', () => {
      expect(cn('text-red-500')).toBe('text-red-500');
    });

    it('複数の文字列クラス名を結合する', () => {
      expect(cn('text-red-500', 'bg-blue-300')).toBe('text-red-500 bg-blue-300');
    });

    it('空の値を無視する', () => {
      expect(cn('text-red-500', '', null, undefined, false)).toBe('text-red-500');
    });

    it('引数なしの場合は空文字列を返す', () => {
      expect(cn()).toBe('');
    });
  });

  describe('Tailwind CSSクラスの競合解決', () => {
    it('同じプロパティの異なる値を持つクラスで、後のクラスが優先される', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('背景色の競合を解決する', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('パディングの競合を解決する', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('マージンの競合を解決する', () => {
      expect(cn('m-2', 'm-4')).toBe('m-4');
    });

    it('幅の競合を解決する', () => {
      expect(cn('w-full', 'w-1/2')).toBe('w-1/2');
    });

    it('高さの競合を解決する', () => {
      expect(cn('h-screen', 'h-64')).toBe('h-64');
    });

    it('競合しないクラスはすべて保持される', () => {
      const result = cn('text-red-500', 'bg-blue-500', 'p-4');
      expect(result).toBe('text-red-500 bg-blue-500 p-4');
    });
  });

  describe('条件付きクラス名', () => {
    it('真偽値に基づいてクラスを適用する', () => {
      expect(cn('base-class', true && 'conditional-class')).toBe('base-class conditional-class');
      expect(cn('base-class', false && 'conditional-class')).toBe('base-class');
    });

    it('オブジェクト形式の条件付きクラスを処理する', () => {
      expect(
        cn({
          active: true,
          disabled: false,
          loading: true,
        })
      ).toBe('active loading');
    });

    it('複雑な条件付きクラスの組み合わせ', () => {
      const isActive = true;
      const isDisabled = false;
      const variant = 'primary';

      expect(
        cn(
          'btn',
          {
            'btn-active': isActive,
            'btn-disabled': isDisabled,
          },
          variant === 'primary' && 'btn-primary',
          variant === 'secondary' && 'btn-secondary'
        )
      ).toBe('btn btn-active btn-primary');
    });
  });

  describe('配列とネストされた値', () => {
    it('配列内のクラス名を処理する', () => {
      expect(cn(['text-red-500', 'bg-blue-500'])).toBe('text-red-500 bg-blue-500');
    });

    it('ネストされた配列を処理する', () => {
      expect(cn(['base-class', ['nested-class-1', 'nested-class-2'], 'final-class'])).toBe(
        'base-class nested-class-1 nested-class-2 final-class'
      );
    });

    it('配列内の条件付きクラスを処理する', () => {
      expect(cn(['base-class', true && 'conditional-class', false && 'hidden-class'])).toBe(
        'base-class conditional-class'
      );
    });
  });

  describe('エッジケース', () => {
    it('重複するクラス名を除去する', () => {
      expect(cn('text-red-500', 'text-red-500')).toBe('text-red-500');
    });

    it('空白文字を含む文字列を正しく処理する', () => {
      expect(cn('  text-red-500  ', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    });

    it('数値を文字列として処理する', () => {
      expect(cn('class-name', 123 as any)).toBe('class-name 123');
    });

    it('非常に長いクラス名リストを処理する', () => {
      const manyClasses = Array.from({ length: 50 }, (_, i) => `class-${i}`);
      const result = cn(...manyClasses);
      expect(result).toContain('class-0');
      expect(result).toContain('class-49');
      expect(result.split(' ')).toHaveLength(50);
    });

    it('Tailwindの修飾子（hover、focus等）を含むクラスの競合解決', () => {
      expect(cn('text-red-500', 'hover:text-blue-500', 'text-green-500')).toBe(
        'hover:text-blue-500 text-green-500'
      );
    });

    it('レスポンシブ修飾子を含むクラスの競合解決', () => {
      expect(cn('text-sm', 'md:text-lg', 'text-base')).toBe('md:text-lg text-base');
    });
  });

  describe('実際の使用例', () => {
    it('ボタンコンポーネントのクラス名生成', () => {
      const buttonClasses = cn(
        'px-4 py-2 rounded font-medium transition-colors',
        'bg-blue-500 text-white',
        'hover:bg-blue-600',
        'disabled:opacity-50 disabled:cursor-not-allowed'
      );

      expect(buttonClasses).toBe(
        'px-4 py-2 rounded font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
      );
    });

    it('カードコンポーネントのクラス名生成（条件付き）', () => {
      const isSelected = true;
      const size = 'large';

      const cardClasses = cn(
        'bg-white rounded-lg shadow border',
        {
          'ring-2 ring-blue-500': isSelected,
          'opacity-50': false,
        },
        size === 'small' && 'p-2',
        size === 'medium' && 'p-4',
        size === 'large' && 'p-6'
      );

      expect(cardClasses).toBe('bg-white rounded-lg shadow border ring-2 ring-blue-500 p-6');
    });
  });
});
