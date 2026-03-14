'use client';

import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('settings');

  const cycle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const icon =
    theme === 'dark' ? <Moon className="h-4 w-4" /> :
    theme === 'system' ? <Monitor className="h-4 w-4" /> :
    <Sun className="h-4 w-4" />;

  const label =
    theme === 'dark' ? t('themeDark') :
    theme === 'system' ? t('themeSystem') :
    t('themeLight');

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={cycle}
      title={label}
    >
      {icon}
    </Button>
  );
}
