'use client';

import { cn } from '@/lib/utils';
import type { WearStatus } from '@/types';

interface WearIndicatorProps {
  percentage: number;
  status: WearStatus;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

const statusColors: Record<WearStatus, string> = {
  good: 'text-success',
  warning: 'text-warning',
  critical: 'text-destructive',
  overdue: 'text-destructive',
};

const statusStrokeColors: Record<WearStatus, string> = {
  good: 'stroke-success',
  warning: 'stroke-warning',
  critical: 'stroke-destructive',
  overdue: 'stroke-destructive',
};

export function WearIndicator({
  percentage,
  status,
  size = 48,
  strokeWidth = 4,
  showLabel = true,
}: WearIndicatorProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cappedPercent = Math.min(percentage, 100);
  const offset = circumference - (cappedPercent / 100) * circumference;

  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className={cn('-rotate-90', status === 'overdue' && 'animate-pulse')}
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-muted"
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn('transition-all duration-500', statusStrokeColors[status])}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                'text-xs font-bold font-mono',
                statusColors[status]
              )}
            >
              {Math.round(cappedPercent)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function getWearInfo(
  currentKm: number,
  maxKm: number | null
): { percentage: number; status: WearStatus; remainingKm: number | null } {
  if (!maxKm || maxKm <= 0) {
    return { percentage: 0, status: 'good', remainingKm: null };
  }

  const percentage = (currentKm / maxKm) * 100;
  const remainingKm = maxKm - currentKm;

  let status: WearStatus;
  if (percentage >= 100) {
    status = 'overdue';
  } else if (percentage >= 85) {
    status = 'critical';
  } else if (percentage >= 60) {
    status = 'warning';
  } else {
    status = 'good';
  }

  return { percentage, status, remainingKm };
}
