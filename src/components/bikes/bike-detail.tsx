'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useBike, useDeleteBike, useUploadBikePhoto } from '@/hooks/use-bikes';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ComponentsList } from '@/components/components/components-list';
import { ServicesList } from '@/components/services/services-list';
import { SetupForm } from '@/components/setup/setup-form';
import { DocumentsList } from '@/components/documents/documents-list';
import { BikeRides } from '@/components/bikes/bike-rides';
import { useRef } from 'react';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ArrowLeft,
  Gauge,
  Calendar,
  Weight,
  StickyNote,
  Camera,
  Loader2,
  Wrench,
  Mail,
  Phone,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { toast } from 'sonner';
import { useWorkshops } from '@/hooks/use-shops';
import { RepairRequestDialog } from '@/components/shops/repair-request-dialog';
import { resolveBikeImage } from '@/lib/bike-image';
import Image from 'next/image';

const typeColors: Record<string, { bg: string; text: string; accent: string }> = {
  road:   { bg: 'bg-blue-500/10', text: 'text-blue-700', accent: 'from-blue-600' },
  mtb:    { bg: 'bg-amber-500/10', text: 'text-amber-700', accent: 'from-amber-600' },
  gravel: { bg: 'bg-emerald-500/10', text: 'text-emerald-700', accent: 'from-emerald-600' },
  city:   { bg: 'bg-violet-500/10', text: 'text-violet-700', accent: 'from-violet-600' },
  ebike:  { bg: 'bg-cyan-500/10', text: 'text-cyan-700', accent: 'from-cyan-600' },
  other:  { bg: 'bg-gray-500/10', text: 'text-gray-700', accent: 'from-gray-600' },
};

const typeEmojis: Record<string, string> = {
  road: '🏎️', mtb: '⛰️', gravel: '🌄', city: '🏙️', ebike: '⚡', other: '🚲',
};

export function BikeDetail({ bikeId }: { bikeId: string }) {
  const t = useTranslations();
  const router = useRouter();
  const { data: bike, isLoading } = useBike(bikeId);
  const deleteBike = useDeleteBike();
  const uploadPhoto = useUploadBikePhoto(bikeId);
  const { data: shops } = useWorkshops();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [repairOpen, setRepairOpen] = useState(false);

  const bikeImage = useMemo(() => {
    if (!bike) return null;
    return resolveBikeImage(bike);
  }, [bike]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Max. 5 MB');
      return;
    }
    uploadPhoto.mutate(file, {
      onSuccess: () => toast.success('Foto hochgeladen'),
      onError: (err: Error) => toast.error(`Upload fehlgeschlagen: ${err.message}`),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!bike) {
    return <div>{t('common.noResults')}</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteBike.mutateAsync(bikeId);
      toast.success(t('common.delete'));
      router.push('/bikes');
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  const colors = typeColors[bike.type] || typeColors.other;

  return (
    <div className="space-y-6">
      {/* ─── HERO HEADER ─── */}
      <div className="relative overflow-hidden rounded-xl bg-card border">
        {bikeImage ? (
          /* With product image */
          <div className="flex flex-col sm:flex-row">
            <div
              className="relative aspect-[4/3] w-full sm:aspect-auto sm:w-[320px] shrink-0 bg-muted group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image
                src={bikeImage}
                alt={bike.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 320px"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                {uploadPhoto.isPending ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <button
                      onClick={() => router.push('/bikes')}
                      className="mb-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Fahrräder
                    </button>
                    <h1 className="text-2xl font-bold tracking-tight">{bike.name}</h1>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <Badge className={`${colors.bg} ${colors.text} border-0`}>
                        {typeEmojis[bike.type]} {t(`bikes.types.${bike.type}`)}
                      </Badge>
                      {bike.year && (
                        <span className="text-sm text-muted-foreground font-mono">{bike.year}</span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/bikes/${bikeId}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          {t('common.edit')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('common.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold font-mono tabular-nums tracking-tight">
                  {Math.round(Number(bike.total_distance_km)).toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">km</span>
              </div>
            </div>
          </div>
        ) : (
          /* Without product image — gradient header + upload */
          <div className={`bg-gradient-to-br ${colors.accent} to-card`}>
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <button
                    onClick={() => router.push('/bikes')}
                    className="mb-2 flex items-center gap-1 text-xs text-white/60 hover:text-white/90 transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Fahrräder
                  </button>
                  <h1 className="text-2xl font-bold tracking-tight text-white">{bike.name}</h1>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <Badge className="bg-white/15 text-white border-0 backdrop-blur-sm">
                      {typeEmojis[bike.type]} {t(`bikes.types.${bike.type}`)}
                    </Badge>
                    {bike.year && (
                      <span className="text-sm text-white/70 font-mono">{bike.year}</span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-mono tabular-nums tracking-tight text-white">
                      {Math.round(Number(bike.total_distance_km)).toLocaleString()}
                    </span>
                    <span className="text-sm text-white/60">km</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/bikes/${bikeId}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {t('common.edit')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteOpen(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('common.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {/* Photo upload area */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 border-t border-white/10 px-5 py-3 text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
            >
              {uploadPhoto.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
              Foto hinzufügen
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        )}
      </div>

      {/* ─── TABS ─── */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">{t('bikes.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="components">{t('bikes.tabs.components')}</TabsTrigger>
          <TabsTrigger value="services">{t('bikes.tabs.services')}</TabsTrigger>
          <TabsTrigger value="rides">{t('bikes.tabs.rides')}</TabsTrigger>
          <TabsTrigger value="setup">{t('bikes.tabs.setup')}</TabsTrigger>
          <TabsTrigger value="documents">{t('bikes.tabs.documents')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <Gauge className="h-4 w-4 text-blue-600" />
                  </div>
                  {t('bikes.distance')}
                </div>
                <p className="mt-2 text-2xl font-bold font-mono tabular-nums">
                  {Math.round(Number(bike.total_distance_km)).toLocaleString()} km
                </p>
              </CardContent>
            </Card>
            {bike.year && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                      <Calendar className="h-4 w-4 text-amber-600" />
                    </div>
                    {t('bikes.year')}
                  </div>
                  <p className="mt-2 text-2xl font-bold font-mono tabular-nums">{bike.year}</p>
                </CardContent>
              </Card>
            )}
            {bike.weight_kg && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Weight className="h-4 w-4 text-emerald-600" />
                    </div>
                    {t('bikes.weight')}
                  </div>
                  <p className="mt-2 text-2xl font-bold font-mono tabular-nums">{Number(bike.weight_kg)} kg</p>
                </CardContent>
              </Card>
            )}
          </div>
          {bike.notes && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                    <StickyNote className="h-4 w-4 text-violet-600" />
                  </div>
                  {t('bikes.notes')}
                </div>
                <p className="mt-2 text-sm whitespace-pre-wrap">{bike.notes}</p>
              </CardContent>
            </Card>
          )}
          {(() => {
            const shop = bike.shop_id && shops?.find((s: any) => s.id === bike.shop_id);
            if (!shop) return null;
            return (
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                          <Wrench className="h-4 w-4 text-orange-600" />
                        </div>
                        {t('shops.shop')}
                      </div>
                      <p className="mt-2 text-sm font-semibold">{shop.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {shop.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {shop.email}
                          </span>
                        )}
                        {shop.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {shop.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setRepairOpen(true)}
                    >
                      {t('shops.repairRequest.button')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </TabsContent>

        <TabsContent value="components" className="mt-4">
          <ComponentsList bikeId={bikeId} bikeType={bike?.type} />
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <ServicesList bikeId={bikeId} />
        </TabsContent>

        <TabsContent value="rides" className="mt-4">
          <BikeRides bikeId={bikeId} />
        </TabsContent>

        <TabsContent value="setup" className="mt-4">
          <SetupForm bikeId={bikeId} />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <DocumentsList bikeId={bikeId} />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t('bikes.deleteBike')}
        description={t('bikes.deleteConfirm')}
        onConfirm={handleDelete}
        loading={deleteBike.isPending}
      />

      {(() => {
        const shop = bike.shop_id && shops?.find((s: any) => s.id === bike.shop_id);
        if (!shop) return null;
        return (
          <RepairRequestDialog
            open={repairOpen}
            onOpenChange={setRepairOpen}
            bikeId={bikeId}
            shop={shop}
          />
        );
      })()}
    </div>
  );
}
