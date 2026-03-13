'use client';

import { useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Bike,
  Wrench,
  Route,
  MoreHorizontal,
  Package,
  Settings,
  Shield,
  X,
} from 'lucide-react';

const mainNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/bikes', icon: Bike, labelKey: 'bikes' },
  { href: '/services', icon: Wrench, labelKey: 'services' },
  { href: '/rides', icon: Route, labelKey: 'rides' },
] as const;

const moreNavItems = [
  { href: '/lager', icon: Package, labelKey: 'lager' },
  { href: '/settings', icon: Settings, labelKey: 'settings' },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const [moreOpen, setMoreOpen] = useState(false);
  const supabase = createClient();

  const { data: profile } = useQuery({
    queryKey: ['profile-role'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const isAdmin = profile?.role === 'admin';

  const isMoreActive =
    moreNavItems.some(
      (item) =>
        pathname === item.href || pathname.startsWith(item.href)
    ) ||
    (isAdmin && pathname === '/admin');

  return (
    <>
      {/* "More" overlay */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-[57px] left-0 right-0 bg-card border-t border-border/60 rounded-t-2xl shadow-xl animate-in slide-in-from-bottom-4 duration-200">
            <div className="px-4 py-3 space-y-1">
              {moreNavItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    pathname === '/admin'
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <Shield className="h-5 w-5" />
                  {t('admin')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-card/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-around">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-1 flex-col items-center gap-0.5 pb-2 pt-2.5 text-[10px] font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground/70 active:text-foreground'
                )}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary" />
                )}
                <item.icon className={cn('h-5 w-5', isActive && 'drop-shadow-sm')} />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={cn(
              'relative flex flex-1 flex-col items-center gap-0.5 pb-2 pt-2.5 text-[10px] font-medium transition-colors',
              moreOpen || isMoreActive
                ? 'text-primary'
                : 'text-muted-foreground/70 active:text-foreground'
            )}
          >
            {isMoreActive && !moreOpen && (
              <span className="absolute top-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary" />
            )}
            {moreOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MoreHorizontal className="h-5 w-5" />
            )}
            <span>{t('more')}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
