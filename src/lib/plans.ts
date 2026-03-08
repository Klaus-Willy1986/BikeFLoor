export const PLANS = {
  free: { name: 'Free', bikeLimit: 1 },
  pro: { name: 'Pro', bikeLimit: 5 },
  fleet: { name: 'Fleet', bikeLimit: Infinity },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getBikeLimit(plan: string, isEarlyBird: boolean): number {
  if (isEarlyBird) return Infinity;
  return PLANS[plan as PlanKey]?.bikeLimit ?? 1;
}
