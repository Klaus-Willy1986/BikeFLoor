'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
import { Package } from 'lucide-react';

export function InventoryStock() {
  const t = useTranslations('dashboard');

  const { data: lowStockItems, isLoading } = useQuery({
    queryKey: ['inventory-low-stock'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('inventory_items')
        .select('id, name, brand, quantity')
        .lte('quantity', 2)
        .order('quantity', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="border-0 card-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            {t('inventoryStock')}
          </CardTitle>
          <Link
            href="/lager"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            {t('viewAll')} →
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : !lowStockItems?.length ? (
          <p className="text-sm text-muted-foreground py-4">{t('stockOk')}</p>
        ) : (
          <div className="space-y-2">
            {lowStockItems.map((item) => (
              <Link
                key={item.id}
                href={`/lager?item=${item.id}`}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">{item.name}</p>
                  {item.brand && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.brand}</p>
                  )}
                </div>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0 ml-2">
                  {item.quantity}x — {t('lowStock')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
