'use client';

import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { LogOut, User, Bike } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface TopbarProps {
  onMenuClick?: () => void;
  userEmail?: string;
}

export function Topbar({ userEmail }: TopbarProps) {
  const t = useTranslations();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const initials = userEmail
    ? userEmail.split('@')[0].slice(0, 2).toUpperCase()
    : '??';

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Bike className="h-4 w-4 text-primary-foreground" />
        </div>
        <Link href="/dashboard" className="text-[15px] font-bold tracking-tight">
          BikeFloor
        </Link>
      </div>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LocaleSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 gap-2.5 px-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                {initials}
              </div>
              {userEmail && (
                <span className="hidden text-[13px] text-muted-foreground lg:inline">
                  {userEmail}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {userEmail && (
              <>
                <div className="px-2 py-2">
                  <p className="text-sm font-medium">{userEmail}</p>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <User className="mr-2 h-4 w-4" />
                {t('nav.settings')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              {t('auth.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
