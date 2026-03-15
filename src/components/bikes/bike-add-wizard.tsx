'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bikeSchema, type BikeFormData } from '@/lib/validators/bike';
import { useCreateBike } from '@/hooks/use-bikes';
import { useCreateBulkComponents } from '@/hooks/use-components';
import { DEFAULT_COMPONENTS, type CatalogBike, type CatalogComponent } from '@/lib/bike-catalog';
import { buildComponentsFromPresets, GROUPSET_PRESETS, WHEEL_PRESETS, TIRE_PRESETS } from '@/lib/component-presets';
import { useBikeTemplateSearch, type BikeTemplateResult } from '@/hooks/use-bike-templates';
import { BIKE_TYPES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Search,
  Bike,
  ArrowLeft,
  Loader2,
  Sparkles,
  X,
  ChevronRight,
  Wrench,
  Check,
  BadgeCheck,
  Users,
} from 'lucide-react';
import Image from 'next/image';

type Step = 'search' | 'form';

const typeIcons: Record<string, string> = {
  road: '🏎️',
  mtb: '⛰️',
  gravel: '🌄',
  city: '🏙️',
  ebike: '⚡',
  other: '🚲',
};

export function BikeAddWizard() {
  const t = useTranslations();
  const router = useRouter();
  const createBike = useCreateBike();

  const [step, setStep] = useState<Step>('search');
  const [query, setQuery] = useState('');
  const { results, isLoading: searchLoading } = useBikeTemplateSearch(query);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [prefilled, setPrefilled] = useState(false);
  const [selectedBikeType, setSelectedBikeType] = useState<string>('road');
  const [catalogComponents, setCatalogComponents] = useState<CatalogComponent[] | null>(null);
  const [catalogImageUrl, setCatalogImageUrl] = useState<string | null>(null);
  const [autoComponents, setAutoComponents] = useState(true);
  const [selectedGroupset, setSelectedGroupset] = useState<string | null>(null);
  const [selectedWheels, setSelectedWheels] = useState<string | null>(null);
  const [selectedTires, setSelectedTires] = useState<string | null>(null);
  const [createdBikeId, setCreatedBikeId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BikeFormData>({
    resolver: zodResolver(bikeSchema),
    defaultValues: { type: 'road' },
  });

  const bulkComponents = useCreateBulkComponents(createdBikeId ?? '');

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  // Auto-focus search input
  useEffect(() => {
    if (step === 'search') {
      inputRef.current?.focus();
    }
  }, [step]);

  const selectBike = useCallback((bike: BikeTemplateResult | CatalogBike) => {
    const name = `${bike.manufacturer} ${bike.model}`;
    reset({
      name,
      manufacturer: bike.manufacturer,
      model: bike.model,
      type: bike.type,
      weight_kg: bike.weight_kg ?? null,
      year: bike.year ?? null,
      notes: null,
    });
    setSelectedBikeType(bike.type);
    setCatalogComponents(bike.components ?? null);
    setCatalogImageUrl(bike.imageUrl ?? null);
    setPrefilled(true);
    setAutoComponents(true);
    setStep('form');
  }, [reset]);

  const skipToForm = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) {
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2) {
        reset({
          name: trimmed,
          manufacturer: parts[0],
          model: parts.slice(1).join(' '),
          type: 'road',
          weight_kg: null,
          year: null,
          notes: null,
        });
      } else {
        reset({ name: trimmed, type: 'road', manufacturer: null, model: null, weight_kg: null, year: null, notes: null });
      }
    }
    setPrefilled(false);
    setAutoComponents(true);
    setStep('form');
  }, [query, reset]);

  // Keyboard nav for results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        selectBike(results[selectedIndex]);
      } else if (query.trim()) {
        skipToForm();
      }
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-result]');
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const currentType = watch('type') || selectedBikeType;
  const hasSpecificParts = !!catalogComponents;

  // Filter presets by current bike type
  const filteredGroupsets = useMemo(
    () => GROUPSET_PRESETS.filter((g) => g.bikeTypes.includes(currentType)),
    [currentType],
  );
  const filteredWheels = useMemo(
    () => WHEEL_PRESETS.filter((w) => w.bikeTypes.includes(currentType)),
    [currentType],
  );
  const filteredTires = useMemo(
    () => TIRE_PRESETS.filter((t) => t.bikeTypes.includes(currentType)),
    [currentType],
  );

  // Reset preset selections when they no longer match the bike type
  useEffect(() => {
    if (selectedGroupset && !filteredGroupsets.some((g) => g.id === selectedGroupset)) {
      setSelectedGroupset(null);
    }
    if (selectedWheels && !filteredWheels.some((w) => w.id === selectedWheels)) {
      setSelectedWheels(null);
    }
    if (selectedTires && !filteredTires.some((t) => t.id === selectedTires)) {
      setSelectedTires(null);
    }
  }, [filteredGroupsets, filteredWheels, filteredTires, selectedGroupset, selectedWheels, selectedTires]);

  // Prefer bike-specific components (from catalog config), fall back to preset-built list
  const componentTemplates = useMemo(
    () => catalogComponents ?? buildComponentsFromPresets(currentType, selectedGroupset, selectedWheels, selectedTires),
    [catalogComponents, currentType, selectedGroupset, selectedWheels, selectedTires],
  );

  const onSubmit = async (data: BikeFormData) => {
    try {
      const newBike = await createBike.mutateAsync(data);

      // Auto-create components if enabled
      if (autoComponents && componentTemplates.length > 0) {
        try {
          setCreatedBikeId(newBike.id);
          // Use direct supabase call since hook needs bikeId at init time
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: categories } = await supabase
              .from('component_categories')
              .select('id, key');
            if (categories) {
              const catMap = new Map(categories.map((c) => [c.key, c.id]));
              const today = new Date().toISOString().split('T')[0];
              const inserts = componentTemplates.map((comp) => ({
                bike_id: newBike.id,
                user_id: user.id,
                category_id: catMap.get(comp.category_key) ?? null,
                name: comp.name,
                brand: ('brand' in comp ? String(comp.brand) : null) ?? null,
                model: ('model' in comp ? String(comp.model) : null) ?? null,
                max_distance_km: comp.max_distance_km ?? null,
                distance_at_install_km: 0,
                installed_at: today,
              }));
              const { data: created } = await supabase
                .from('components')
                .insert(inserts)
                .select();
              if (created) {
                await supabase.from('component_history').insert(
                  created.map((c) => ({
                    component_id: c.id,
                    to_bike_id: newBike.id,
                    action: 'installed',
                    distance_at_action_km: 0,
                  }))
                );
              }
            }
          }
          toast.success(`Rad + ${componentTemplates.length} Komponenten angelegt`);
        } catch {
          // Components failed but bike was created — still navigate
          toast.success('Rad angelegt (Komponenten konnten nicht erstellt werden)');
        }
      } else {
        toast.success(t('common.save'));
      }

      router.push(`/bikes/${newBike.id}`);
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  // ─── STEP 1: SEARCH ─────────────────────
  if (step === 'search') {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.cancel')}
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{t('bikes.addBike')}</h1>
          <p className="text-sm text-muted-foreground">
            Gib dein Rad ein — wir füllen die Details automatisch aus.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='z.B. "Canyon Aeroad", "Basso Palta III"...'
            className="h-12 pl-10 pr-4 text-[15px]"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <Card>
            <div ref={listRef} className="max-h-[400px] overflow-y-auto py-1">
              {results.map((bike, i) => (
                <button
                  key={`${bike.manufacturer}-${bike.model}-${bike.year ?? ''}`}
                  data-result
                  onClick={() => selectBike(bike)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                    i === selectedIndex
                      ? 'bg-accent'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  {bike.imageUrl ? (
                    <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-muted">
                      <Image
                        src={bike.imageUrl}
                        alt={`${bike.manufacturer} ${bike.model}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <span className="text-lg leading-none">{typeIcons[bike.type]}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold">{bike.manufacturer}</span>
                      <span className="text-[13px] text-muted-foreground">{bike.model}</span>
                      {bike.is_verified && (
                        <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{t(`bikes.types.${bike.type}`)}</span>
                      {bike.year && (
                        <>
                          <span className="text-border">·</span>
                          <span className="font-mono tabular-nums">{bike.year}</span>
                        </>
                      )}
                      {bike.weight_kg && (
                        <>
                          <span className="text-border">·</span>
                          <span className="font-mono tabular-nums">~{bike.weight_kg} kg</span>
                        </>
                      )}
                      {bike.contributor_count > 1 && (
                        <>
                          <span className="text-border">·</span>
                          <span className="flex items-center gap-0.5">
                            <Users className="h-3 w-3" />
                            {t('bikeTemplates.communityCount', { count: bike.contributor_count })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* No results, but query entered */}
        {query.length >= 2 && results.length === 0 && !searchLoading && (
          <Card>
            <CardContent className="py-8 text-center">
              <Bike className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">
                Kein Treffer — macht nichts!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Skip / manual entry */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={skipToForm}
          >
            {query.trim() ? 'Manuell weiter' : 'Ohne Vorlage starten'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ─── STEP 2: FORM (pre-filled or empty) ───
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={() => {
            setStep('search');
            setPrefilled(false);
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Suche
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{t('bikes.addBike')}</h1>
          {prefilled && (
            <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary">
              <Sparkles className="h-3 w-3" />
              Vorausgefüllt
            </Badge>
          )}
        </div>
      </div>

      {/* Product image hero */}
      {catalogImageUrl && (
        <Card className="overflow-hidden">
          <div className="relative aspect-[16/9] w-full bg-muted">
            <Image
              src={catalogImageUrl}
              alt={watch('name') || 'Bike'}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 576px"
              priority
            />
          </div>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('bikes.name')} *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="z.B. Mein Canyon Aeroad"
                className="h-11"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Type + Year */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('bikes.type')}</Label>
                <Select
                  value={watch('type')}
                  onValueChange={(v) => setValue('type', v as BikeFormData['type'])}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BIKE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="mr-2">{typeIcons[type]}</span>
                        {t(`bikes.types.${type}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">{t('bikes.year')}</Label>
                <Input
                  id="year"
                  type="number"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  {...register('year', { valueAsNumber: true })}
                  placeholder={new Date().getFullYear().toString()}
                  className="h-11"
                />
              </div>
            </div>

            {/* Manufacturer + Model */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">{t('bikes.manufacturer')}</Label>
                <Input
                  id="manufacturer"
                  {...register('manufacturer')}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">{t('bikes.model')}</Label>
                <Input
                  id="model"
                  {...register('model')}
                  className="h-11"
                />
              </div>
            </div>

            {/* Weight */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weight_kg">{t('bikes.weight')} (kg)</Label>
                <Input
                  id="weight_kg"
                  type="number"
                  step="0.1"
                  min={0}
                  max={50}
                  {...register('weight_kg', { valueAsNumber: true })}
                  className="h-11"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t('bikes.notes')}</Label>
              <Textarea id="notes" {...register('notes')} rows={3} />
            </div>

            {/* Auto-components toggle */}
            <div className="rounded-lg border p-4 space-y-3">
              <button
                type="button"
                onClick={() => setAutoComponents(!autoComponents)}
                className="flex w-full items-start gap-3 text-left"
              >
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                  autoComponents
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30'
                }`}>
                  {autoComponents && <Check className="h-3.5 w-3.5" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {hasSpecificParts ? 'Originalteile anlegen' : 'Standardkomponenten anlegen'}
                    </span>
                    {hasSpecificParts && (
                      <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                        <Sparkles className="h-2.5 w-2.5" />
                        aus Config
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
              {/* Preset selectors — only when no catalog match */}
              {!hasSpecificParts && autoComponents && (
                <div className="ml-8 grid gap-2 sm:grid-cols-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">{t('presets.groupset')}</span>
                    <Select
                      value={selectedGroupset ?? '_none'}
                      onValueChange={(v) => setSelectedGroupset(v === '_none' ? null : v)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">{t('presets.none')}</SelectItem>
                        {filteredGroupsets.map((g) => (
                          <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">{t('presets.wheels')}</span>
                    <Select
                      value={selectedWheels ?? '_none'}
                      onValueChange={(v) => setSelectedWheels(v === '_none' ? null : v)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">{t('presets.none')}</SelectItem>
                        {filteredWheels.map((w) => (
                          <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">{t('presets.tires')}</span>
                    <Select
                      value={selectedTires ?? '_none'}
                      onValueChange={(v) => setSelectedTires(v === '_none' ? null : v)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none">{t('presets.none')}</SelectItem>
                        {filteredTires.map((ti) => (
                          <SelectItem key={ti.id} value={ti.id}>{ti.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {autoComponents && (
                <div className="ml-8 flex flex-wrap gap-1.5">
                  {componentTemplates.map((c) => (
                    <span
                      key={c.category_key}
                      className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {c.name}
                      {'brand' in c && (c as any).brand && (
                        <span className="font-medium text-foreground">{String((c as any).brand)}</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="h-11 gap-2 px-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Bike className="h-4 w-4" />
                    {t('common.save')}
                    {autoComponents && (
                      <span className="text-xs opacity-70">+ {componentTemplates.length} Teile</span>
                    )}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={() => router.back()}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
