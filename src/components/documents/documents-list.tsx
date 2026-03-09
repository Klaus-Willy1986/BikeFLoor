'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useDocuments, useUploadDocument, useDeleteDocument } from '@/hooks/use-documents';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DOCUMENT_TYPES } from '@/lib/constants';
import { Upload, FileText, Trash2, Download, File } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

function DocumentThumbnail({ filePath, fileType }: { filePath: string; fileType: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const isImage = fileType.startsWith('image/');

  useEffect(() => {
    if (!isImage) return;
    const supabase = createClient();
    supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 300) // 5 min
      .then(({ data }) => {
        if (data?.signedUrl) setUrl(data.signedUrl);
      });
  }, [filePath, isImage]);

  if (!isImage || !url) {
    return <File className="h-5 w-5 shrink-0 text-muted-foreground" />;
  }

  return (
    <img
      src={url}
      alt=""
      className="h-10 w-10 shrink-0 rounded object-cover"
    />
  );
}

interface DocumentsListProps {
  bikeId?: string;
}

export function DocumentsList({ bikeId }: DocumentsListProps) {
  const t = useTranslations();
  const { data: documents, isLoading } = useDocuments(bikeId);
  const uploadDoc = useUploadDocument();
  const deleteDoc = useDeleteDocument();
  const [docType, setDocType] = useState('other');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; filePath: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadDoc.mutateAsync({
        file,
        bikeId,
        documentType: docType,
      });
      toast.success(t('common.upload'));
    } catch (err: any) {
      toast.error(err?.message || t('auth.errors.generic'));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    const supabase = createClient();
    const { data } = await supabase.storage.from('documents').download(filePath);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc.mutateAsync(deleteTarget);
      toast.success(t('common.delete'));
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || t('auth.errors.generic'));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg border bg-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div className="flex items-center gap-3">
        <Select value={docType} onValueChange={setDocType}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DOCUMENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`documents.types.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadDoc.isPending}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploadDoc.isPending ? '...' : t('documents.upload')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,.pdf"
          onChange={handleUpload}
        />
      </div>

      {/* Document list */}
      {!documents?.length ? (
        <EmptyState
          title={t('documents.noDocuments')}
          icon={<FileText className="h-16 w-16" strokeWidth={1} />}
        />
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="border-border/50">
              <CardContent className="flex items-center gap-3 p-3">
                <DocumentThumbnail filePath={doc.file_path} fileType={doc.file_type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t(`documents.types.${doc.document_type}`)} · {(doc.file_size_bytes / 1024).toFixed(0)} KB
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(doc.file_path, doc.name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget({ id: doc.id, filePath: doc.file_path })}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('documents.delete')}
        description={t('documents.deleteConfirm')}
        onConfirm={handleDelete}
        loading={deleteDoc.isPending}
      />
    </div>
  );
}
