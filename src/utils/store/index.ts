type LocalStorageItem = {
  theme: 'light' | 'dark' | 'device';
};

const defaultLocalStorageItem: LocalStorageItem = {
  theme: 'device',
};

export const LOCAL_STORAGE_KEY = 'household-accounting-web-app-local-storage-key';

export const store = {
  get: <K extends keyof LocalStorageItem>(key: K): LocalStorageItem[K] => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!value) {
      return defaultLocalStorageItem[key];
    }

    try {
      const parsed: LocalStorageItem = JSON.parse(value);
      return parsed[key] || defaultLocalStorageItem[key];
    } catch {
      return defaultLocalStorageItem[key];
    }
  },

  set: <K extends keyof LocalStorageItem>(key: K, value: LocalStorageItem[K]) => {
    const current = localStorage.getItem(LOCAL_STORAGE_KEY);
    let parsed: LocalStorageItem = { ...defaultLocalStorageItem };

    if (current) {
      try {
        parsed = JSON.parse(current);
      } catch {
        // JSON parse error時はデフォルトを使う
      }
    }

    parsed[key] = value;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
  },

  remove: (key: keyof LocalStorageItem) => {
    const current = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!current) return;

    try {
      const parsed = JSON.parse(current) as Record<string, unknown>;
      delete parsed[key as string];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      // エラー時は何もしない
    }
  },

  clear: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
};
