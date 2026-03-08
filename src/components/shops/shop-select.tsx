'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useWorkshops } from '@/hooks/use-shops';
import { ShopFormDialog } from './shop-form-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface ShopSelectProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
}

export function ShopSelect({ value, onValueChange }: ShopSelectProps) {
  const t = useTranslations();
  const { data: shops } = useWorkshops();
  const [createOpen, setCreateOpen] = useState(false);

  const handleChange = (v: string) => {
    if (v === '__new__') {
      setCreateOpen(true);
      return;
    }
    if (v === '__none__') {
      onValueChange(null);
      return;
    }
    onValueChange(v);
  };

  return (
    <>
      <Select value={value ?? '__none__'} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">—</SelectItem>
          {shops?.map((shop) => (
            <SelectItem key={shop.id} value={shop.id}>
              {shop.name}
            </SelectItem>
          ))}
          <SelectItem value="__new__">
            <span className="flex items-center gap-1.5">
              <Plus className="h-3 w-3" />
              {t('shops.addShop')}
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <ShopFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(shop) => onValueChange(shop.id)}
      />
    </>
  );
}
