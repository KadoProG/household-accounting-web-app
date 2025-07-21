import type { ReactNode } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/Theme';
import { DropdownList } from '../Inputs/DropdownList';

interface AppLayoutProps {
  children: ReactNode;
}

const themeOptions = [
  { label: 'ライト', value: 'light' },
  { label: 'ダーク', value: 'dark' },
  { label: 'システム', value: 'device' },
];

const AppLayout = ({ children }: AppLayoutProps) => {
  const { theme, updateTheme } = useContext(ThemeContext);
  return (
    <div className="flex min-h-screen flex-col bg-bg-base dark:bg-bg-base-dark">
      <header className="flex w-full items-center justify-between border-b border-border bg-bg-second p-4 dark:border-border-dark dark:bg-bg-second-dark">
        <h1 className="text-xl font-bold">家計簿変換！</h1>
        <div className="w-32">
          <DropdownList
            titleLabel="テーマ変更"
            id="theme-select"
            options={themeOptions}
            value={theme}
            setValue={(v) => updateTheme(v as 'light' | 'dark' | 'device')}
          />
        </div>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default AppLayout;
