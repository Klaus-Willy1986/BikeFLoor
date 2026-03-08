'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInventory, useDeleteInventoryItem } from '@/hooks/use-inventory';
import { useBikes } from '@/hooks/use-bikes';
import { useComponentCategories } from '@/hooks/use-components';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { LagerFormDialog } from './lager-form-dialog';
import { InstallDialog } from './install-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Package, MoreHorizontal, Pencil, Trash2, Wrench, ShoppingCart, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function LagerList() {
  const t = useTranslations();
  const { data: items, isLoading } = useInventory();
  const { data: bikes } = useBikes();
  const { data: categories } = useComponentCategories();
  const deleteItem = useDeleteInventoryItem();

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [installItem, setInstallItem] = useState<any | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteItem.mutateAsync(deleteId);
      toast.success(t('common.delete'));
      setDeleteId(null);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  const getCategoryLabel = (catId: string | null) => {
    if (!catId || !categories) return null;
    const cat = categories.find((c) => c.id === catId);
    return cat ? t(`components.categories.${cat.key}`) : null;
  };

  const getBikeName = (bikeId: string) => {
    return bikes?.find((b) => b.id === bikeId)?.name ?? bikeId;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('lager.title')} />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg border bg-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('lager.title')}
        description={t('lager.description')}
        action={
          <Button size="sm" onClick={() => { setEditItem(null); setFormOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            {t('lager.addItem')}
          </Button>
        }
      />

      {!items?.length ? (
        <EmptyState
          title={t('lager.noItems')}
          description={t('lager.noItemsDescription')}
          icon={<Package className="h-16 w-16" strokeWidth={1} />}
          action={
            <Button size="sm" onClick={() => { setEditItem(null); setFormOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              {t('lager.addItem')}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate">{item.name}</h3>
                      {getCategoryLabel(item.category_id) && (
                        <Badge variant="secondary" className="text-[10px] shrink-0">
                          {getCategoryLabel(item.category_id)}
                        </Badge>
                      )}
                    </div>
                    {(item.brand || item.model) && (
                      <p className="text-xs text-muted-foreground">
                        {[item.brand, item.model].filter(Boolean).join(' ')}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {item.quantity}x
                      </span>
                      {item.price != null && (
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          {Number(item.price).toFixed(2)} {t('common.currency')}
                        </span>
                      )}
                      {item.purchased_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.purchased_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {item.suitable_bike_ids?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.suitable_bike_ids.map((id: string) => (
                          <Badge key={id} variant="outline" className="text-[10px]">
                            {getBikeName(id)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setInstallItem(item)}>
                        <Wrench className="mr-2 h-4 w-4" />
                        {t('lager.install')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setEditItem(item); setFormOpen(true); }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {t('common.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('common.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LagerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editItem}
      />

      <InstallDialog
        open={!!installItem}
        onOpenChange={(open) => !open && setInstallItem(null)}
        item={installItem}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t('lager.deleteItem')}
        description={t('lager.deleteConfirm')}
        onConfirm={handleDelete}
        loading={deleteItem.isPending}
      />
    </div>
  );
}
