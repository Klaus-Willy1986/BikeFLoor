'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useDocuments(bikeId?: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ['documents', bikeId],
    queryFn: async () => {
      let query = supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (bikeId) {
        query = query.eq('bike_id', bikeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useUploadDocument() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      bikeId,
      componentId,
      documentType,
    }: {
      file: File;
      bikeId?: string;
      componentId?: string;
      documentType: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const filePath = `${user.id}/${bikeId ?? 'general'}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Document upload error:', uploadError);
        throw uploadError;
      }

      const { data: doc, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          bike_id: bikeId,
          component_id: componentId,
          name: file.name,
          file_path: filePath,
          file_type: file.type,
          document_type: documentType,
          file_size_bytes: file.size,
        })
        .select()
        .single();

      if (error) throw error;
      return doc;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocument() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      await supabase.storage.from('documents').remove([filePath]);

      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
