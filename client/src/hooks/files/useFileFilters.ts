import { useMemo, useState } from 'react';

export const useFileFilters = (files: any[]) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredFiles = useMemo(() => {
    return files
      .filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || file.mimeType.includes(typeFilter);
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'size') return b.size - a.size;
        return a.name.localeCompare(b.name);
      });
  }, [files, search, typeFilter, sortBy]);

  return {
    search, setSearch,
    typeFilter, setTypeFilter,
    sortBy, setSortBy,
    viewMode, setViewMode,
    filteredFiles
  };
};