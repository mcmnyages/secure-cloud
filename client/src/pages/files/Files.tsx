import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFiles } from "@/hooks/files/queries/useFiles";
import { useFileActions } from "@/hooks/files/mutations/useFileActions";
import type { CloudFile } from "@/types/fileTypes";
import UploadModal from "@/components/ui/modals/UploadModal";
import { LoadingSpinner } from "@/components/ui/spinners";
import { toast } from "sonner";
import { ImageIcon, Film, FileText, Layers } from "lucide-react";

import GridCard from "@/components/files/GridCard";
import ListRow from "@/components/files/ListRow";
import FilterPanel from "@/components/files/FilterPanel";
import EmptyState from "@/components/files/EmptyState";
import BulkBar from "@/components/files/BulkBar";
import SelectStrip from "@/components/files/SelectStrip";
import Toolbar from "@/components/files/Toolbar";



// Shared input class for filter panel
const inputCls =
  "w-full px-3 py-2 text-sm rounded-lg " +
  "border border-[rgba(var(--border-rgb),0.5)] " +
  "bg-[rgba(var(--bg),0.6)] text-[rgb(var(--text))] " +
  "outline-none transition-colors duration-150 " +
  "focus:border-[rgba(var(--primary),0.6)] " +
  "focus:ring-2 focus:ring-[rgba(var(--primary),0.1)] " +
  "placeholder:text-[rgba(var(--text),0.3)]";

/* ── Main Page ────────────────────────────────────────────────────────────── */
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

  const hasActiveFilters = Boolean(
    filters.search || filters.typeFilter !== "all" ||
    filters.extension || filters.minSize ||
    filters.maxSize || filters.dateFrom || filters.dateTo
  );

  const toggleSelectAll = () =>
    setSelectedIds(allSelected ? [] : files.map(f => f.id));

  const toggleSelect = (id: string, index: number, shiftKey: boolean) => {
    if (shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      setSelectedIds(prev =>
        Array.from(new Set([...prev, ...files.slice(start, end + 1).map(f => f.id)]))
      );
    } else {
      setSelectedIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    }
    setLastSelectedIndex(index);
  };

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

  if (isLoading) return <LoadingSpinner />;

  const typeFilters = [
    { key: "all", label: "All", icon: Layers },
    { key: "image", label: "Images", icon: ImageIcon },
    { key: "video", label: "Videos", icon: Film },
    { key: "document", label: "Docs", icon: FileText },
  ] as const;

  return (
    <div className="min-h-screen px-4 sm:px-6 pt-8 pb-28 max-w-[1280px] mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-semibold text-[rgb(var(--text))]">Files</h1>
          {files.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full
              bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))]">
              {files.length}
            </span>
          )}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <Toolbar
        filters={filters}
        typeFilters={[...typeFilters]}
        showFilter={showFilter}
        setShowFilter={setShowFilter as (v: boolean) => void}
        viewMode={viewMode}
        setViewMode={setViewMode as (v: string) => void}
      />

      {/* ── Filter panel ── */}
      {showFilter && (
        <FilterPanel
          filters={filters}
          inputCls={inputCls}
          hasActiveFilters={hasActiveFilters}
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

      {/* ── Content ── */}
      {files.length === 0 ? (
        <EmptyState onUpload={() => setIsModalOpen(true)} />
      ) : viewMode === "list" ? (

        <div className="flex flex-col">
          {/* Column headers */}
          <div className="hidden md:flex items-center gap-3 px-3 pb-2 mb-1
            border-b border-[rgba(var(--border-rgb),0.35)]
            text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.3)]">
            <span className="w-4 flex-shrink-0" />
            <span className="w-8 flex-shrink-0" />
            <span className="flex-1">Name</span>
            <span className="hidden sm:block w-16 text-right">Type</span>
            <span className="hidden sm:block w-20 text-right">Size</span>
            <span className="hidden md:block w-36 text-right">Modified</span>
            <span className="w-[132px]" />
          </div>
          {files.map((file, i) => <ListRow key={file.id} {...sp(file, i)} />)}
        </div>

      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {files.map((file, i) => <GridCard key={file.id} {...sp(file, i)} />)}
        </div>

      )}

      {/* FAB */}

      {/* ── Bulk bar ── */}
      {selectedIds.length > 0 && (
        <BulkBar
          selectedCount={selectedIds.length}
          onDownload={handleBulkDownload}
          onDelete={handleBulkDelete}
          onClear={() => setSelectedIds([])}
        />
      )}

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Files;