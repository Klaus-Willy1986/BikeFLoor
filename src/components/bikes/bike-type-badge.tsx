import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

export function BikeTypeBadge({ type }: { type: string }) {
  const t = useTranslations('bikes');
  return <Badge variant="secondary">{t(`types.${type}`)}</Badge>;
}
