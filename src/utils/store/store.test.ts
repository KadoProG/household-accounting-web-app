import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LOCAL_STORAGE_KEY, store } from '.';

// localStorageのモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('取得(get)', () => {
    it('localStorageが空の場合、デフォルト値を返すこと', () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(store.get('theme')).toBe('device');
    });

    it('localStorageに有効なデータがある場合、その値を返すこと', () => {
      const mockData = {
        theme: 'dark' as const,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));
      expect(store.get('theme')).toBe('dark');
    });

    it('localStorageの値が不正なJSONの場合、デフォルト値を返すこと', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      expect(store.get('theme')).toBe('device');
    });

    it('データの一部キーが欠損している場合、欠損分はデフォルト値を返すこと', () => {
      const mockData = {};
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));
      expect(store.get('theme')).toBe('device');
    });
  });

  describe('セット(set)', () => {
    it('localStorageが空の場合、新しい値をセットすること', () => {
      localStorageMock.getItem.mockReturnValue(null);
      store.set('theme', 'dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'dark',
        })
      );
    });

    it('localStorageに既存データがある場合、値を更新すること', () => {
      const existingData = {
        theme: 'light' as const,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingData));
      store.set('theme', 'dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'dark',
        })
      );
    });

    it('既存データが不正なJSONの場合、デフォルト値を使ってセットすること', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      store.set('theme', 'dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'dark',
        })
      );
    });

    it('themeの値をセットできること', () => {
      localStorageMock.getItem.mockReturnValue(null);
      store.set('theme', 'light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'light',
        })
      );
      store.set('theme', 'dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'dark',
        })
      );
      store.set('theme', 'device');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'device',
        })
      );
    });
  });

  describe('削除(remove)', () => {
    it('localStorageが空の場合、何もしないこと', () => {
      localStorageMock.getItem.mockReturnValue(null);
      store.remove('theme');
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('既存データから指定したキーを削除すること', () => {
      const existingData = {
        theme: 'dark' as const,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingData));
      store.remove('theme');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY, JSON.stringify({}));
    });

    it('既存データが不正なJSONの場合、何もしないこと', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      store.remove('theme');
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('クリア(clear)', () => {
    it('localStorageの全データを削除すること', () => {
      store.clear();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY);
    });
  });

  describe('統合テスト(integration)', () => {
    it('get/setの操作でデータの一貫性を維持すること', () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(store.get('theme')).toBe('device');
      store.set('theme', 'dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'dark',
        })
      );
      const storedData = {
        theme: 'dark' as const,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));
      expect(store.get('theme')).toBe('dark');
    });

    it('エラー復旧を優雅に処理すること', () => {
      vi.clearAllMocks();
      localStorageMock.getItem.mockReturnValue('invalid-json');
      expect(store.get('theme')).toBe('device');
      store.set('theme', 'light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          theme: 'light',
        })
      );
      const validData = {
        theme: 'light' as const,
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(validData));
      expect(store.get('theme')).toBe('light');
    });
  });
});
