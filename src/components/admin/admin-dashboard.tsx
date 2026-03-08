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
import {
  Users,
  CreditCard,
  Sparkles,
  Crown,
  ExternalLink,
  Shield,
} from 'lucide-react';

type AdminUser = {
  id: string;
  display_name: string | null;
  plan: string;
  role: string;
  subscription_status: string;
  is_early_bird: boolean;
  stripe_customer_id: string | null;
  created_at: string;
  bikes: { count: number }[];
};

export function AdminDashboard() {
  const t = useTranslations('admin');
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('id, display_name, plan, role, subscription_status, is_early_bird, stripe_customer_id, created_at, bikes(count)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AdminUser[];
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
                  <TableCell>{user.bikes?.[0]?.count ?? 0}</TableCell>
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
    </div>
  );
}
