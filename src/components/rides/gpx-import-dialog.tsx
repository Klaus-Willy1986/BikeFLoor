'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useBikes } from '@/hooks/use-bikes';
import { useImportGpxRide } from '@/hooks/use-gpx-import';
import { parseGPX, parseFIT, type ParsedTrack } from '@/lib/gpx-parser';
import { FileDropZone } from '@/components/rides/file-drop-zone';
import { RouteMap } from '@/components/shared/route-map';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type FileStatus = 'pending' | 'importing' | 'done' | 'error';

interface ParsedFile {
  id: string;
  file: File;
  track: ParsedTrack;
  title: string;
  bikeId: string;
  status: FileStatus;
  error?: string;
}

interface GpxImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GpxImportDialog({ open, onOpenChange }: GpxImportDialogProps) {
  const t = useTranslations();
  const { data: bikes } = useBikes();
  const importMutation = useImportGpxRide();
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const selected = files.find((f) => f.id === selectedId);

  const handleFiles = useCallback(
    async (newFiles: File[]) => {
      const parsed: ParsedFile[] = [];
      for (const file of newFiles) {
        const id = `${Date.now()}-${file.name}`;
        try {
          const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
          let track: ParsedTrack;
          if (ext === '.gpx') {
            const text = await file.text();
            track = parseGPX(text);
          } else {
            const buffer = await file.arrayBuffer();
            track = await parseFIT(buffer);
          }
          parsed.push({
            id,
            file,
            track,
            title: track.title || file.name.replace(/\.(gpx|fit)$/i, ''),
            bikeId: '',
            status: 'pending',
          });
        } catch {
          toast.error(
            t('gpxImport.parseError', { file: file.name })
          );
        }
      }
      setFiles((prev) => [...prev, ...parsed]);
      if (parsed.length > 0 && !selectedId) {
        setSelectedId(parsed[0].id);
      }
    },
    [selectedId, t]
  );

  const updateFile = (id: string, updates: Partial<ParsedFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedId === id) {
      setSelectedId(files.find((f) => f.id !== id)?.id ?? null);
    }
  };

  const handleImportAll = async () => {
    const pending = files.filter((f) => f.status === 'pending');
    if (pending.length === 0) return;
    setImporting(true);

    let successCount = 0;
    let errorCount = 0;

    for (const pf of pending) {
      updateFile(pf.id, { status: 'importing' });
      try {
        await importMutation.mutateAsync({
          track: pf.track,
          file: pf.file,
          title: pf.title,
          bikeId: pf.bikeId || null,
        });
        updateFile(pf.id, { status: 'done' });
        successCount++;
      } catch {
        updateFile(pf.id, { status: 'error' });
        errorCount++;
      }
    }

    setImporting(false);
    if (successCount > 0) {
      toast.success(t('gpxImport.importSuccess', { count: successCount }));
    }
    if (errorCount > 0) {
      toast.error(t('gpxImport.importErrors', { count: errorCount }));
    }
    if (errorCount === 0) {
      setFiles([]);
      setSelectedId(null);
      onOpenChange(false);
    }
  };

  const formatDuration = (s: number | null) => {
    if (!s) return '—';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!importing) {
          onOpenChange(v);
          if (!v) {
            setFiles([]);
            setSelectedId(null);
          }
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('gpxImport.title')}</DialogTitle>
        </DialogHeader>

        <FileDropZone onFiles={handleFiles} disabled={importing} />

        {files.length > 0 && (
          <div className="space-y-4 mt-4">
            {/* File list */}
            <div className="space-y-1.5">
              {files.map((f) => (
                <div
                  key={f.id}
                  onClick={() => !importing && setSelectedId(f.id)}
                  className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-sm cursor-pointer transition-colors ${
                    selectedId === f.id
                      ? 'border-amber-500 bg-amber-500/5'
                      : 'border-border hover:border-amber-500/30'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{f.title}</span>
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase shrink-0"
                      >
                        {f.track.source}
                      </Badge>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{f.track.distance_km} km</span>
                      {f.track.elevation_m && (
                        <span>{f.track.elevation_m} hm</span>
                      )}
                      <span>{formatDuration(f.track.duration_seconds)}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {f.status === 'done' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {f.status === 'error' && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    {f.status === 'importing' && (
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    )}
                    {f.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(f.id);
                        }}
                        className="text-muted-foreground hover:text-foreground text-xs"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Selected file details */}
            {selected && selected.status === 'pending' && (
              <div className="space-y-3 rounded-lg border p-4">
                {/* Map preview */}
                <RouteMap
                  geojson={selected.track.geojson}
                  bounds={selected.track.bounds}
                  height="200px"
                />

                {/* Title */}
                <div className="space-y-1.5">
                  <Label className="text-xs">
                    {t('gpxImport.rideTitle')}
                  </Label>
                  <Input
                    value={selected.title}
                    onChange={(e) =>
                      updateFile(selected.id, { title: e.target.value })
                    }
                  />
                </div>

                {/* Bike assignment */}
                <div className="space-y-1.5">
                  <Label className="text-xs">{t('rides.bike')}</Label>
                  <Select
                    value={selected.bikeId}
                    onValueChange={(v) =>
                      updateFile(selected.id, {
                        bikeId: v === '__none__' ? '' : v,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t('gpxImport.noBike')}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">
                        {t('gpxImport.noBike')}
                      </SelectItem>
                      {bikes?.map((bike) => (
                        <SelectItem key={bike.id} value={bike.id}>
                          {bike.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Import button */}
            {pendingCount > 0 && (
              <Button
                className="w-full"
                onClick={handleImportAll}
                disabled={importing}
              >
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('gpxImport.importing')}
                  </>
                ) : (
                  t('gpxImport.importAll', { count: pendingCount })
                )}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
