'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { resolveBikeImage } from '@/lib/bike-image';
import Image from 'next/image';
import type { Database } from '@/types/database';

type BikeRow = Database['public']['Tables']['bikes']['Row'];

const typeColors: Record<string, string> = {
  road: 'bg-blue-500/20 text-blue-200',
  mtb: 'bg-amber-500/20 text-amber-200',
  gravel: 'bg-emerald-500/20 text-emerald-200',
  city: 'bg-violet-500/20 text-violet-200',
  ebike: 'bg-cyan-500/20 text-cyan-200',
  other: 'bg-gray-500/20 text-gray-200',
};

const typeGradients: Record<string, string> = {
  road: 'from-blue-700 to-blue-900',
  mtb: 'from-amber-700 to-amber-900',
  gravel: 'from-emerald-700 to-emerald-900',
  city: 'from-violet-700 to-violet-900',
  ebike: 'from-cyan-700 to-cyan-900',
  other: 'from-gray-700 to-gray-900',
};

export function BikeGarageCard({ bike }: { bike: BikeRow }) {
  const t = useTranslations('bikes');
  const image = resolveBikeImage(bike);
  const colorClass = typeColors[bike.type] || typeColors.other;
  const gradient = typeGradients[bike.type] || typeGradients.other;

  return (
    <Link href={`/bikes/${bike.id}`}>
      <div className="group relative aspect-[16/9] overflow-hidden rounded-xl border bg-card cursor-pointer">
        {/* Background */}
        {image ? (
          <Image
            src={image}
            alt={bike.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}

        {/* Dark scrim overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white leading-tight">
                {bike.name}
              </h3>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge className={`border-0 text-[11px] ${colorClass}`}>
                  {t(`types.${bike.type}`)}
                </Badge>
              </div>
            </div>
            <span className="font-mono text-sm tabular-nums text-white/80">
              {Math.round(Number(bike.total_distance_km)).toLocaleString()} km
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
