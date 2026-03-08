'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useComponents, useDeleteComponent } from '@/hooks/use-components';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ComponentCard } from './component-card';
import { ComponentFormDialog } from './component-form-dialog';
import { SwapDialog } from './swap-dialog';
import { Button } from '@/components/ui/button';
import { BulkAddDialog } from './bulk-add-dialog';
import { Plus, Cog, ListPlus } from 'lucide-react';
import { toast } from 'sonner';

interface ComponentsListProps {
  bikeId?: string;
}

export function ComponentsList({ bikeId }: ComponentsListProps) {
  const t = useTranslations();
  const { data: components, isLoading } = useComponents(bikeId);
  const deleteComponent = useDeleteComponent();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [swapComponent, setSwapComponent] = useState<{
    id: string;
    bikeId: string;
    name: string;
  } | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteComponent.mutateAsync(deleteId);
      toast.success(t('common.delete'));
      setDeleteId(null);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {!bikeId && <PageHeader title={t('components.title')} />}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg border bg-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!bikeId && <PageHeader title={t('components.title')} />}
      {bikeId && (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => setBulkOpen(true)}>
            <ListPlus className="mr-2 h-4 w-4" />
            {t('components.bulkAdd.fromCatalog')}
          </Button>
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('components.addComponent')}
          </Button>
        </div>
      )}

      {!components?.length ? (
        <EmptyState
          title={t('components.noComponents')}
          icon={<Cog className="h-16 w-16" strokeWidth={1} />}
          action={
            bikeId ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setBulkOpen(true)}>
                  <ListPlus className="mr-2 h-4 w-4" />
                  {t('components.bulkAdd.fromCatalog')}
                </Button>
                <Button size="sm" onClick={() => setFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('components.addComponent')}
                </Button>
              </div>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {components.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              onDelete={(id) => setDeleteId(id)}
              onSwap={(id, bikeId, name) =>
                setSwapComponent({ id, bikeId, name })
              }
            />
          ))}
        </div>
      )}

      {bikeId && (
        <>
          <ComponentFormDialog
            open={formOpen}
            onOpenChange={setFormOpen}
            bikeId={bikeId}
          />
          <BulkAddDialog
            open={bulkOpen}
            onOpenChange={setBulkOpen}
            bikeId={bikeId}
          />
        </>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t('components.deleteComponent')}
        description={t('components.deleteConfirm')}
        onConfirm={handleDelete}
        loading={deleteComponent.isPending}
      />

      {swapComponent && (
        <SwapDialog
          open={!!swapComponent}
          onOpenChange={(open) => !open && setSwapComponent(null)}
          componentId={swapComponent.id}
          fromBikeId={swapComponent.bikeId}
          componentName={swapComponent.name}
        />
      )}
    </div>
  );
}
