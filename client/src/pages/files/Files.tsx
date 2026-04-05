import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFiles } from "@/hooks/files/queries/useFiles";
import { useFileActions } from "@/hooks/files/mutations/useFileActions";
import type { CloudFile } from "@/types/fileTypes";
import UploadModal from "@/components/ui/modals/UploadModal";
import UploadFabButton from "@/components/ui/buttons/UploadFabButton";
import { LoadingSpinner } from "@/components/ui/spinners";
import { toast } from "sonner";
import  GridCard from "../../components/ui/files/GridCard";
import  ListRow  from "../../components/ui/files/ListRow";
import FilesToolbar from "../../components/ui/files/FilesToolbar";
import FilesBulkBar from "../../components/ui/files/FilesBulkBar";
import FilesEmptyState from "../../components/ui/files/FilesEmptyState";
import FilesFilterPanel from "../../components/ui/files/FilesFilterPanel";


const Files: React.FC = () => {
  const navigate = useNavigate();

  const {
    files, isLoading, isModalOpen, viewMode,
    filters, showFilter,
    setIsModalOpen, setViewMode, setShowFilter,
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

  /* ── Selection ───────────────────────────────────────────────────────── */
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

  /* ── Rename ──────────────────────────────────────────────────────────── */
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

  /* ── Bulk ────────────────────────────────────────────────────────────── */
  const handleBulkDownload = () =>
    selectedIds.forEach(id => {
      const file = files.find(f => f.id === id);
      if (file) downloadFile(id, file.currentVersion.name);
    });

  const handleBulkDelete = () => {
    bulkDeleteFiles(selectedIds);
    setSelectedIds([]);
  };

  /* ── Shared props factory ────────────────────────────────────────────── */
  const itemProps = (file: CloudFile, index: number) => ({
    file,
    index,
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

  return (
    <div className="min-h-screen px-4 sm:px-6 pt-8 pb-28 max-w-[1280px] mx-auto">

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <h1 className="text-xl font-semibold text-[rgb(var(--text))]">Files</h1>
        {files.length > 0 && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full
            bg-[rgba(var(--primary),0.1)] text-[rgb(var(--primary))]">
            {files.length}
          </span>
        )}
      </div>

      {/* Toolbar */}
      <FilesToolbar
        search={filters.search}
        onSearchChange={filters.setSearch}
        typeFilter={filters.typeFilter}
        onTypeFilterChange={(key: string) => filters.setTypeFilter(key as typeof filters.typeFilter)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showFilter={showFilter}
        onToggleFilter={() => setShowFilter(!showFilter)}
      />

      {/* Advanced filters */}
      {showFilter && (
        <FilesFilterPanel
          extension={filters.extension}
          onExtensionChange={filters.setExtension}
          onMinSizeChange={filters.setMinSize}
          onMaxSizeChange={filters.setMaxSize}
          dateFrom={filters.dateFrom}
          onDateFromChange={filters.setDateFrom}
          dateTo={filters.dateTo}
          onDateToChange={filters.setDateTo}
          sortBy={filters.sortBy}
          onSortByChange={filters.setSortBy}
          hasActiveFilters={hasActiveFilters}
          onReset={() => { filters.resetFilters(); setSelectedIds([]); }}
        />
      )}

      {/* Select strip */}
      {files.length > 0 && (
        <div className="flex items-center justify-between px-1 mb-4">
          <span className="text-xs text-[rgba(var(--text),0.45)]">
            {selectedIds.length > 0 ? (
              <>
                <span className="font-semibold text-[rgb(var(--primary))]">
                  {selectedIds.length}
                </span>{" "}
                of {files.length} selected
              </>
            ) : (
              <>{files.length} file{files.length !== 1 ? "s" : ""}</>
            )}
          </span>
          <button
            onClick={toggleSelectAll}
            className="text-xs font-medium text-[rgb(var(--primary))] hover:underline underline-offset-2 transition-all"
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        </div>
      )}

      {/* Content */}
      {files.length === 0 ? (

        <FilesEmptyState onUpload={() => setIsModalOpen(true)} />

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
          {files.map((file, i) => (
            <ListRow key={file.id} {...itemProps(file, i)} />
          ))}
        </div>

      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {files.map((file, i) => (
            <GridCard key={file.id} {...itemProps(file, i)} />
          ))}
        </div>

      )}

      <UploadFabButton onClick={() => setIsModalOpen(true)} />

      {/* Bulk bar */}
      {selectedIds.length > 0 && (
        <FilesBulkBar
          count={selectedIds.length}
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