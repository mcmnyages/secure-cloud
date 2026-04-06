import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFiles } from "@/hooks/files/queries/useFiles";
import { useFileActions } from "@/hooks/files/mutations/useFileActions";
import type { CloudFile } from "@/types/fileTypes";
import UploadModal from "@/components/ui/modals/UploadModal";
import { LoadingSpinner } from "@/components/ui/spinners";
import { format, isToday, isYesterday } from "date-fns";
import { filesize } from "filesize";
import { toast } from "sonner";
import { getFileConfig } from "@/utils/helpers/files/fileUtils";
import {
  Search, X, LayoutGrid, List, SlidersHorizontal,
  Download, Trash2, PencilLine, FolderOpen, Check,
  Upload, RotateCcw, ImageIcon, Film, FileText,
  Layers, CheckSquare, Square,
} from "lucide-react";


/* ── Helpers ──────────────────────────────────────────────────────────────── */
const smartDate = (d: string) => {
  const date = new Date(d);
  if (isToday(date))     return `Today · ${format(date, "h:mm a")}`;
  if (isYesterday(date)) return `Yesterday · ${format(date, "h:mm a")}`;
  return format(date, "MMM d, yyyy");
};
const fmtSize = (b: number) => filesize(b, { standard: "jedec" }) as string;

/* ── Shared input class ───────────────────────────────────────────────────── */
const inputCls =
  "w-full px-3 py-2 text-sm rounded-lg " +
  "border border-[rgba(var(--border-rgb),0.5)] " +
  "bg-[rgba(var(--bg),0.6)] text-[rgb(var(--text))] " +
  "outline-none transition-colors duration-150 " +
  "focus:border-[rgba(var(--primary),0.6)] " +
  "focus:ring-2 focus:ring-[rgba(var(--primary),0.1)] " +
  "placeholder:text-[rgba(var(--text),0.3)]";

/* ── RenameForm ───────────────────────────────────────────────────────────── */
const RenameForm = ({
  value, onChange, onSubmit, onCancel,
}: {
  value: string; onChange: (v: string) => void;
  onSubmit: () => void; onCancel: () => void;
}) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    className="flex items-center gap-1.5 w-full min-w-0">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus
      className="flex-1 min-w-0 px-2.5 py-1.5 text-sm rounded-lg
        border border-[rgba(var(--primary),0.5)]
        bg-[rgba(var(--bg),0.8)] text-[rgb(var(--text))]
        outline-none ring-2 ring-[rgba(var(--primary),0.1)]"
    />
    <button type="submit"
      className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg
        bg-emerald-500/10 border border-emerald-500/30 text-emerald-500
        hover:bg-emerald-500/20 transition-colors">
      <Check size={12} />
    </button>
    <button type="button" onClick={onCancel}
      className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg
        bg-[rgba(var(--danger),0.08)] border border-[rgba(var(--danger),0.3)]
        text-[rgb(var(--danger))] hover:bg-[rgba(var(--danger),0.15)] transition-colors">
      <X size={12} />
    </button>
  </form>
);

/* ── FileIcon ─────────────────────────────────────────────────────────────── */
const FileIcon = ({
  mimeType, size = "md",
}: { mimeType: string; size?: "sm" | "md" }) => {
  const { Icon, bg, color } = getFileConfig(mimeType);
  const cls = size === "sm"
    ? "w-8 h-8 rounded-lg"
    : "w-10 h-10 rounded-xl";
  const sz  = size === "sm" ? 15 : 18;
  return (
    <div className={`${cls} ${bg} flex items-center justify-center flex-shrink-0`}>
      <Icon size={sz} className={color} />
    </div>
  );
};

/* ── TypeBadge ────────────────────────────────────────────────────────────── */
const TypeBadge = ({ mimeType }: { mimeType: string }) => {
  const { label, bg, color } = getFileConfig(mimeType);
  return (
    <span className={`${bg} ${color} text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md whitespace-nowrap`}>
      {label}
    </span>
  );
};

/* ── IconBtn ──────────────────────────────────────────────────────────────── */
const IconBtn = ({
  icon: Icon, title, onClick, active = false, danger = false,
}: {
  icon: React.ElementType; title: string; onClick: () => void;
  active?: boolean; danger?: boolean;
}) => (
  <button title={title} onClick={onClick}
    className={[
      "inline-flex items-center justify-center w-8 h-8 rounded-lg border flex-shrink-0 transition-all duration-150",
      danger
        ? "border-transparent text-[rgba(var(--text),0.35)] hover:border-[rgba(var(--danger),0.4)] hover:text-[rgb(var(--danger))] hover:bg-[rgba(var(--danger),0.07)]"
        : active
          ? "border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.1)]"
          : "border-transparent text-[rgba(var(--text),0.4)] hover:border-[rgba(var(--border-rgb),0.5)] hover:text-[rgb(var(--text))] hover:bg-[rgba(var(--card),0.6)]",
    ].join(" ")}>
    <Icon size={14} />
  </button>
);

/* ── TypePill ─────────────────────────────────────────────────────────────── */
const TypePill = ({
  label, icon: Icon, active, onClick,
}: {
  label: string; icon: React.ElementType; active: boolean; onClick: () => void;
}) => (
  <button onClick={onClick}
    className={[
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 whitespace-nowrap",
      active
        ? "border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.08)]"
        : "border-[rgba(var(--border-rgb),0.45)] text-[rgba(var(--text),0.5)] hover:border-[rgba(var(--border-rgb),0.7)] hover:text-[rgb(var(--text))]",
    ].join(" ")}>
    <Icon size={12} />
    {label}
  </button>
);

/* ── GridCard ─────────────────────────────────────────────────────────────── */
const GridCard = ({
  file, selected, renaming, editName, index,
  onSelect, onRename, onEditName, onSubmitRename,
  onCancelRename, onDownload, onDelete, onOpen,
}: any) => (
  <div
    style={{ animationDelay: `${index * 30}ms` }}
    className={[
      "group relative flex flex-col gap-3 p-4 rounded-xl border animate-scaleIn",
      "bg-[rgb(var(--card))] transition-all duration-200",
      selected
        ? "border-[rgba(var(--primary),0.5)] bg-[rgba(var(--primary),0.04)] shadow-[0_0_0_1px_rgba(var(--primary),0.15)]"
        : "border-[rgba(var(--border-rgb),0.5)] hover:border-[rgba(var(--border-rgb),0.8)] hover:shadow-md",
    ].join(" ")}
  >
    {/* Checkbox */}
    <button
      onClick={(e) => onSelect(file.id, index, (e as React.MouseEvent).shiftKey)}
      data-sel={selected}
      className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 data-[sel=true]:opacity-100 transition-opacity">
      {selected
        ? <CheckSquare size={15} className="text-[rgb(var(--primary))]" />
        : <Square size={15} className="text-[rgba(var(--text),0.35)]" />}
    </button>

    {/* Icon */}
    <div className="flex justify-center py-2">
      <FileIcon mimeType={file.currentVersion.mimeType} size="md" />
    </div>

    {/* Info */}
    <div className="flex flex-col gap-1.5 min-w-0">
      {renaming ? (
        <RenameForm value={editName} onChange={onEditName}
          onSubmit={() => onSubmitRename(file.id)} onCancel={onCancelRename} />
      ) : (
        <>
          <p title={file.currentVersion.name}
            className="text-sm font-medium truncate text-[rgb(var(--text))]">
            {file.currentVersion.name}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <TypeBadge mimeType={file.currentVersion.mimeType} />
            <span className="text-xs text-[rgba(var(--text),0.4)]">
              {fmtSize(file.currentVersion.size)}
            </span>
          </div>
          <p className="text-xs text-[rgba(var(--text),0.3)]">
            {smartDate(file.createdAt)}
          </p>
        </>
      )}
    </div>

    {/* Actions */}
    <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <IconBtn icon={PencilLine} title="Rename"   onClick={() => onRename(file)} />
      <IconBtn icon={Download}   title="Download" onClick={() => onDownload(file.id, file.currentVersion.name)} />
      <IconBtn icon={Trash2}     title="Delete"   onClick={() => onDelete(file.id)} danger />
      <IconBtn icon={FolderOpen} title="Open"     onClick={() => onOpen(file.id)} />
    </div>
  </div>
);

/* ── ListRow ──────────────────────────────────────────────────────────────── */
const ListRow = ({
  file, selected, renaming, editName, index,
  onSelect, onRename, onEditName, onSubmitRename,
  onCancelRename, onDownload, onDelete, onOpen,
}: any) => (
  <div
    style={{ animationDelay: `${index * 25}ms` }}
    className={[
      "group flex items-center gap-3 px-3 py-2.5 rounded-xl border animate-fadeIn transition-all duration-150",
      selected
        ? "border-[rgba(var(--primary),0.35)] bg-[rgba(var(--primary),0.04)]"
        : "border-transparent hover:bg-[rgb(var(--card))] hover:border-[rgba(var(--border-rgb),0.45)]",
    ].join(" ")}
  >
    {/* Checkbox */}
    <button
      onClick={(e) => onSelect(file.id, index, (e as React.MouseEvent).shiftKey)}
      data-sel={selected}
      className="flex-shrink-0 opacity-0 group-hover:opacity-100 data-[sel=true]:opacity-100 transition-opacity">
      {selected
        ? <CheckSquare size={15} className="text-[rgb(var(--primary))]" />
        : <Square size={15} className="text-[rgba(var(--text),0.3)]" />}
    </button>

    <FileIcon mimeType={file.currentVersion.mimeType} size="sm" />

    {/* Name */}
    <div className="flex-1 min-w-0">
      {renaming ? (
        <RenameForm value={editName} onChange={onEditName}
          onSubmit={() => onSubmitRename(file.id)} onCancel={onCancelRename} />
      ) : (
        <span title={file.currentVersion.name}
          className="block text-sm font-medium truncate text-[rgb(var(--text))]">
          {file.currentVersion.name}
        </span>
      )}
    </div>

    <div className="hidden sm:block flex-shrink-0">
      <TypeBadge mimeType={file.currentVersion.mimeType} />
    </div>

    <span className="hidden sm:block w-20 text-right text-xs text-[rgba(var(--text),0.4)] tabular-nums flex-shrink-0">
      {fmtSize(file.currentVersion.size)}
    </span>

    <span className="hidden md:block w-36 text-right text-xs text-[rgba(var(--text),0.35)] flex-shrink-0">
      {smartDate(file.createdAt)}
    </span>

    <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <IconBtn icon={PencilLine} title="Rename"   onClick={() => onRename(file)} />
      <IconBtn icon={Download}   title="Download" onClick={() => onDownload(file.id, file.currentVersion.name)} />
      <IconBtn icon={Trash2}     title="Delete"   onClick={() => onDelete(file.id)} danger />
      <IconBtn icon={FolderOpen} title="Open"     onClick={() => onOpen(file.id)} />
    </div>
  </div>
);

/* ── Main Page ────────────────────────────────────────────────────────────── */
const Files: React.FC = () => {
  const navigate = useNavigate();

  const {
    files, isLoading, isModalOpen, viewMode,
    filters, showFilter, setIsModalOpen, setViewMode, setShowFilter,
  } = useFiles();

  const { deleteFile, bulkDeleteFiles, downloadFile, renameFile } = useFileActions();

  const [selectedIds, setSelectedIds]             = useState<string[]>([]);
  const [renamingId, setRenamingId]               = useState<string | null>(null);
  const [editName, setEditName]                   = useState<string>("");
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
      const end   = Math.max(lastSelectedIndex, index);
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
    selected:       selectedIds.includes(file.id),
    renaming:       renamingId === file.id,
    editName,
    onSelect:       toggleSelect,
    onRename:       startRename,
    onEditName:     setEditName,
    onSubmitRename: submitRename,
    onCancelRename: () => setRenamingId(null),
    onDownload:     downloadFile,
    onDelete:       deleteFile,
    onOpen:         (id: string) => navigate(`/files/${id}/versions`),
  });

  if (isLoading) return <LoadingSpinner />;

  const typeFilters = [
    { key: "all",      label: "All",    icon: Layers    },
    { key: "image",    label: "Images", icon: ImageIcon },
    { key: "video",    label: "Videos", icon: Film      },
    { key: "document", label: "Docs",   icon: FileText  },
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
      <div className="flex flex-wrap items-center gap-2 mb-5">

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(var(--text),0.35)] pointer-events-none" />
          <input
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            placeholder="Search files…"
            className="w-full pl-9 pr-8 py-2 rounded-lg text-sm
              border border-[rgba(var(--border-rgb),0.5)]
              bg-[rgb(var(--card))] text-[rgb(var(--text))]
              outline-none placeholder:text-[rgba(var(--text),0.3)]
              focus:border-[rgba(var(--primary),0.5)]
              focus:ring-2 focus:ring-[rgba(var(--primary),0.08)]
              transition-all duration-150"
          />
          {filters.search && (
            <button onClick={() => filters.setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2
                text-[rgba(var(--text),0.35)] hover:text-[rgba(var(--text),0.7)] transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Type pills */}
        <div className="flex gap-1.5 flex-wrap">
          {typeFilters.map(({ key, label, icon }) => (
            <TypePill key={key} label={label} icon={icon}
              active={filters.typeFilter === key}
              onClick={() => filters.setTypeFilter(key)} />
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5 ml-auto">
          <IconBtn icon={SlidersHorizontal} title="Filters"
            active={showFilter} onClick={() => setShowFilter(!showFilter)} />
          <div className="w-px h-5 bg-[rgba(var(--border-rgb),0.5)]" />
          <IconBtn icon={List}       title="List"
            active={viewMode === "list"} onClick={() => setViewMode("list")} />
          <IconBtn icon={LayoutGrid} title="Grid"
            active={viewMode === "grid"} onClick={() => setViewMode("grid")} />
        </div>
      </div>

      {/* ── Filter panel ── */}
      {showFilter && (
        <div className="mb-5 p-4 rounded-xl border border-[rgba(var(--border-rgb),0.5)]
          bg-[rgb(var(--card))] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-fadeIn">

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
              Extension
            </label>
            <input className={inputCls} type="text" placeholder="pdf, png…"
              value={filters.extension}
              onChange={(e) => filters.setExtension(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
              Min size
            </label>
            <input className={inputCls} type="number" placeholder="bytes"
              onChange={(e) => filters.setMinSize(Number(e.target.value))} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
              Max size
            </label>
            <input className={inputCls} type="number" placeholder="bytes"
              onChange={(e) => filters.setMaxSize(Number(e.target.value))} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
              From
            </label>
            <input className={inputCls} type="date" value={filters.dateFrom}
              onChange={(e) => filters.setDateFrom(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
              To
            </label>
            <input className={inputCls} type="date" value={filters.dateTo}
              onChange={(e) => filters.setDateTo(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[rgba(var(--text),0.4)]">
              Sort
            </label>
            <div className="flex flex-col gap-2">
              <select className={inputCls} value={filters.sortBy}
                onChange={(e) => filters.setSortBy(e.target.value as "newest" | "size" | "name")}>
                <option value="newest">Newest</option>
                <option value="size">Largest</option>
                <option value="name">Name A–Z</option>
              </select>
              <button
                disabled={!hasActiveFilters}
                onClick={() => { filters.resetFilters(); setSelectedIds([]); }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2
                  rounded-lg text-xs font-medium
                  border border-[rgba(var(--danger),0.35)] text-[rgb(var(--danger))]
                  hover:bg-[rgba(var(--danger),0.08)]
                  disabled:opacity-30 disabled:pointer-events-none transition-colors">
                <RotateCcw size={11} /> Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Select strip ── */}
      {files.length > 0 && (
        <div className="flex items-center justify-between px-1 mb-4">
          <span className="text-xs text-[rgba(var(--text),0.45)]">
            {selectedIds.length > 0
              ? <><span className="font-semibold text-[rgb(var(--primary))]">{selectedIds.length}</span> of {files.length} selected</>
              : <>{files.length} file{files.length !== 1 ? "s" : ""}</>}
          </span>
          <button onClick={toggleSelectAll}
            className="text-xs font-medium text-[rgb(var(--primary))] hover:underline underline-offset-2 transition-all">
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        </div>
      )}

      {/* ── Content ── */}
      {files.length === 0 ? (

        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[rgba(var(--primary),0.08)]
            flex items-center justify-center">
            <FolderOpen size={26} className="text-[rgb(var(--primary))]" />
          </div>
          <p className="text-sm font-semibold text-[rgb(var(--text))]">No files yet</p>
          <p className="text-sm text-[rgba(var(--text),0.4)] max-w-[220px]">
            Upload your first file to get started.
          </p>
          <button onClick={() => setIsModalOpen(true)}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg
              text-sm font-medium bg-[rgb(var(--primary))] text-white border-none
              hover:bg-[rgb(var(--primary-dark))] hover:-translate-y-px
              hover:shadow-[0_4px_16px_rgba(var(--primary),0.3)]
              transition-all duration-150">
            <Upload size={14} /> Upload
          </button>
        </div>

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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          flex items-center gap-2 px-3.5 py-2.5 rounded-2xl whitespace-nowrap
          bg-[rgb(var(--card))] border border-[rgba(var(--border-rgb),0.6)]
          shadow-[0_8px_30px_rgba(0,0,0,0.18)] animate-scaleIn">

          <span className="text-xs font-semibold text-[rgb(var(--primary))]
            bg-[rgba(var(--primary),0.1)] px-2.5 py-1 rounded-lg">
            {selectedIds.length} selected
          </span>

          <div className="w-px h-4 bg-[rgba(var(--border-rgb),0.5)]" />

          <button onClick={handleBulkDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-xs font-medium text-[rgba(var(--text),0.65)]
              hover:bg-[rgba(var(--border-rgb),0.3)] hover:text-[rgb(var(--text))]
              transition-colors">
            <Download size={13} /> Download
          </button>

          <button onClick={handleBulkDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
              text-xs font-medium text-[rgb(var(--danger))]
              hover:bg-[rgba(var(--danger),0.08)] transition-colors">
            <Trash2 size={13} /> Delete
          </button>

          <button onClick={() => setSelectedIds([])}
            className="flex items-center justify-center w-6 h-6 rounded-lg
              text-[rgba(var(--text),0.35)] hover:text-[rgba(var(--text),0.65)]
              hover:bg-[rgba(var(--border-rgb),0.3)] transition-colors">
            <X size={12} />
          </button>
        </div>
      )}

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Files;