'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users,
  CreditCard,
  Sparkles,
  Crown,
  ExternalLink,
  Shield,
  MessageSquare,
  Trash2,
  Bike,
  Wrench,
  Route,
  BarChart3,
  Package,
  FileText,
  Link2,
  Merge,
} from 'lucide-react';

type AdminBike = {
  name: string;
  type: string;
};

type AdminUser = {
  id: string;
  display_name: string | null;
  plan: string;
  role: string;
  subscription_status: string;
  is_early_bird: boolean;
  stripe_customer_id: string | null;
  created_at: string;
  bikes: AdminBike[];
};

type FeedbackItem = {
  id: string;
  user_id: string;
  page: string | null;
  message: string;
  created_at: string;
  user_name: string | null;
};

type BrandGroup = {
  key: string;
  variants: { name: string; count: number }[];
  total: number;
};

type UsageStats = {
  bikes: { total: number; byType: Record<string, number>; totalDistanceKm: number };
  components: { total: number; active: number };
  rides: { total: number; totalDistanceKm: number; bySource: Record<string, number> };
  services: { total: number; totalCost: number };
  strava: { connections: number };
  documents: { total: number };
  inventory: { total: number };
};

const BIKE_TYPE_LABELS: Record<string, string> = {
  road: 'Rennrad',
  mtb: 'MTB',
  gravel: 'Gravel',
  city: 'City',
  tt: 'TT/Tri',
  ebike: 'E-Bike',
  other: 'Sonstige',
};

export function AdminDashboard() {
  const t = useTranslations('admin');
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, display_name, plan, role, subscription_status, is_early_bird, stripe_customer_id, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch bikes per user — needs admin/service role to see all
      // Using regular client here; admin can only see own bikes via RLS
      // The admin API route should be used for cross-user data
      const { data: bikes } = await fetch('/api/admin/bikes')
        .then(r => r.ok ? r.json() : [])
        .catch(() => []);

      const userBikes: Record<string, AdminBike[]> = {};
      if (bikes) {
        for (const bike of bikes) {
          if (!userBikes[bike.user_id]) userBikes[bike.user_id] = [];
          userBikes[bike.user_id].push({ name: bike.name, type: bike.type });
        }
      }

      return (profiles ?? []).map((p) => ({
        ...p,
        bikes: userBikes[p.id] || [],
      })) as AdminUser[];
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Record<string, unknown>;
    }) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(t('userUpdated'));
    },
    onError: () => {
      toast.error(t('updateError'));
    },
  });

  const { data: feedback } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: async () => {
      const { data: items, error } = await (supabase as any)
        .from('feedback')
        .select('id, user_id, page, message, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map user_id → display_name from already-loaded users
      const userMap = new Map<string, string>();
      if (users) {
        for (const u of users) {
          userMap.set(u.id, u.display_name || u.id.slice(0, 8));
        }
      }

      return (items ?? []).map((item: any) => ({
        ...item,
        user_name: userMap.get(item.user_id) || item.user_id.slice(0, 8),
      })) as FeedbackItem[];
    },
    enabled: !!users,
  });

  const deleteFeedback = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('feedback')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
    },
  });

  const { data: usageStats } = useQuery<UsageStats | null>({
    queryKey: ['admin-usage-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) return null;
      return res.json();
    },
  });

  // Brand merge
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [canonicalName, setCanonicalName] = useState('');

  const { data: brandGroups } = useQuery<BrandGroup[]>({
    queryKey: ['admin-brand-groups'],
    queryFn: async () => {
      const res = await fetch('/api/admin/merge-brands');
      if (!res.ok) return [];
      return res.json();
    },
  });

  const mergeBrands = useMutation({
    mutationFn: async ({ variants, canonical }: { variants: string[]; canonical: string }) => {
      const res = await fetch('/api/admin/merge-brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variants, canonical }),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-brand-groups'] });
      setSelectedBrands(new Set());
      setCanonicalName('');
      toast.success(`${data.updated} ${t('brandMerge.componentsUpdated')}`);
    },
    onError: () => {
      toast.error(t('updateError'));
    },
  });

  const handleToggleBrand = (name: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleMerge = () => {
    if (selectedBrands.size < 2 || !canonicalName.trim()) return;
    mergeBrands.mutate({
      variants: Array.from(selectedBrands),
      canonical: canonicalName.trim(),
    });
  };

  const stats = users
    ? {
        total: users.length,
        pro: users.filter((u) => u.plan === 'pro').length,
        fleet: users.filter((u) => u.plan === 'fleet').length,
        earlyBirds: users.filter((u) => u.is_early_bird).length,
      }
    : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t('title')} />
        <div className="h-48 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        action={
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Stripe Dashboard
            </a>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.total ?? 0}</p>
                <p className="text-xs text-muted-foreground">{t('totalUsers')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.pro ?? 0}</p>
                <p className="text-xs text-muted-foreground">Pro</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.fleet ?? 0}</p>
                <p className="text-xs text-muted-foreground">Fleet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.earlyBirds ?? 0}</p>
                <p className="text-xs text-muted-foreground">Early Birds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Anonymous Usage Stats */}
      {usageStats && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Nutzungsstatistik (anonym)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Bikes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Bike className="h-4 w-4 text-primary" />
                  {usageStats.bikes.total} Fahrräder
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(usageStats.bikes.byType).map(([type, count]) => (
                    <Badge key={type} variant="secondary" className="text-[10px]">
                      {BIKE_TYPE_LABELS[type] || type} {count}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {usageStats.bikes.totalDistanceKm.toLocaleString()} km gesamt
                </p>
              </div>

              {/* Components */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wrench className="h-4 w-4 text-primary" />
                  {usageStats.components.total} Komponenten
                </div>
                <p className="text-xs text-muted-foreground">
                  {usageStats.components.active} aktiv montiert
                </p>
              </div>

              {/* Rides */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Route className="h-4 w-4 text-primary" />
                  {usageStats.rides.total} Fahrten
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(usageStats.rides.bySource).map(([source, count]) => (
                    <Badge key={source} variant="secondary" className="text-[10px]">
                      {source === 'strava' ? 'Strava' : source === 'gpx' ? 'GPX/FIT' : 'Manuell'} {count}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {usageStats.rides.totalDistanceKm.toLocaleString()} km gefahren
                </p>
              </div>

              {/* Services & more */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Wrench className="h-4 w-4 text-primary" />
                  {usageStats.services.total} Wartungen
                </div>
                {usageStats.services.totalCost > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {usageStats.services.totalCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} Kosten
                  </p>
                )}
                <div className="flex flex-wrap gap-2 pt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Link2 className="h-3 w-3" />
                    {usageStats.strava.connections} Strava
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {usageStats.documents.total} Docs
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {usageStats.inventory.total} Lager
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('userManagement')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('user')}</TableHead>
                <TableHead>{t('plan')}</TableHead>
                <TableHead>{t('bikes')}</TableHead>
                <TableHead>{t('statusLabel')}</TableHead>
                <TableHead>Early Bird</TableHead>
                <TableHead>{t('joined')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.display_name || user.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.plan}
                      onValueChange={(plan) =>
                        updateUser.mutate({ userId: user.id, updates: { plan } })
                      }
                    >
                      <SelectTrigger className="w-[100px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="fleet">Fleet</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      {user.bikes.length > 0 ? (
                        user.bikes.map((bike, i) => (
                          <p key={i} className="text-xs">
                            {bike.name}{' '}
                            <span className="text-muted-foreground">({bike.type})</span>
                          </p>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.subscription_status === 'active'
                          ? 'default'
                          : user.subscription_status === 'past_due'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="text-xs"
                    >
                      {user.subscription_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.is_early_bird}
                      onCheckedChange={(is_early_bird) =>
                        updateUser.mutate({
                          userId: user.id,
                          updates: { is_early_bird },
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t('feedbackTitle')}
            {feedback && feedback.length > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {feedback.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!feedback || feedback.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {t('noFeedback')}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('feedbackUser')}</TableHead>
                  <TableHead>{t('feedbackPage')}</TableHead>
                  <TableHead className="max-w-md">{t('feedbackMessage')}</TableHead>
                  <TableHead>{t('feedbackDate')}</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedback.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-sm">
                      {item.user_name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {item.page || '—'}
                    </TableCell>
                    <TableCell className="text-sm max-w-md">
                      <p className="whitespace-pre-wrap break-words">
                        {item.message}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString()}{' '}
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteFeedback.mutate(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Brand Merge */}
      {brandGroups && brandGroups.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Merge className="h-4 w-4" />
              {t('brandMerge.title')}
              <Badge variant="secondary" className="ml-auto text-xs">
                {brandGroups.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10" />
                  <TableHead>{t('brandMerge.brand')}</TableHead>
                  <TableHead>{t('brandMerge.variants')}</TableHead>
                  <TableHead className="text-right">{t('brandMerge.count')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brandGroups.map((group) => (
                  <TableRow key={group.key}>
                    <TableCell>
                      <Checkbox
                        checked={group.variants.every((v) => selectedBrands.has(v.name))}
                        onCheckedChange={(checked) => {
                          setSelectedBrands((prev) => {
                            const next = new Set(prev);
                            for (const v of group.variants) {
                              if (checked) next.add(v.name);
                              else next.delete(v.name);
                            }
                            return next;
                          });
                          if (checked && !canonicalName) {
                            setCanonicalName(group.variants[0].name);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {group.variants[0].name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {group.variants.map((v) => (
                          <Badge
                            key={v.name}
                            variant={selectedBrands.has(v.name) ? 'default' : 'secondary'}
                            className="text-xs cursor-pointer"
                            onClick={() => handleToggleBrand(v.name)}
                          >
                            {v.name} ({v.count})
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {group.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {selectedBrands.size >= 2 && (
              <div className="flex items-center gap-3 pt-4 border-t mt-4">
                <Input
                  value={canonicalName}
                  onChange={(e) => setCanonicalName(e.target.value)}
                  placeholder={t('brandMerge.canonicalName')}
                  className="max-w-xs"
                />
                <Button
                  size="sm"
                  disabled={!canonicalName.trim() || mergeBrands.isPending}
                  onClick={handleMerge}
                >
                  <Merge className="mr-1.5 h-3.5 w-3.5" />
                  {t('brandMerge.merge')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
