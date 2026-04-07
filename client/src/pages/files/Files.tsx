import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFiles } from "@/hooks/files/queries/useFiles";
import { useFileActions } from "@/hooks/files/mutations/useFileActions";
import type { CloudFile } from "@/types/fileTypes";
import UploadModal from "@/components/ui/modals/UploadModal";
import { LoadingSpinner } from "@/components/ui/spinners";
import { toast } from "sonner";
import { ImageIcon, Film, FileText, Layers, Plus } from "lucide-react";

import GridCard from "@/components/files/GridCard";
import ListRow from "@/components/files/ListRow";
import FilterPanel from "@/components/files/FilterPanel";
import EmptyState from "@/components/files/EmptyState";
import BulkBar from "@/components/files/BulkBar";
import SelectStrip from "@/components/files/SelectStrip";
import Toolbar from "@/components/files/Toolbar";

const inputCls =
  "w-full px-4 py-2.5 text-sm rounded-xl " +
  "border border-[rgba(var(--border-rgb),0.4)] " +
  "bg-[rgb(var(--card))] text-[rgb(var(--text))] " +
  "outline-none transition-all duration-200 " +
  "focus:border-[rgba(var(--primary),0.6)] " +
  "focus:ring-4 focus:ring-[rgba(var(--primary),0.05)] " +
  "placeholder:text-[rgba(var(--text),0.3)]";

const Files: React.FC = () => {
  const navigate = useNavigate();

  const {
    files, isLoading, isModalOpen, viewMode,
    filters, showFilter, setIsModalOpen, setViewMode, setShowFilter,
  } = useFiles();

  const { deleteFile, bulkDeleteFiles, downloadFile, renameFile } = useFileActions();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  const allSelected = files.length > 0 && selectedIds.length === files.length;

  const toggleSelectAll = () =>
    setSelectedIds(allSelected ? [] : files.map(f => f.id));

  const toggleSelect = useCallback((id: string, index: number, shiftKey: boolean) => {
    if (shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const idsToAdd = files.slice(start, end + 1).map(f => f.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...idsToAdd])));
    } else {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    }
    setLastSelectedIndex(index);
  }, [files, lastSelectedIndex]);

  const startRename = (file: CloudFile) => {
    setRenamingId(file.id);
    setEditName(file.currentVersion.name);
  };

  const submitRename = (id: string) => {
    if (!editName.trim()) return;
    if (files.some(f => f.currentVersion.name === editName && f.id !== id)) {
      toast.error("A file with this name already exists.");
      return;
    }
    renameFile({ id, name: editName });
    setRenamingId(null);
  };

  const handleBulkDownload = () =>
    selectedIds.forEach(id => {
      const file = files.find(f => f.id === id);
      if (file) downloadFile(id, file.currentVersion.name);
    });

  const handleBulkDelete = () => {
    bulkDeleteFiles(selectedIds);
    setSelectedIds([]);
  };

  // Shared props helper
  const sp = (file: CloudFile, index: number) => ({
    file, index,
    selected: selectedIds.includes(file.id),
    renaming: renamingId === file.id,
    editName,
    onSelect: toggleSelect,
    onRename: startRename,
    onEditName: setEditName,
    onSubmitRename: submitRename,
    onCancelRename: () => setRenamingId(null),
    onDownload: downloadFile,
    onDelete: deleteFile,
    onOpen: (id: string) => navigate(`/files/${id}/versions`),
  });

  if (isLoading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  const typeFilters = [
    { key: "all", label: "All", icon: Layers },
    { key: "image", label: "Images", icon: ImageIcon },
    { key: "video", label: "Videos", icon: Film },
    { key: "document", label: "Docs", icon: FileText },
  ] as const;

  return (
    <div className="min-h-screen px-4 sm:px-8 pt-6 pb-32 max-w-[1400px] mx-auto animate-in fade-in duration-500">

      {/* ── Header ── */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--text))]">Files</h1>
          {files.length > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))] border border-[rgba(var(--primary),0.2)]">
              {files.length} Total
            </span>
          )}
        </div>

        {/* Desktop Create Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
            bg-[rgb(var(--primary))] text-white shadow-lg shadow-[rgba(var(--primary),0.25)]
            hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus size={18} strokeWidth={2.5} />
          Upload File
        </button>
      </header>

      {/* ── Toolbar ── */}
      <Toolbar
        filters={filters}
        typeFilters={[...typeFilters]}
        showFilter={showFilter}
        setShowFilter={setShowFilter as (v: boolean) => void}
        viewMode={viewMode}
        setViewMode={setViewMode as (v: "list" | "grid") => void}
      />

      {/* ── Filter panel ── */}
      {showFilter && (
        <FilterPanel
          filters={filters}
          inputCls={inputCls}
          hasActiveFilters={Boolean(filters.search || filters.typeFilter !== "all")}
          setSelectedIds={setSelectedIds}
        />
      )}

      {/* ── Select strip ── */}
      {files.length > 0 && (
        <SelectStrip
          selectedCount={selectedIds.length}
          totalCount={files.length}
          allSelected={allSelected}
          onToggleAll={toggleSelectAll}
        />
      )}

      {/* ── Content Area ── */}
      <main className="mt-2">
        {files.length === 0 ? (
          <EmptyState onUpload={() => setIsModalOpen(true)} />
        ) : viewMode === "list" ? (
          <div className="flex flex-col gap-1">
            {/* Column headers - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-3 px-4 pb-3 border-b border-[rgba(var(--border-rgb),0.2)] text-[10px] font-bold uppercase tracking-[0.1em] text-[rgba(var(--text),0.35)]">
              <div className="w-8" /> {/* Checkbox space */}
              <div className="w-10" /> {/* Icon space */}
              <span className="flex-1">File Name</span>
              <span className="hidden lg:block w-24 text-right">Mime Type</span>
              <span className="w-20 text-right">Size</span>
              <span className="hidden md:block w-36 text-right">Created At</span>
              <div className="w-[140px]" /> {/* Actions space */}
            </div>
            
            <div className="flex flex-col gap-1 mt-2">
              {files.map((file, i) => <ListRow key={file.id} {...sp(file, i)} />)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {files.map((file, i) => <GridCard key={file.id} {...sp(file, i)} />)}
          </div>
        )}
      </main>

      {/* ── Floating Action Button (Mobile Only) ── */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="sm:hidden fixed bottom-24 right-6 w-14 h-14 rounded-full z-40
          bg-[rgb(var(--primary))] text-white shadow-2xl flex items-center justify-center
          active:scale-90 transition-transform"
        aria-label="Upload file"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      {/* ── Overlays ── */}
      <BulkBar
        selectedCount={selectedIds.length}
        onDownload={handleBulkDownload}
        onDelete={handleBulkDelete}
        onClear={() => setSelectedIds([])}
      />

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Files;