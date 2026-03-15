'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useBike } from '@/hooks/use-bikes';
import { useCreateBulkComponents } from '@/hooks/use-components';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import {
  DEFAULT_COMPONENTS,
  type CatalogComponent,
  type ComponentTemplate,
} from '@/lib/bike-catalog';

interface BulkAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bikeId: string;
}

interface SelectableComponent {
  id: string;
  category_key: string;
  name: string;
  brand?: string;
  model?: string;
  max_distance_km?: number;
}

export function BulkAddDialog({ open, onOpenChange, bikeId }: BulkAddDialogProps) {
  const t = useTranslations();
  const { data: bike } = useBike(bikeId);
  const bulkCreate = useCreateBulkComponents(bikeId);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  // Look up bike template from DB, fall back to defaults
  const [templateComponents, setTemplateComponents] = useState<CatalogComponent[] | null>(null);
  const [templateLoaded, setTemplateLoaded] = useState(false);

  useEffect(() => {
    if (!bike || !open) return;
    setTemplateLoaded(false);
    setTemplateComponents(null);

    const supabase = createClient();
    supabase
      .from('bike_templates')
      .select('components')
      .ilike('manufacturer', bike.manufacturer ?? '')
      .ilike('model', bike.model ?? '')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.components && Array.isArray(data.components) && data.components.length > 0) {
          setTemplateComponents(data.components as unknown as CatalogComponent[]);
        }
        setTemplateLoaded(true);
      });
  }, [bike, open]);

  const { components, source } = useMemo(() => {
    if (!bike) return { components: [] as SelectableComponent[], source: 'none' as const };

    if (templateComponents?.length) {
      const items: SelectableComponent[] = templateComponents.map((c: CatalogComponent, i: number) => ({
        id: `catalog-${i}`,
        category_key: c.category_key,
        name: c.name,
        brand: c.brand,
        model: c.model,
        max_distance_km: c.max_distance_km,
      }));
      return { components: items, source: 'catalog' as const };
    }

    // Fall back to defaults by bike type
    const defaults = DEFAULT_COMPONENTS[bike.type] ?? DEFAULT_COMPONENTS.other;
    const items: SelectableComponent[] = defaults.map((c: ComponentTemplate, i: number) => ({
      id: `default-${i}`,
      category_key: c.category_key,
      name: c.name,
      max_distance_km: c.max_distance_km,
    }));
    return { components: items, source: 'defaults' as const };
  }, [bike, templateComponents]);

  // Initialize with nothing selected when components first load
  if (components.length > 0 && !initialized) {
    setInitialized(true);
  }

  // Reset when dialog closes
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setInitialized(false);
      setSelected(new Set());
    }
    onOpenChange(nextOpen);
  };

  const toggleComponent = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === components.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(components.map((c) => c.id)));
    }
  };

  const handleSubmit = async () => {
    const toCreate = components
      .filter((c) => selected.has(c.id))
      .map((c) => ({
        name: c.name,
        category_key: c.category_key,
        max_distance_km: c.max_distance_km,
        brand: c.brand,
        model: c.model,
      }));

    if (toCreate.length === 0) return;

    try {
      await bulkCreate.mutateAsync(toCreate);
      toast.success(t('components.bulkAdd.success', { count: toCreate.length }));
      handleOpenChange(false);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('components.bulkAdd.title')}</DialogTitle>
          <DialogDescription>
            {source === 'catalog'
              ? t('components.bulkAdd.catalogMatch', {
                  manufacturer: bike?.manufacturer ?? '',
                  model: bike?.model ?? '',
                })
              : t('components.bulkAdd.defaultsFor', {
                  type: bike ? t(`bikes.types.${bike.type}`) : '',
                })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          {/* Select all toggle */}
          <button
            type="button"
            onClick={toggleAll}
            className="mb-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {selected.size === components.length
              ? t('components.bulkAdd.deselectAll')
              : t('components.bulkAdd.selectAll')}
          </button>

          {/* Component list */}
          <div className="max-h-[360px] space-y-1 overflow-y-auto pr-1">
            {components.map((comp) => (
              <label
                key={comp.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={selected.has(comp.id)}
                  onCheckedChange={() => toggleComponent(comp.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comp.name}</span>
                    {comp.max_distance_km && (
                      <Badge variant="secondary" className="text-[10px]">
                        {comp.max_distance_km.toLocaleString()} km
                      </Badge>
                    )}
                  </div>
                  {(comp.brand || comp.model) && (
                    <p className="text-xs text-muted-foreground">
                      {[comp.brand, comp.model].filter(Boolean).join(' ')}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selected.size === 0 || bulkCreate.isPending}
          >
            {bulkCreate.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Package className="mr-2 h-4 w-4" />
            )}
            {t('components.bulkAdd.create', { count: selected.size })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
