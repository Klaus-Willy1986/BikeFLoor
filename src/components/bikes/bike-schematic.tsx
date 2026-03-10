'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useComponents } from '@/hooks/use-components';
import { getWearInfo } from '@/components/components/wear-indicator';
import type { WearStatus } from '@/types';
import Image from 'next/image';

/** Dot positions (% from left, % from top) for road bike component categories */
const ROAD_POSITIONS: Record<string, { left: number; top: number }> = {
  chain:          { left: 33, top: 70 },
  cassette:       { left: 17, top: 60 },
  brake_pads:     { left: 65, top: 38 },
  brake_rotors:   { left: 80, top: 52 },
  tires_front:    { left: 88, top: 78 },
  tires_rear:     { left: 10, top: 78 },
  handlebar_tape: { left: 78, top: 18 },
  cables:         { left: 68, top: 28 },
  bottom_bracket: { left: 38, top: 76 },
  headset:        { left: 70, top: 32 },
  wheels_front:   { left: 88, top: 50 },
  wheels_rear:    { left: 10, top: 50 },
  fork:           { left: 82, top: 42 },
  pedals:         { left: 40, top: 84 },
  saddle:         { left: 40, top: 8 },
  dropper_post:   { left: 43, top: 22 },
  other:          { left: 50, top: 50 },
};

const STATUS_COLORS: Record<WearStatus, string> = {
  good: '#22c55e',
  warning: '#f59e0b',
  critical: '#ef4444',
  overdue: '#ef4444',
};

const STATUS_BG: Record<WearStatus, string> = {
  good: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
  overdue: 'bg-red-500',
};

interface ComponentDot {
  id: string;
  name: string;
  categoryKey: string;
  percentage: number;
  status: WearStatus;
  left: number;
  top: number;
}

export function BikeSchematic({ bikeId }: { bikeId: string }) {
  const t = useTranslations('components');
  const { data: components } = useComponents(bikeId);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  if (!components?.length) return null;

  // Build dots from components — only mounted/active ones
  const dots: ComponentDot[] = [];
  const seenCategories = new Set<string>();

  for (const comp of components) {
    if (comp.rotation_status && comp.rotation_status !== 'mounted') continue;

    const catKey = comp.component_categories?.key;
    if (!catKey || seenCategories.has(catKey)) continue;
    seenCategories.add(catKey);

    const pos = ROAD_POSITIONS[catKey];
    if (!pos) continue;

    const wear = getWearInfo(
      Number(comp.current_distance_km),
      comp.max_distance_km ? Number(comp.max_distance_km) : null
    );

    dots.push({
      id: comp.id,
      name: comp.name,
      categoryKey: catKey,
      percentage: wear.percentage,
      status: wear.status,
      left: pos.left,
      top: pos.top,
    });
  }

  if (!dots.length) return null;

  return (
    <div className="relative w-full max-w-xl mx-auto select-none">
      {/* Bike image */}
      <Image
        src="/Roadbike.png"
        alt="Bike schematic"
        width={860}
        height={640}
        className="w-full h-auto opacity-80"
        priority={false}
      />

      {/* Component dots */}
      {dots.map((dot) => {
        const isHovered = hoveredDot === dot.id;

        return (
          <div
            key={dot.id}
            className="absolute"
            style={{ left: `${dot.left}%`, top: `${dot.top}%` }}
          >
            {/* Pulse ring for critical/overdue */}
            {(dot.status === 'critical' || dot.status === 'overdue') && (
              <span
                className={`absolute -inset-1.5 rounded-full ${STATUS_BG[dot.status]} opacity-30 animate-ping`}
              />
            )}

            {/* Dot */}
            <button
              className={`relative z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md transition-transform ${
                isHovered ? 'scale-150' : 'hover:scale-125'
              }`}
              style={{ backgroundColor: STATUS_COLORS[dot.status] }}
              onMouseEnter={() => setHoveredDot(dot.id)}
              onMouseLeave={() => setHoveredDot(null)}
              onFocus={() => setHoveredDot(dot.id)}
              onBlur={() => setHoveredDot(null)}
            />

            {/* Tooltip */}
            {isHovered && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-5 z-20 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-lg pointer-events-none">
                <p className="font-medium">{dot.name}</p>
                <p className="text-[10px] opacity-70">
                  {t(`categories.${dot.categoryKey}`)}
                  {dot.percentage > 0 && ` · ${Math.round(dot.percentage)}%`}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
