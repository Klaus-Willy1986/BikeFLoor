'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Check, PenLine } from 'lucide-react';
import { Combobox } from '@/components/shared/combobox';
import { useComponentSuggestions } from '@/hooks/use-component-suggestions';
import {
  getGroupsetBrands,
  getGroupsetsByBrand,
  getWheelBrands,
  getWheelsByBrand,
  getTireBrands,
  getTiresByBrand,
} from '@/lib/component-presets';

type Category = 'groupset' | 'wheels' | 'tires';
type SubStep = 'brand' | 'model' | 'custom';

export interface CustomPresetEntry {
  category: Category;
  brand: string;
  model: string;
}

interface PresetPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bikeType: string;
  onComplete: (
    groupsetId: string | null,
    wheelId: string | null,
    tireId: string | null,
    customEntries?: CustomPresetEntry[],
  ) => void;
  initialGroupset: string | null;
  initialWheels: string | null;
  initialTires: string | null;
}

const CATEGORIES: Category[] = ['groupset', 'wheels', 'tires'];

export function PresetPickerDialog({
  open,
  onOpenChange,
  bikeType,
  onComplete,
  initialGroupset,
  initialWheels,
  initialTires,
}: PresetPickerDialogProps) {
  const t = useTranslations('presets');
  const tc = useTranslations('common');

  const [category, setCategory] = useState<Category>('groupset');
  const [subStep, setSubStep] = useState<SubStep>('brand');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Temporary selections
  const [groupsetId, setGroupsetId] = useState<string | null>(initialGroupset);
  const [wheelId, setWheelId] = useState<string | null>(initialWheels);
  const [tireId, setTireId] = useState<string | null>(initialTires);

  // Custom entry state
  const [customBrand, setCustomBrand] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [customEntries, setCustomEntries] = useState<CustomPresetEntry[]>([]);

  const stepIndex = CATEGORIES.indexOf(category) + 1;
  const totalSteps = CATEGORIES.length;

  // Suggestions for custom entry mode
  const { data: brandSuggestions = [] } = useComponentSuggestions({
    enabled: open && subStep === 'custom',
  });
  const { data: modelSuggestions = [] } = useComponentSuggestions({
    brand: customBrand,
    enabled: open && subStep === 'custom' && !!customBrand,
  });

  // Reset state when dialog opens
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      setCategory('groupset');
      setSubStep('brand');
      setSelectedBrand(null);
      setGroupsetId(initialGroupset);
      setWheelId(initialWheels);
      setTireId(initialTires);
      setCustomBrand('');
      setCustomModel('');
      setCustomEntries([]);
    }
    onOpenChange(nextOpen);
  }, [onOpenChange, initialGroupset, initialWheels, initialTires]);

  const brands = useMemo(() => {
    if (category === 'groupset') return getGroupsetBrands(bikeType);
    if (category === 'wheels') return getWheelBrands(bikeType);
    return getTireBrands(bikeType);
  }, [category, bikeType]);

  const models = useMemo(() => {
    if (!selectedBrand) return [];
    if (category === 'groupset') return getGroupsetsByBrand(bikeType, selectedBrand);
    if (category === 'wheels') return getWheelsByBrand(bikeType, selectedBrand);
    return getTiresByBrand(bikeType, selectedBrand);
  }, [category, bikeType, selectedBrand]);

  const advanceToNext = useCallback(() => {
    const idx = CATEGORIES.indexOf(category);
    if (idx < CATEGORIES.length - 1) {
      setCategory(CATEGORIES[idx + 1]);
      setSubStep('brand');
      setSelectedBrand(null);
      setCustomBrand('');
      setCustomModel('');
    } else {
      // Done — fire callback and close
      onComplete(groupsetId, wheelId, tireId, customEntries.length > 0 ? customEntries : undefined);
      onOpenChange(false);
    }
  }, [category, groupsetId, wheelId, tireId, customEntries, onComplete, onOpenChange]);

  const selectModel = useCallback((id: string) => {
    if (category === 'groupset') setGroupsetId(id);
    else if (category === 'wheels') setWheelId(id);
    else setTireId(id);
    advanceToNext();
  }, [category, advanceToNext]);

  const selectBrand = useCallback((brand: string) => {
    setSelectedBrand(brand);
    setSubStep('model');
  }, []);

  const goBackToBrands = useCallback(() => {
    setSelectedBrand(null);
    setSubStep('brand');
  }, []);

  const enterCustomMode = useCallback(() => {
    setCustomBrand('');
    setCustomModel('');
    setSubStep('custom');
  }, []);

  const confirmCustomEntry = useCallback(() => {
    const brand = customBrand.trim().replace(/\s+/g, ' ');
    const model = customModel.trim().replace(/\s+/g, ' ');
    if (brand) {
      setCustomEntries((prev) => [...prev, { category, brand, model }]);
    }
    advanceToNext();
  }, [customBrand, customModel, category, advanceToNext]);

  const skip = useCallback(() => {
    if (subStep === 'model') {
      // Skip from model sub-step → clear brand, advance
      setSelectedBrand(null);
    }
    // Clear current category selection
    if (category === 'groupset') setGroupsetId(null);
    else if (category === 'wheels') setWheelId(null);
    else setTireId(null);
    advanceToNext();
  }, [subStep, category, advanceToNext]);

  const categoryLabel = t(category);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <span className="text-muted-foreground text-sm font-normal">
              {t('step', { current: stepIndex, total: totalSteps })}
            </span>
            <span className="text-muted-foreground">·</span>
            {categoryLabel}
          </DialogTitle>
        </DialogHeader>

        {subStep === 'brand' ? (
          <>
            <p className="text-sm text-muted-foreground">{t('pickBrand')}</p>
            {brands.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => selectBrand(brand)}
                    className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    {brand}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={enterCustomMode}
                  className="rounded-lg border border-dashed px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground hover:bg-primary/5 flex items-center gap-1.5"
                >
                  <PenLine className="h-3.5 w-3.5" />
                  {t('customEntry')}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <p className="w-full text-sm text-muted-foreground italic">
                  {t('none')}
                </p>
                <button
                  type="button"
                  onClick={enterCustomMode}
                  className="rounded-lg border border-dashed px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground hover:bg-primary/5 flex items-center gap-1.5"
                >
                  <PenLine className="h-3.5 w-3.5" />
                  {t('customEntry')}
                </button>
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
                onClick={skip}
              >
                {t('skip')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : subStep === 'custom' ? (
          <>
            <p className="text-sm text-muted-foreground">{t('customEntry')}</p>
            <div className="space-y-3">
              <Combobox
                value={customBrand}
                onChange={setCustomBrand}
                suggestions={brandSuggestions}
                placeholder={t('pickBrand')}
              />
              <Combobox
                value={customModel}
                onChange={setCustomModel}
                suggestions={modelSuggestions}
                placeholder="Model"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
                onClick={goBackToBrands}
              >
                <ArrowLeft className="h-4 w-4" />
                {t('back')}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!customBrand.trim()}
                onClick={confirmCustomEntry}
              >
                <Check className="mr-1 h-4 w-4" />
                {tc('confirm')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {selectedBrand}
            </p>
            <div className="max-h-[280px] space-y-1 overflow-y-auto">
              {models.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => selectModel(m.id)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
                >
                  <Check className="h-3.5 w-3.5 shrink-0 opacity-0" />
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
                onClick={goBackToBrands}
              >
                <ArrowLeft className="h-4 w-4" />
                {t('back')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
                onClick={skip}
              >
                {t('skip')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
