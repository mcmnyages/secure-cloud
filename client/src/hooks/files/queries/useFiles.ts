import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fileService } from '@/api/services/fileService';
import type { CloudFile, FlatFile, FileVersion } from '@/types/fileTypes';

export const useFiles = () => {
  // 1. UI & Filter State
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'size' | 'name'>('newest');
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'audio' | 'document' | 'other'>('all');
  const [extension, setExtension] = useState<string>("");
  const [minSize, setMinSize] = useState<number | null>(null);
  const [maxSize, setMaxSize] = useState<number | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  



  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setSortBy("newest");

    setExtension("");
    setMinSize(null);
    setMaxSize(null);
    setDateFrom("");
    setDateTo("");
  };

  // 2. Selection State (For Modular Versions)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  // 3. Data Fetching

  // Main Files Query
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

  // Modular Version Query: Only fetches when selectedFileId changes
  const versionsQuery = useQuery({
    queryKey: ['fileVersions', selectedFileId],
    queryFn: async () => {
      if (!selectedFileId) return [];
      const res = await fileService.getFileVersions(selectedFileId);
      return res.data as FileVersion[];
    },
    enabled: !!selectedFileId, // Only runs if an ID is selected
    staleTime: 1000 * 60 * 5,   // Cache versions for 5 mins
  });

  // Storage Query
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

  // 4. Filtering & Sorting Logic
  const filteredFiles = useMemo(() => {
    const allFiles = filesQuery.data || [];

    return allFiles
      .filter((file) => {
        const name = file.currentVersion.name.toLowerCase();
        const mime = file.currentVersion.mimeType;
        const size = file.currentVersion.size;
        const created = new Date(file.createdAt);

        // Search
        const matchesSearch =
          !search ||
          name.includes(search.toLowerCase());

        // Extension
        const matchesExtension =
          !extension ||
          name.endsWith(`.${extension.toLowerCase()}`);

        // Type filter
        let matchesType = true;
        if (typeFilter === "document") matchesType = mime.startsWith("application/");
        else if (typeFilter === "other") {
          matchesType = !["image", "video", "audio", "application"].some((p) =>
            mime.startsWith(p)
          );
        } else if (typeFilter !== "all") {
          matchesType = mime.startsWith(typeFilter);
        }

        // Size filters
        const matchesMinSize = minSize ? size >= minSize : true;
        const matchesMaxSize = maxSize ? size <= maxSize : true;

        // Date filters
        const matchesDateFrom = dateFrom ? created >= new Date(dateFrom) : true;
        const matchesDateTo = dateTo ? created <= new Date(dateTo) : true;

        return (
          matchesSearch &&
          matchesExtension &&
          matchesType &&
          matchesMinSize &&
          matchesMaxSize &&
          matchesDateFrom &&
          matchesDateTo
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        if (sortBy === "size")
          return b.currentVersion.size - a.currentVersion.size;

        return a.currentVersion.name.localeCompare(b.currentVersion.name);
      });
  }, [
    filesQuery.data,
    search,
    typeFilter,
    extension,
    minSize,
    maxSize,
    dateFrom,
    dateTo,
    sortBy,
  ]);

  return {
    // Data
    files: filteredFiles,
    allFiles: filesQuery.data || [],
    versions: versionsQuery.data || [],
    storage: storageQuery.data,

    // Status
    isLoading: filesQuery.isLoading || storageQuery.isLoading,
    isVersionsLoading: versionsQuery.isFetching,
    isError: filesQuery.isError || versionsQuery.isError,

    // Selection/Modular States
    selectedFileId,
    setSelectedFileId,
    selectedFile: filesQuery.data?.find(f => f.id === selectedFileId),

    // UI States (Restored)
    viewMode,
    setViewMode,
    isModalOpen,
    setIsModalOpen,
    showFilter,
    setShowFilter,

    // Filters
    filters: {
      search,
      setSearch,
      typeFilter,
      setTypeFilter,
      sortBy,
      setSortBy,
      extension,
      setExtension,
      minSize,
      setMinSize,
      maxSize,
      setMaxSize,
      dateFrom,
      setDateFrom,
      dateTo,
      setDateTo,
      resetFilters,
    },
    // Refresh
    refresh: () => {
      filesQuery.refetch();
      storageQuery.refetch();
      if (selectedFileId) versionsQuery.refetch();
    },
  };
};