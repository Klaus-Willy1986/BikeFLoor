'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bikeSetupSchema, type BikeSetupFormData } from '@/lib/validators/setup';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { SUSPENSION_BIKE_TYPES } from '@/lib/constants';
import { toast } from 'sonner';

export function SetupForm({ bikeId }: { bikeId: string }) {
  const t = useTranslations('setup');
  const tc = useTranslations('common');
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: bike } = useQuery({
    queryKey: ['bikes', bikeId],
    queryFn: async () => {
      const { data } = await supabase
        .from('bikes')
        .select('type')
        .eq('id', bikeId)
        .single();
      return data;
    },
  });

  const hasSuspension = SUSPENSION_BIKE_TYPES.includes(
    (bike?.type ?? '') as any
  );

  const { data: setup, isLoading } = useQuery({
    queryKey: ['bike-setup', bikeId],
    queryFn: async () => {
      const { data } = await supabase
        .from('bike_setup')
        .select('*')
        .eq('bike_id', bikeId)
        .maybeSingle();
      return data;
    },
  });

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<BikeSetupFormData>({
    resolver: zodResolver(bikeSetupSchema),
  });

  useEffect(() => {
    if (setup) {
      reset(setup as any);
    }
  }, [setup, reset]);

  const mutation = useMutation({
    mutationFn: async (data: BikeSetupFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (setup) {
        const { error } = await supabase
          .from('bike_setup')
          .update(data)
          .eq('id', setup.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bike_setup')
          .insert({ ...data, bike_id: bikeId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bike-setup', bikeId] });
      toast.success(t('saved'));
    },
  });

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-lg bg-muted" />;
  }

  const numInput = (name: keyof BikeSetupFormData, label: string, unit?: string) => (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-xs">{label}{unit ? ` (${unit})` : ''}</Label>
      <Input id={name} type="number" step="0.1" {...register(name)} className="h-9" />
    </div>
  );

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
      {/* Tire Pressure */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('tirePressure')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {numInput('tire_pressure_front', `${t('front')} ${t('pressure')}`, 'bar')}
          {numInput('tire_pressure_rear', `${t('rear')} ${t('pressure')}`, 'bar')}
          {numInput('tire_width_front', `${t('front')} ${t('width')}`, 'mm')}
          {numInput('tire_width_rear', `${t('rear')} ${t('width')}`, 'mm')}
        </CardContent>
      </Card>

      {/* Suspension — only for MTB, Gravel, E-Bike */}
      {hasSuspension && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t('suspension')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="text-sm font-medium">{t('fork')}</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {numInput('fork_pressure', t('airPressure'), 'psi')}
              {numInput('fork_rebound', t('rebound'))}
              {numInput('fork_compression', t('compression'))}
              {numInput('fork_sag_percent', t('sag'), '%')}
              {numInput('fork_travel_mm', t('travel'), 'mm')}
            </div>
            <Separator />
            <h4 className="text-sm font-medium">{t('shock')}</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {numInput('shock_pressure', t('airPressure'), 'psi')}
              {numInput('shock_rebound', t('rebound'))}
              {numInput('shock_compression', t('compression'))}
              {numInput('shock_sag_percent', t('sag'), '%')}
              {numInput('shock_travel_mm', t('travel'), 'mm')}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bike Fit */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t('bikeFit')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {numInput('seat_height_mm', t('seatHeight'), 'mm')}
          {numInput('stem_length_mm', t('stemLength'), 'mm')}
          {numInput('stem_angle', t('stemAngle'), '°')}
          {numInput('handlebar_width_mm', t('handlebarWidth'), 'mm')}
          {numInput('crank_length_mm', t('crankLength'), 'mm')}
          {numInput('stack_mm', t('stack'), 'mm')}
          {numInput('reach_mm', t('reach'), 'mm')}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label>{tc('notes')}</Label>
        <Textarea {...register('notes')} rows={2} />
      </div>

      <Button type="submit" disabled={isSubmitting || mutation.isPending}>
        {isSubmitting || mutation.isPending ? '...' : tc('save')}
      </Button>
    </form>
  );
}
