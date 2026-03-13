'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import {
  useStravaConnection,
  useDisconnectStrava,
  useSyncStrava,
  useStravaGear,
  useMapStravaGear,
  useImportStravaBike,
} from '@/hooks/use-strava';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Download,
  Unplug,
  ExternalLink,
  RefreshCw,
  Bike,
  Link2,
  Check,
  ArrowRight,
  Import,
  Crown,
  Sparkles,
  CreditCard,
  Zap,
} from 'lucide-react';
import { ShopSettings } from './shop-settings';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { StravaBadge } from '@/components/shared/strava-badge';

export function SettingsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return data as any;
    },
  });

  const { data: stravaConnection } = useStravaConnection();
  const disconnectStrava = useDisconnectStrava();
  const syncStrava = useSyncStrava();
  const { data: gearData, isLoading: gearLoading } = useStravaGear(!!stravaConnection);
  const mapGear = useMapStravaGear();
  const importBike = useImportStravaBike();

  const [displayName, setDisplayName] = useState('');
  const [units, setUnits] = useState('metric');
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? '');
      setUnits(profile.units);
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName, units })
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(t('common.save'));
    },
  });

  const { data: webhookStatus } = useQuery({
    queryKey: ['strava-webhook'],
    queryFn: async () => {
      const res = await fetch('/api/strava/subscribe');
      return res.json() as Promise<{ active: boolean }>;
    },
    enabled: !!stravaConnection,
  });

  const registerWebhook = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      const res = await fetch('/api/strava/subscribe', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strava-webhook'] });
      toast.success(t('strava.webhookRegistered'));
    },
    onError: (err: Error) => {
      toast.error(err.message || t('strava.webhookError'));
    },
  });

  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/export');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bikefloor-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t('export.success'));
    } catch {
      toast.error(t('export.error'));
    }
    setExporting(false);
  };

  const handleConnectStrava = () => {
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI;
    if (!clientId || !redirectUri) {
      toast.error('Strava not configured');
      return;
    }
    const scope = 'read,profile:read_all,activity:read_all';
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  };

  const handleSync = async () => {
    try {
      const result = await syncStrava.mutateAsync();
      toast.success(`${result.synced} Aktivitäten synchronisiert`);
    } catch {
      toast.error('Sync fehlgeschlagen');
    }
  };

  const handleMapGear = async (bikeId: string, stravaGearId: string | null) => {
    try {
      await mapGear.mutateAsync({ bikeId, stravaGearId });
      toast.success('Bike verknüpft');
    } catch {
      toast.error('Verknüpfung fehlgeschlagen');
    }
  };

  // Find which local bike is mapped to a strava gear
  const getMappedBikeId = (stravaGearId: string): string | null => {
    if (!gearData?.localBikes) return null;
    const bike = gearData.localBikes.find((b) => b.strava_gear_id === stravaGearId);
    return bike?.id ?? null;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('settings.title')} />
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t('settings.title')} />

      {/* Profile */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.profile')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t('settings.displayName')}</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.units')}</Label>
              <Select value={units} onValueChange={setUnits}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">{t('settings.metric')}</SelectItem>
                  <SelectItem value="imperial">
                    {t('settings.imperial')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => updateProfile.mutate()}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? '...' : t('common.save')}
          </Button>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            {t('settings.plan')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge
                variant={profile?.plan === 'free' ? 'secondary' : 'default'}
                className={
                  profile?.plan === 'pro'
                    ? 'bg-primary text-primary-foreground'
                    : profile?.plan === 'fleet'
                      ? 'bg-amber-600 text-white'
                      : ''
                }
              >
                {profile?.plan === 'pro' && <Crown className="mr-1 h-3 w-3" />}
                {profile?.plan === 'fleet' && <Sparkles className="mr-1 h-3 w-3" />}
                {(profile?.plan ?? 'free').charAt(0).toUpperCase() + (profile?.plan ?? 'free').slice(1)}
              </Badge>
              {profile?.is_early_bird && (
                <Badge variant="outline" className="border-amber-500 text-amber-600">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Early Bird
                </Badge>
              )}
            </div>
            {profile?.current_period_end && (
              <span className="text-xs text-muted-foreground">
                {t('settings.renewsAt')}{' '}
                {new Date(profile.current_period_end).toLocaleDateString()}
              </span>
            )}
          </div>

          {profile?.plan === 'free' && !profile?.is_early_bird && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBillingInterval('monthly')}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    billingInterval === 'monthly'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('pricing.monthly')}
                </button>
                <button
                  onClick={() => setBillingInterval('yearly')}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    billingInterval === 'yearly'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t('pricing.yearly')}
                </button>
                {billingInterval === 'yearly' && (
                  <Badge variant="outline" className="border-emerald-500 text-emerald-600 text-[10px]">
                    {t('pricing.saveMonths')}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ plan: 'pro', interval: billingInterval }),
                      });
                      const { url } = await res.json();
                      if (url) window.location.href = url;
                    } catch {
                      toast.error(t('settings.upgradeError'));
                    }
                  }}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  {t('settings.upgradePro')} — {billingInterval === 'yearly' ? '€39,90 ' + t('pricing.perYear') : '€3,99 / mo'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ plan: 'fleet', interval: billingInterval }),
                      });
                      const { url } = await res.json();
                      if (url) window.location.href = url;
                    } catch {
                      toast.error(t('settings.upgradeError'));
                    }
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('settings.upgradeFleet')} — {billingInterval === 'yearly' ? '€79,90 ' + t('pricing.perYear') : '€7,99 / mo'}
                </Button>
              </div>
            </div>
          )}

          {profile?.stripe_customer_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const res = await fetch('/api/stripe/portal', { method: 'POST' });
                  const { url } = await res.json();
                  if (url) window.location.href = url;
                } catch {
                  toast.error(t('settings.portalError'));
                }
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('settings.manageSubscription')}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Strava */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t('settings.stravaIntegration')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stravaConnection ? (
            <>
              {/* Connection status + actions */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-[#FC4C02] text-white">Strava</Badge>
                  <span className="text-sm text-muted-foreground">
                    {t('strava.connected')}
                  </span>
                  {stravaConnection.last_sync_at && (
                    <span className="text-xs text-muted-foreground">
                      · {new Date(stravaConnection.last_sync_at).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSync}
                    disabled={syncStrava.isPending}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${syncStrava.isPending ? 'animate-spin' : ''}`} />
                    {syncStrava.isPending ? '...' : 'Sync'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDisconnectOpen(true)}
                    disabled={disconnectStrava.isPending}
                  >
                    <Unplug className="mr-2 h-4 w-4" />
                    {t('strava.disconnect')}
                  </Button>
                </div>
              </div>

              {/* Live-Sync status */}
              <div className="flex items-center gap-3 border-t pt-4">
                {webhookStatus?.active ? (
                  <Badge className="bg-emerald-500/10 text-emerald-700 border-0">
                    <Zap className="mr-1 h-3 w-3" />
                    {t('strava.liveSyncActive')}
                  </Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t('strava.manualSyncOnly')}
                    </span>
                    {profile?.role === 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => registerWebhook.mutate()}
                        disabled={registerWebhook.isPending}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        {registerWebhook.isPending
                          ? '...'
                          : t('strava.registerWebhook')}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Gear mapping */}
              {gearData && gearData.stravaBikes.length > 0 && (
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium">Bike-Zuordnung</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Verknüpfe deine Strava-Bikes mit deinen BikeFloor-Bikes, damit Fahrten automatisch zugeordnet werden.
                  </p>
                  <div className="space-y-2">
                    {gearData.stravaBikes.map((stravaBike) => {
                      const mappedBikeId = getMappedBikeId(stravaBike.id);
                      return (
                        <div
                          key={stravaBike.id}
                          className="rounded-lg border px-3 py-2.5 space-y-2"
                        >
                          {/* Strava bike info */}
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FC4C02]/10 shrink-0">
                              <Bike className="h-4 w-4 text-[#FC4C02]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{stravaBike.name}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {stravaBike.distance_km.toLocaleString()} km auf Strava
                              </p>
                            </div>
                            {mappedBikeId && (
                              <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                            )}
                          </div>

                          {/* Local bike selector */}
                          <div className="flex items-center gap-2">
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <Select
                              value={mappedBikeId ?? '__none__'}
                              onValueChange={(v) => {
                                if (v === '__none__' && mappedBikeId) {
                                  handleMapGear(mappedBikeId, null);
                                } else if (v !== '__none__') {
                                  handleMapGear(v, stravaBike.id);
                                }
                              }}
                            >
                              <SelectTrigger className="h-9 flex-1">
                                <SelectValue placeholder="Nicht verknüpft" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">
                                  Nicht verknüpft
                                </SelectItem>
                                {gearData.localBikes.map((localBike) => (
                                  <SelectItem key={localBike.id} value={localBike.id}>
                                    {localBike.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {/* Import button if not yet mapped */}
                            {!mappedBikeId && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0 h-9 text-xs gap-1.5 text-[#FC4C02] border-[#FC4C02]/30 hover:bg-[#FC4C02]/10"
                                disabled={importBike.isPending}
                                onClick={async () => {
                                  try {
                                    await importBike.mutateAsync(stravaBike);
                                    toast.success(`"${stravaBike.name}" importiert (${stravaBike.distance_km.toLocaleString()} km)`);
                                  } catch {
                                    toast.error('Import fehlgeschlagen');
                                  }
                                }}
                              >
                                <Import className="h-3.5 w-3.5" />
                                Import
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {gearData && gearData.stravaBikes.length === 0 && (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground">
                    Keine Bikes in deinem Strava-Profil gefunden. Füge Bikes in Strava unter &quot;Meine Ausrüstung&quot; hinzu.
                  </p>
                </div>
              )}

              {gearLoading && (
                <div className="border-t pt-4">
                  <div className="h-16 animate-pulse rounded-lg bg-muted" />
                </div>
              )}
              {/* Powered by Strava badge */}
              <div className="border-t pt-4">
                <StravaBadge />
              </div>

              <ConfirmDialog
                open={disconnectOpen}
                onOpenChange={setDisconnectOpen}
                title={t('strava.disconnectTitle')}
                description={t('strava.disconnectConfirm')}
                onConfirm={() => {
                  disconnectStrava.mutate(undefined, {
                    onSuccess: () => setDisconnectOpen(false),
                  });
                }}
                loading={disconnectStrava.isPending}
              />
            </>
          ) : (
            <Button onClick={handleConnectStrava} className="bg-[#FC4C02] hover:bg-[#e04400]">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('strava.connect')}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Shops */}
      <ShopSettings />

      {/* Export */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('settings.dataExport')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('settings.exportDescription')}
          </p>
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            <Download className="mr-2 h-4 w-4" />
            {exporting ? t('export.generating') : t('settings.exportButton')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
