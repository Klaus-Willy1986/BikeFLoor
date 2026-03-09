'use client';

import { useTranslations } from 'next-intl';
import { useComponentHistory } from '@/hooks/use-components';
import { cn } from '@/lib/utils';

const actionConfig: Record<string, { color: string; label: string }> = {
  installed: { color: 'bg-emerald-500', label: 'timeline.installed' },
  swapped: { color: 'bg-amber-500', label: 'timeline.swapped' },
  removed: { color: 'bg-red-500', label: 'timeline.removed' },
};

export function ComponentTimeline({ componentId }: { componentId: string }) {
  const t = useTranslations('components');
  const { data: history, isLoading } = useComponentHistory(componentId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-muted" />
        ))}
      </div>
    );
  }

  if (!history?.length) {
    return (
      <p className="text-sm text-muted-foreground">{t('timeline.noHistory')}</p>
    );
  }

  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />

      {history.map((entry, idx) => {
        const config = actionConfig[entry.action] ?? actionConfig.installed;
        const isLast = idx === history.length - 1;

        return (
          <div key={entry.id} className="relative flex gap-3 pb-4 last:pb-0">
            {/* Dot */}
            <div className="relative z-10 flex shrink-0 items-start pt-1">
              <div className={cn('h-[18px] w-[18px] rounded-full border-2 border-background', config.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {t(config.label)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.created_at).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                {entry.from_bike && (
                  <span>
                    {t('timeline.from')}: {(entry.from_bike as any).name}
                  </span>
                )}
                {entry.to_bike && (
                  <span>
                    {t('timeline.to')}: {(entry.to_bike as any).name}
                  </span>
                )}
                {entry.distance_at_action_km != null && (
                  <span className="font-mono">
                    @ {Number(entry.distance_at_action_km).toLocaleString()} km
                  </span>
                )}
              </div>

              {entry.notes && (
                <p className="mt-1 text-xs text-muted-foreground italic">
                  {entry.notes}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
