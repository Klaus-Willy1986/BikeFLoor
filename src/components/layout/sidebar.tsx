'use client';

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
  Package,
  Settings,
  Shield,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { href: '/bikes', icon: Bike, labelKey: 'bikes' },
  { href: '/services', icon: Wrench, labelKey: 'services' },
  { href: '/lager', icon: Package, labelKey: 'lager' },
  { href: '/rides', icon: Route, labelKey: 'rides' },
  { href: '/settings', icon: Settings, labelKey: 'settings' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('nav');
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

  return (
    <aside className="relative hidden lg:flex lg:flex-col lg:w-[240px] shrink-0 bg-sidebar text-sidebar-foreground">
      {/* Topo Pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.15]">
          <defs>
            <filter id="topo-sidebar" x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feTurbulence type="turbulence" baseFrequency="0.008 0.006" numOctaves="5" seed="8" stitchTiles="stitch" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
              <feComponentTransfer in="gray" result="bands">
                <feFuncR type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
                <feFuncG type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
                <feFuncB type="discrete" tableValues="0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1" />
              </feComponentTransfer>
              <feMorphology operator="erode" radius="1" in="bands" result="thin" />
              <feComposite operator="out" in="bands" in2="thin" result="edges" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#topo-sidebar)" />
        </svg>
      </div>

      {/* Logo */}
      <div className="relative z-10 flex h-16 items-center gap-3 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Bike className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <Link href="/dashboard" className="text-[17px] font-bold tracking-tight text-white">
          BikeFloor
        </Link>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 px-3 pt-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all',
                isActive
                  ? 'bg-sidebar-accent text-white'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0',
                  isActive
                    ? 'text-sidebar-primary'
                    : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground'
                )}
              />
              {t(item.labelKey)}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
              )}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className={cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all',
              pathname === '/admin'
                ? 'bg-sidebar-accent text-white'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white'
            )}
          >
            <Shield
              className={cn(
                'h-[18px] w-[18px] shrink-0',
                pathname === '/admin'
                  ? 'text-sidebar-primary'
                  : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground'
              )}
            />
            {t('admin')}
            {pathname === '/admin' && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
            )}
          </Link>
        )}
      </nav>

      {/* Bottom */}
      <div className="relative z-10 px-3 pb-4">
        <div className="rounded-lg bg-sidebar-accent px-3 py-3">
          <p className="text-[11px] font-medium text-sidebar-foreground/50">
            BikeFloor v0.1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
