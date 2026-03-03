// src//hooks/mutations/useFileActions.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fileService } from '@/api/services/fileService';
import { getErrorMessage } from '@/utils/errors/getErrorMessage';

export const useFileActions = () => {
  const queryClient = useQueryClient();

  // Helper to refresh all file-related data in the cache
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['files'] });
    queryClient.invalidateQueries({ queryKey: ['storage'] });
    queryClient.invalidateQueries({queryKey:['fileVersions']})
  };

  // 1. Upload Mutation
  const upload = useMutation({
    mutationFn: (files: File[]) => fileService.Upload(files),
    onSuccess: () => {
      invalidate();
      toast.success('Files uploaded successfully');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  // 2. Delete Mutation
  const remove = useMutation({
    mutationFn: (id: string) => fileService.delete(id),
    onSuccess: () => {
      invalidate();
      toast.success('File deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  // 3. Bulk Delete Mutation (FIXED: Added this)
  const bulkRemove = useMutation({
    mutationFn: (ids: string[]) => fileService.bulkDelete(ids),
    onSuccess: () => {
      invalidate();
      toast.success('Selected files deleted');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  // 4. Rename Mutation
  const rename = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      fileService.renameFile(id, name),
    onSuccess: () => {
      invalidate();
      toast.success('File renamed');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  // 5. Upload New Version Mutation (FIXED: Added this)
  const newVersion = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => 
      fileService.uploadNewVersion(id, file),
    onSuccess: () => {
      invalidate();
      toast.success('New version uploaded');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  // 6. Download (Standard Function, not a mutation)
  const downloadFile = async (id: string, name: string) => {
    try {
      const res = await fileService.download(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // Return exactly what your components need
  return {
    uploadFile: upload.mutate,
    isUploading: upload.isPending,
    deleteFile: remove.mutate,
    bulkDeleteFiles: bulkRemove.mutate, // Now exists!
    renameFile: rename.mutate,
    uploadNewVersion: newVersion.mutate, // Now exists!
    downloadFile,
  };
};