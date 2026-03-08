'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRides, useCreateRide } from '@/hooks/use-rides';
import { useBikes } from '@/hooks/use-bikes';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Route } from 'lucide-react';
import { toast } from 'sonner';

export function RidesList() {
  const t = useTranslations();
  const locale = useLocale();
  const { data: rides, isLoading } = useRides();
  const { data: bikes } = useBikes();
  const createRide = useCreateRide();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    bike_id: '',
    title: '',
    distance_km: '',
    duration_seconds: '',
    elevation_m: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bike_id || !form.distance_km) return;

    try {
      await createRide.mutateAsync({
        bike_id: form.bike_id,
        title: form.title || undefined,
        distance_km: parseFloat(form.distance_km),
        duration_seconds: form.duration_seconds
          ? parseInt(form.duration_seconds) * 60
          : undefined,
        elevation_m: form.elevation_m
          ? parseInt(form.elevation_m)
          : undefined,
        date: form.date,
      });
      toast.success(t('common.save'));
      setFormOpen(false);
      setForm({
        bike_id: '',
        title: '',
        distance_km: '',
        duration_seconds: '',
        elevation_m: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch {
      toast.error(t('auth.errors.generic'));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('rides.title')} />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg border bg-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('rides.title')}
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('rides.addRide')}
          </Button>
        }
      />

      {!rides?.length ? (
        <EmptyState
          title={t('rides.noRides')}
          icon={<Route className="h-16 w-16" strokeWidth={1} />}
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('rides.addRide')}
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {rides.map((ride) => (
            <Card key={ride.id} className="border-border/50">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {ride.title || ride.bikes?.name || 'Ride'}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {ride.source === 'strava'
                        ? t('rides.strava')
                        : t('rides.manual')}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ride.date).toLocaleDateString(
                      locale === 'de' ? 'de-DE' : 'en-US'
                    )}
                    {ride.duration_seconds && (
                      <>
                        {' · '}
                        {Math.floor(ride.duration_seconds / 3600)}h{' '}
                        {Math.floor((ride.duration_seconds % 3600) / 60)}min
                      </>
                    )}
                    {ride.elevation_m && <> · {ride.elevation_m} hm</>}
                  </p>
                </div>
                <span className="text-sm font-mono font-medium">
                  {Number(ride.distance_km).toFixed(1)} km
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rides.addRide')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('rides.bike')} *</Label>
              <Select
                value={form.bike_id}
                onValueChange={(v) => setForm({ ...form, bike_id: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bikes?.map((bike) => (
                    <SelectItem key={bike.id} value={bike.id}>
                      {bike.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Titel</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('rides.distance')} (km) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.distance_km}
                  onChange={(e) =>
                    setForm({ ...form, distance_km: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t('rides.date')}</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('rides.duration')} (min)</Label>
                <Input
                  type="number"
                  value={form.duration_seconds}
                  onChange={(e) =>
                    setForm({ ...form, duration_seconds: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{t('rides.elevation')} (m)</Label>
                <Input
                  type="number"
                  value={form.elevation_m}
                  onChange={(e) =>
                    setForm({ ...form, elevation_m: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={createRide.isPending}>
                {createRide.isPending ? '...' : t('common.save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
