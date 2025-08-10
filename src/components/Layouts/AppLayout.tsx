import type { ReactNode } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '@/contexts/Theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ChevronDownIcon } from 'lucide-react';

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

  const currentThemeLabel =
    themeOptions.find((option) => option.value === theme)?.label || 'テーマ選択';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex w-full items-center justify-between border-b border-border bg-secondary p-4">
        <Link
          to="/"
          className="rounded text-xl font-bold focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <h1>家計簿変換！</h1>
        </Link>
        <div className="w-40">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {currentThemeLabel}
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => updateTheme(value as 'light' | 'dark' | 'device')}
              >
                {themeOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default AppLayout;
