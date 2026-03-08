'use client';

import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Bike,
  Cog,
  Wrench,
  Route,
  Package,
  Settings,
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

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[240px] bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Bike className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <Link href="/dashboard" className="text-[17px] font-bold tracking-tight text-white">
          BikeFloor
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-2 space-y-0.5">
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
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4">
        <div className="rounded-lg bg-sidebar-accent px-3 py-3">
          <p className="text-[11px] font-medium text-sidebar-foreground/50">
            BikeFloor v0.1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
