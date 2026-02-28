// src/files/hooks/queries/useFiles.ts
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fileService } from '@/api/services/fileService';
import type { CloudFile, FlatFile } from '@/types/fileTypes';

export const useFiles = () => {
  // 1. UI State
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'size' | 'name'>('newest');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'audio' | 'document' | 'other'>('all');

  // 2. Data Fetching
  const filesQuery = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const res = await fileService.list();
      const flatFiles: FlatFile[] = res.data;
      return flatFiles.map(f => ({
        id: f.id,
        createdAt: f.createdAt,
        currentVersion: {
          id: f.versionId,
          versionNumber: f.versionNumber,
          name: f.name,
          size: f.size,
          mimeType: f.mimeType,
          createdAt: f.createdAt,
        },
      })) as CloudFile[];
    },
  });

  const storageQuery = useQuery({
    queryKey: ['storage'],
    queryFn: async () => {
      const res = await fileService.getStorage();
      return {
        used: Number(res.data.storageUsed),
        limit: Number(res.data.storageLimit),
      };
    },
    staleTime: 1000 * 60 * 2,
  });

  // 3. Filtering & Sorting Logic
  const filteredFiles = useMemo(() => {
    const allFiles = filesQuery.data || [];
    
    return allFiles
      .filter(file => {
        const name = file.currentVersion.name.toLowerCase();
        const matchesSearch = name.includes(search.toLowerCase());
        
        const mime = file.currentVersion.mimeType;
        let matchesType = true;
        if (typeFilter === 'document') matchesType = mime.startsWith('application/');
        else if (typeFilter === 'other') {
          matchesType = !['image', 'video', 'audio', 'application'].some(p => mime.startsWith(p));
        } else if (typeFilter !== 'all') {
          matchesType = mime.startsWith(typeFilter);
        }

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'size') return b.currentVersion.size - a.currentVersion.size;
        return a.currentVersion.name.localeCompare(b.currentVersion.name);
      });
  }, [filesQuery.data, search, typeFilter, sortBy]);

  return {
    // Data
    files: filteredFiles,
    allFiles: filesQuery.data || [],
    storage: storageQuery.data,
    isLoading: filesQuery.isLoading || storageQuery.isLoading,
    isError: filesQuery.isError,

    // UI States
    viewMode,
    setViewMode,
    isModalOpen,
    setIsModalOpen,
    showFilter,
    setShowFilter,

    // Filters (Passed as a grouped object for cleaner props)
    filters: {
      search,
      setSearch,
      typeFilter,
      setTypeFilter,
      sortBy,
      setSortBy,
    },

    refresh: () => {
      filesQuery.refetch();
      storageQuery.refetch();
    },
  };
};