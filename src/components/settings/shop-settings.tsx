'use client';

import { useState } from 'react';
import { useShops } from '@/hooks/use-shops';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Plus,
  Trash2,
  RotateCcw,
  ExternalLink,
  Store,
} from 'lucide-react';

export function ShopSettings() {
  const { shops, addShop, removeShop, resetToDefaults } = useShops();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAdd = () => {
    if (!newName.trim() || !newUrl.trim()) {
      toast.error('Name und Such-URL sind Pflichtfelder');
      return;
    }
    if (!newUrl.includes('{query}')) {
      toast.error('Die URL muss {query} als Platzhalter enthalten');
      return;
    }
    addShop({
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      domain: newName.trim().toLowerCase().replace(/\s+/g, '-'),
      searchUrl: newUrl.trim(),
    });
    setNewName('');
    setNewUrl('');
    setAdding(false);
    toast.success(`${newName} hinzugefügt`);
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingCart className="h-4 w-4" />
            Shops für Preisvergleich
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => {
              resetToDefaults();
              toast.success('Shops zurückgesetzt');
            }}
          >
            <RotateCcw className="mr-1.5 h-3 w-3" />
            Standard
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Diese Shops werden im Wartungs-Board als Bestell-Links angezeigt.
        </p>

        {/* Shop list */}
        <div className="space-y-1.5">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                <Store className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{shop.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {shop.domain}
                </p>
              </div>
              <a
                href={shop.searchUrl.replace('{query}', 'test')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => {
                  removeShop(shop.id);
                  toast.success(`${shop.name} entfernt`);
                }}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add shop */}
        {adding ? (
          <div className="space-y-3 rounded-lg border border-dashed p-3">
            <div className="space-y-2">
              <Label className="text-xs">Shop-Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="z.B. Maciag Offroad"
                className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Such-URL (mit {'{query}'} als Platzhalter)</Label>
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://www.shop.de/search?q={query}"
                className="h-9 font-mono text-xs"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} className="h-8">
                Hinzufügen
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setAdding(false)}
                className="h-8"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5"
            onClick={() => setAdding(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Shop hinzufügen
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
