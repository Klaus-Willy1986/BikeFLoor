'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useComponents, useDeleteComponent } from '@/hooks/use-components';
import { useMoveToInventory } from '@/hooks/use-inventory';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ComponentCard } from './component-card';
import { ComponentFormDialog } from './component-form-dialog';
import { ComponentDetailDialog } from './component-detail-dialog';
import { RotationGroup } from './rotation-group';
import { SwapDialog } from './swap-dialog';
import { InstallFromInventoryDialog } from './install-from-inventory-dialog';
import { Button } from '@/components/ui/button';
import { BulkAddDialog } from './bulk-add-dialog';
import { Plus, Cog, ListPlus, Package } from 'lucide-react';
import { toast } from 'sonner';

interface ComponentsListProps {
  bikeId?: string;
}

export function ComponentsList({ bikeId }: ComponentsListProps) {
  const t = useTranslations();
  const { data: components, isLoading } = useComponents(bikeId);
  const deleteComponent = useDeleteComponent();
  const moveToInventory = useMoveToInventory();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [moveToInvComponent, setMoveToInvComponent] = useState<any>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<any>(null);
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

  const handleMoveToInventory = async () => {
    if (!moveToInvComponent) return;
    try {
      await moveToInventory.mutateAsync({
        id: moveToInvComponent.id,
        bike_id: moveToInvComponent.bike_id,
        name: moveToInvComponent.name,
        brand: moveToInvComponent.brand,
        model: moveToInvComponent.model,
        category_id: moveToInvComponent.category_id,
      });
      toast.success(t('lager.movedToInventory'));
      setMoveToInvComponent(null);
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
          <Button size="sm" variant="outline" onClick={() => setInventoryOpen(true)}>
            <Package className="mr-2 h-4 w-4" />
            {t('lager.fromInventory')}
          </Button>
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
        <ComponentGrid
          components={components}
          bikeId={bikeId}
          onComponentClick={(c) => setSelectedComponent(c)}
          onDelete={(id) => setDeleteId(id)}
          onSwap={(id, bikeId, name) => setSwapComponent({ id, bikeId, name })}
          onMoveToInventory={(c) => setMoveToInvComponent(c)}
        />
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
          <InstallFromInventoryDialog
            open={inventoryOpen}
            onOpenChange={setInventoryOpen}
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

      <ConfirmDialog
        open={!!moveToInvComponent}
        onOpenChange={(open) => !open && setMoveToInvComponent(null)}
        title={t('lager.moveToInventoryTitle')}
        description={t('lager.moveToInventoryConfirm')}
        onConfirm={handleMoveToInventory}
        loading={moveToInventory.isPending}
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

      <ComponentDetailDialog
        open={!!selectedComponent}
        onOpenChange={(open) => !open && setSelectedComponent(null)}
        component={selectedComponent}
      />
    </div>
  );
}

/** Groups components by category; categories with >1 component render as RotationGroup */
function ComponentGrid({
  components,
  bikeId,
  onComponentClick,
  onDelete,
  onSwap,
  onMoveToInventory,
}: {
  components: any[];
  bikeId?: string;
  onComponentClick: (c: any) => void;
  onDelete: (id: string) => void;
  onSwap: (id: string, bikeId: string, name: string) => void;
  onMoveToInventory: (component: any) => void;
}) {
  // Group by category_id
  const { rotationGroups, singles } = useMemo(() => {
    const byCategory = new Map<string | null, any[]>();
    for (const comp of components) {
      const catId = comp.category_id ?? null;
      if (!byCategory.has(catId)) byCategory.set(catId, []);
      byCategory.get(catId)!.push(comp);
    }

    const rotationGroups: { categoryKey: string; categoryId: string; components: any[] }[] = [];
    const singles: any[] = [];

    for (const [catId, comps] of byCategory) {
      const mounted = comps.filter((c) => c.rotation_status === 'mounted');
      const pool = comps.filter((c) => c.rotation_status === 'ready' || c.rotation_status === 'needs_maintenance');

      // Only show as rotation group when there's a mounted component AND pool components
      if (catId && mounted.length > 0 && pool.length > 0) {
        const categoryKey = comps[0].component_categories?.key ?? 'other';
        rotationGroups.push({ categoryKey, categoryId: catId, components: comps });
      } else {
        // Show mounted/active components as regular cards
        singles.push(...comps.filter((c) => c.rotation_status === 'mounted' || c.is_active));
      }
    }

    return { rotationGroups, singles };
  }, [components]);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {/* Rotation groups span full width */}
      {rotationGroups.map((group) => (
        <RotationGroup
          key={group.categoryId}
          categoryKey={group.categoryKey}
          components={group.components}
          bikeId={bikeId ?? group.components[0]?.bike_id}
          onComponentClick={onComponentClick}
          onDelete={onDelete}
          onSwap={onSwap}
          onMoveToInventory={onMoveToInventory}
        />
      ))}

      {/* Single components */}
      {singles.map((component) => (
        <ComponentCard
          key={component.id}
          component={component}
          onDelete={onDelete}
          onSwap={(id, bikeId, name) => onSwap(id, bikeId, name)}
          onMoveToInventory={onMoveToInventory}
          onClick={() => onComponentClick(component)}
        />
      ))}
    </div>
  );
}
