'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPTED = ['.gpx', '.fit'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function FileDropZone({ onFiles, disabled }: FileDropZoneProps) {
  const t = useTranslations('gpxImport');
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const valid: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
        if (ACCEPTED.includes(ext) && file.size <= MAX_SIZE) {
          valid.push(file);
        }
      }
      if (valid.length > 0) onFiles(valid);
    },
    [onFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (!disabled) handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
        dragOver
          ? 'border-amber-500 bg-amber-500/5'
          : 'border-border hover:border-amber-500/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <Upload className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm font-medium">{t('dropZone')}</p>
      <p className="text-xs text-muted-foreground">{t('dropZoneHint')}</p>
      <input
        type="file"
        accept=".gpx,.fit"
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </label>
  );
}
