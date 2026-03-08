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
  Search,
  X,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Download,
  Trash2,
  PencilLine,
  FolderOpen,
  Check,
  Upload,
  RotateCcw,
  ImageIcon,
  Film,
  FileText,
  Layers,
  CheckSquare,
  Square,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────────── */
const smartDate = (d: string) => {
  const date = new Date(d);
  if (isToday(date)) return `Today · ${format(date, "h:mm a")}`;
  if (isYesterday(date)) return `Yesterday · ${format(date, "h:mm a")}`;
  return format(date, "MMM d, yyyy");
};

const fmtSize = (b: number) => filesize(b, { standard: "jedec" }) as string;

/* ─────────────────────────────────────────────────────────────────────────────
   Tiny shared atoms
───────────────────────────────────────────────────────────────────────────── */

/** Inline rename form */
const RenameForm = ({
  value,
  onChange,
  onSubmit,
  onCancel,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
    className="flex items-center gap-1.5 w-full"
  >
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus
      className="
        flex-1 min-w-0 px-2 py-1 text-sm rounded-md
        border border-[rgba(var(--primary),0.5)]
        bg-[rgba(var(--bg),0.8)] text-[rgb(var(--text))]
        outline-none ring-2 ring-[rgba(var(--primary),0.12)]
      "
    />
    <button
      type="submit"
      title="Save"
      className="
        flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0
        bg-emerald-500/15 border border-emerald-500/35 text-emerald-500
        hover:bg-emerald-500/25 transition-colors
      "
    >
      <Check size={11} />
    </button>
    <button
      type="button"
      title="Cancel"
      onClick={onCancel}
      className="
        flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0
        bg-[rgba(var(--danger),0.1)] border border-[rgba(var(--danger),0.3)]
        text-[rgb(var(--danger))] hover:bg-[rgba(var(--danger),0.2)] transition-colors
      "
    >
      <X size={11} />
    </button>
  </form>
);

/** Coloured file-type icon bubble */
const FileIconBubble = ({
  mimeType,
  size = "md",
}: {
  mimeType: string;
  size?: "sm" | "md" | "lg";
}) => {
  const { Icon, bg, color } = getFileConfig(mimeType);
  const wrapCls =
    size === "sm"
      ? "w-8 h-8 rounded-lg"
      : size === "lg"
        ? "w-14 h-14 rounded-2xl"
        : "w-9 h-9 rounded-xl";
  const iconSz = size === "sm" ? 14 : size === "lg" ? 26 : 16;
  return (
    <div
      className={`${wrapCls} ${bg} flex items-center justify-center flex-shrink-0`}
    >
      <Icon size={iconSz} className={color} />
    </div>
  );
};

/** Small coloured label badge */
const TypeBadge = ({ mimeType }: { mimeType: string }) => {
  const { label, bg, color } = getFileConfig(mimeType);
  return (
    <span
      className={`${bg} ${color} text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md whitespace-nowrap`}
    >
      {label}
    </span>
  );
};

/** Generic square icon button */
const IconBtn = ({
  icon: Icon,
  title,
  onClick,
  active = false,
  danger = false,
  size = 14,
}: {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  size?: number;
}) => (
  <button
    title={title}
    onClick={onClick}
    className={[
      "inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-150 flex-shrink-0",
      danger
        ? "border-[rgba(var(--danger),0.25)] text-[rgba(var(--danger),0.55)] hover:border-[rgba(var(--danger),0.55)] hover:text-[rgb(var(--danger))] hover:bg-[rgba(var(--danger),0.08)]"
        : active
          ? "border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.1)]"
          : "border-[rgba(var(--border-rgb),0.45)] text-[rgba(var(--text),0.5)] hover:border-[rgba(var(--primary),0.4)] hover:text-[rgb(var(--primary))] hover:bg-[rgba(var(--primary),0.07)]",
    ].join(" ")}
  >
    <Icon size={size} />
  </button>
);

/** Type-filter pill */
const TypePill = ({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={[
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border",
      "text-xs font-semibold transition-all duration-150 whitespace-nowrap",
      active
        ? "border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.1)]"
        : "border-[rgba(var(--border-rgb),0.45)] text-[rgba(var(--text),0.55)] bg-[rgba(var(--card),0.3)] hover:border-[rgba(var(--primary),0.35)] hover:text-[rgb(var(--primary))] hover:bg-[rgba(var(--primary),0.06)]",
    ].join(" ")}
  >
    <Icon size={12} />
    {label}
  </button>
);

/** Filter panel field wrapper */
const FilterField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-[10px] font-bold uppercase tracking-widest text-[rgba(var(--text),0.38)]">
      {label}
    </span>
    {children}
  </label>
);

/** Shared CSS string for all filter inputs */
const fi =
  "w-full px-2.5 py-1.5 text-sm rounded-lg " +
  "border border-[rgba(var(--border-rgb),0.45)] " +
  "bg-[rgba(var(--bg),0.5)] text-[rgb(var(--text))] " +
  "outline-none transition-all duration-150 " +
  "focus:border-[rgba(var(--primary),0.5)] focus:ring-2 focus:ring-[rgba(var(--primary),0.08)] " +
  "placeholder:text-[rgba(var(--text),0.3)]";

/* ─────────────────────────────────────────────────────────────────────────────
   GridCard
───────────────────────────────────────────────────────────────────────────── */
const GridCard = ({
  file,
  selected,
  renaming,
  editName,
  index,
  onSelect,
  onRename,
  onEditName,
  onSubmitRename,
  onCancelRename,
  onDownload,
  onDelete,
  onOpen,
}: any) => (
  <div
    style={{ animationDelay: `${index * 35}ms` }}
    className={[
      "group relative flex flex-col gap-3 p-4 rounded-2xl border",
      "bg-[rgba(var(--card),0.55)] backdrop-blur-sm",
      "transition-all duration-200 animate-scaleIn",
      selected
        ? "border-[rgba(var(--primary),0.45)] bg-[rgba(var(--primary),0.06)] shadow-[0_0_0_1px_rgba(var(--primary),0.15)]"
        : "border-[rgba(var(--border-rgb),0.35)] hover:-translate-y-0.5 hover:border-[rgba(var(--primary),0.2)] hover:shadow-lg hover:shadow-black/10",
    ].join(" ")}
  >
    {/* Checkbox — hidden until hover or selected */}
    <button
      onClick={(e) => onSelect(file.id, index, (e as React.MouseEvent).shiftKey)}
      data-sel={selected}
      className="
        absolute top-3 left-3 z-10
        opacity-0 group-hover:opacity-100 data-[sel=true]:opacity-100
        transition-opacity duration-150
      "
    >
      {selected ? (
        <CheckSquare size={15} className="text-[rgb(var(--primary))]" />
      ) : (
        <Square size={15} className="text-[rgba(var(--text),0.4)]" />
      )}
    </button>

    {/* Large icon */}
    <div className="flex justify-center pt-2 pb-1">
      <FileIconBubble mimeType={file.currentVersion.mimeType} size="lg" />
    </div>

    {/* Name / rename */}
    <div className="flex flex-col gap-1.5 min-w-0">
      {renaming ? (
        <RenameForm
          value={editName}
          onChange={onEditName}
          onSubmit={() => onSubmitRename(file.id)}
          onCancel={onCancelRename}
        />
      ) : (
        <>
          <p
            title={file.currentVersion.name}
            className="text-sm font-semibold truncate text-[rgb(var(--text))]"
          >
            {file.currentVersion.name}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <TypeBadge mimeType={file.currentVersion.mimeType} />
            <span className="text-[11px] text-[rgba(var(--text),0.4)]">
              {fmtSize(file.currentVersion.size)}
            </span>
          </div>
          <p className="text-[11px] text-[rgba(var(--text),0.35)]">
            {smartDate(file.createdAt)}
          </p>
        </>
      )}
    </div>

    {/* Actions row — visible on hover */}
    <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <IconBtn icon={PencilLine} title="Rename" onClick={() => onRename(file)} size={13} />
      <IconBtn icon={Download} title="Download" onClick={() => onDownload(file.id, file.currentVersion.name)} size={13} />
      <IconBtn icon={Trash2} title="Delete" onClick={() => onDelete(file.id)} danger size={13} />
      <IconBtn icon={FolderOpen} title="Open" onClick={() => onOpen(file.id)} size={13} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   ListRow
───────────────────────────────────────────────────────────────────────────── */
const ListRow = ({
  file,
  selected,
  renaming,
  editName,
  index,
  onSelect,
  onRename,
  onEditName,
  onSubmitRename,
  onCancelRename,
  onDownload,
  onDelete,
  onOpen,
}: any) => (
  <div
    style={{ animationDelay: `${index * 30}ms` }}
    className={[
      "group flex items-center gap-3 px-3 py-2.5 rounded-xl border",
      "transition-all duration-150 animate-fadeIn",
      selected
        ? "border-[rgba(var(--primary),0.3)] bg-[rgba(var(--primary),0.06)]"
        : "border-transparent hover:border-[rgba(var(--border-rgb),0.4)] hover:bg-[rgba(var(--card),0.55)]",
    ].join(" ")}
  >
    {/* Checkbox */}
    <button
      onClick={(e) => onSelect(file.id, index, (e as React.MouseEvent).shiftKey)}
      className="opacity-0 group-hover:opacity-100 data-[sel=true]:opacity-100 transition-opacity flex-shrink-0"
      data-sel={selected}
    >
      {selected ? (
        <CheckSquare size={15} className="text-[rgb(var(--primary))]" />
      ) : (
        <Square size={15} className="text-[rgba(var(--text),0.35)]" />
      )}
    </button>

    {/* Icon */}
    <FileIconBubble mimeType={file.currentVersion.mimeType} size="sm" />

    {/* Name / rename */}
    <div className="flex-1 min-w-0">
      {renaming ? (
        <RenameForm
          value={editName}
          onChange={onEditName}
          onSubmit={() => onSubmitRename(file.id)}
          onCancel={onCancelRename}
        />
      ) : (
        <span
          title={file.currentVersion.name}
          className="block truncate text-sm font-medium text-[rgb(var(--text))]"
        >
          {file.currentVersion.name}
        </span>
      )}
    </div>

    {/* Type badge — hidden on mobile */}
    <div className="hidden sm:block w-20">
      <TypeBadge mimeType={file.currentVersion.mimeType} />
    </div>

    {/* Size — hidden on mobile */}
    <span className="hidden sm:block w-20 text-right text-xs text-[rgba(var(--text),0.4)] tabular-nums">
      {fmtSize(file.currentVersion.size)}
    </span>

    {/* Date — hidden on small screens */}
    <span className="hidden md:block w-36 text-right text-xs text-[rgba(var(--text),0.38)] tabular-nums">
      {smartDate(file.createdAt)}
    </span>

    {/* Action buttons */}
    <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <IconBtn icon={PencilLine} title="Rename" onClick={() => onRename(file)} size={13} />
      <IconBtn icon={Download} title="Download" onClick={() => onDownload(file.id, file.currentVersion.name)} size={13} />
      <IconBtn icon={Trash2} title="Delete" onClick={() => onDelete(file.id)} danger size={13} />
      <IconBtn icon={FolderOpen} title="Open" onClick={() => onOpen(file.id)} size={13} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────────────────────── */
const Files: React.FC = () => {
  const navigate = useNavigate();

  const {
    files,
    isLoading,
    isModalOpen,
    viewMode,
    filters,
    showFilter,
    setIsModalOpen,
    setViewMode,
    setShowFilter,
  } = useFiles();

  const { deleteFile, bulkDeleteFiles, downloadFile, renameFile } =
    useFileActions();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  const allSelected =
    files.length > 0 && selectedIds.length === files.length;

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.typeFilter !== "all" ||
    filters.extension ||
    filters.minSize ||
    filters.maxSize ||
    filters.dateFrom ||
    filters.dateTo
  );

  /* ── Selection ── */
  const toggleSelectAll = () =>
    setSelectedIds(allSelected ? [] : files.map((f) => f.id));

  const toggleSelect = (id: string, index: number, shiftKey: boolean) => {
    if (shiftKey && lastSelectedIndex !== null) {
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      setSelectedIds((prev) =>
        Array.from(new Set([...prev, ...files.slice(start, end + 1).map((f) => f.id)]))
      );
    } else {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    }
    setLastSelectedIndex(index);
  };

  /* ── Rename ── */
  const startRename = (file: CloudFile) => {
    setRenamingId(file.id);
    setEditName(file.currentVersion.name);
  };

  const submitRename = (id: string) => {
    if (!editName.trim()) return;
    if (files.some((f) => f.currentVersion.name === editName && f.id !== id)) {
      toast.error("A file with this name already exists.");
      return;
    }
    renameFile({ id, name: editName });
    setRenamingId(null);
  };

  /* ── Bulk ── */
  const handleBulkDownload = () =>
    selectedIds.forEach((id) => {
      const file = files.find((f) => f.id === id);
      if (file) downloadFile(id, file.currentVersion.name);
    });

  const handleBulkDelete = () => {
    bulkDeleteFiles(selectedIds);
    setSelectedIds([]);
  };

  /* ── Shared prop builder ── */
  const sharedProps = (file: CloudFile, index: number) => ({
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

  const typeFilters = [
    { key: "all", label: "All", icon: Layers },
    { key: "image", label: "Images", icon: ImageIcon },
    { key: "video", label: "Videos", icon: Film },
    { key: "document", label: "Docs", icon: FileText },
  ] as const;


  return (
    <div className="min-h-screen pb-24 px-4 sm:px-6 pt-10 max-w-[1400px] mx-auto relative">

      {/* ══════════════════════════════════════════════════════════════════
          Page header
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 min-w-0 mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--text))]">
          My{" "}
          <span className="text-[rgb(var(--primary))]">Files</span>
        </h1>
        {files.length > 0 && (
          <span className="
            text-[11px] font-bold uppercase tracking-widest
            px-2.5 py-0.5 rounded-full
            bg-[rgba(var(--primary),0.12)] text-[rgb(var(--primary))]
          ">
            {files.length}
          </span>
        )}
      </div>

      {/* Floating Upload Button: Always bottom-right, responsive FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          fixed bottom-6 right-6 z-50 shadow-lg
          bg-[rgb(var(--primary))] text-white rounded-full flex items-center justify-center
          transition-all duration-150
          p-4 lg:p-5
          hover:bg-[rgb(var(--primary-dark))]
        "
        aria-label="Upload file"
      >
        <Upload size={22} />
        <span className="hidden lg:inline ml-2 text-base font-semibold">Upload</span>
      </button>

      {/* ══════════════════════════════════════════════════════════════════
          Toolbar  (search · type pills · view/filter toggles)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-2 mb-4">

        {/* Search */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(var(--text),0.35)] pointer-events-none"
          />
          <input
            value={filters.search}
            onChange={(e) => filters.setSearch(e.target.value)}
            placeholder="Search files…"
            className="
              w-full pl-8 pr-8 py-2 rounded-xl text-sm
              border border-[rgba(var(--border-rgb),0.5)]
              bg-[rgba(var(--card),0.45)] text-[rgb(var(--text))]
              backdrop-blur-sm outline-none
              placeholder:text-[rgba(var(--text),0.3)]
              focus:border-[rgba(var(--primary),0.5)]
              focus:ring-2 focus:ring-[rgba(var(--primary),0.1)]
              transition-all duration-150
            "
          />
          {filters.search && (
            <button
              onClick={() => filters.setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[rgba(var(--text),0.4)] hover:text-[rgb(var(--danger))] transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Type filter pills */}
        <div className="flex gap-1.5 flex-wrap">
          {typeFilters.map(({ key, label, icon }) => (
            <TypePill
              key={key}
              label={label}
              icon={icon}
              active={filters.typeFilter === key}
              onClick={() => filters.setTypeFilter(key)}
            />
          ))}
        </div>

        {/* Right: filter toggle + view toggle */}
        <div className="flex items-center gap-1.5 ml-auto">
          <IconBtn
            icon={SlidersHorizontal}
            title="Advanced filters"
            active={showFilter}
            onClick={() => setShowFilter(!showFilter)}
          />
          <div className="w-px h-5 bg-[rgba(var(--border-rgb),0.4)] mx-0.5" />
          <IconBtn
            icon={List}
            title="List view"
            active={viewMode === "list"}
            onClick={() => setViewMode("list")}
          />
          <IconBtn
            icon={LayoutGrid}
            title="Grid view"
            active={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          Advanced filter panel
      ══════════════════════════════════════════════════════════════════ */}
      {showFilter && (
        <div className="
          mb-5 p-4 sm:p-5 rounded-2xl
          border border-[rgba(var(--border-rgb),0.4)]
          bg-[rgba(var(--card),0.55)] backdrop-blur-md
          grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4
          animate-fadeIn
        ">
          <FilterField label="Extension">
            <input
              className={fi}
              type="text"
              placeholder="pdf, png…"
              value={filters.extension}
              onChange={(e) => filters.setExtension(e.target.value)}
            />
          </FilterField>

          <FilterField label="Min size">
            <input
              className={fi}
              type="number"
              placeholder="bytes"
              onChange={(e) => filters.setMinSize(Number(e.target.value))}
            />
          </FilterField>

          <FilterField label="Max size">
            <input
              className={fi}
              type="number"
              placeholder="bytes"
              onChange={(e) => filters.setMaxSize(Number(e.target.value))}
            />
          </FilterField>

          <FilterField label="From date">
            <input
              className={fi}
              type="date"
              value={filters.dateFrom}
              onChange={(e) => filters.setDateFrom(e.target.value)}
            />
          </FilterField>

          <FilterField label="To date">
            <input
              className={fi}
              type="date"
              value={filters.dateTo}
              onChange={(e) => filters.setDateTo(e.target.value)}
            />
          </FilterField>

          <FilterField label="Sort by">
            <div className="flex flex-col gap-2">
              <select
                className={fi}
                value={filters.sortBy}
                onChange={(e) =>
                  filters.setSortBy(e.target.value as "newest" | "size" | "name")
                }
              >
                <option value="newest">Newest first</option>
                <option value="size">Largest first</option>
                <option value="name">Name A–Z</option>
              </select>

              <button
                disabled={!hasActiveFilters}
                onClick={() => {
                  filters.resetFilters();
                  setSelectedIds([]);
                }}
                className="
                  inline-flex items-center justify-center gap-1.5 w-full
                  px-3 py-1.5 rounded-lg text-xs font-semibold
                  border border-[rgba(var(--danger),0.35)] text-[rgb(var(--danger))]
                  bg-[rgba(var(--danger),0.06)] hover:bg-[rgba(var(--danger),0.12)]
                  disabled:opacity-30 disabled:pointer-events-none
                  transition-colors
                "
              >
                <RotateCcw size={11} />
                Reset filters
              </button>
            </div>
          </FilterField>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          Select-all strip
      ══════════════════════════════════════════════════════════════════ */}
      {files.length > 0 && (
        <div className="
          flex items-center justify-between px-3 py-2 mb-3 rounded-xl
          border border-[rgba(var(--primary),0.15)] bg-[rgba(var(--primary),0.04)]
        ">
          <span className="text-xs font-medium text-[rgba(var(--text),0.55)]">
            {selectedIds.length > 0
              ? `${selectedIds.length} of ${files.length} selected`
              : `${files.length} file${files.length !== 1 ? "s" : ""}`}
          </span>
          <button
            onClick={toggleSelectAll}
            className="text-xs font-bold text-[rgb(var(--primary))] hover:underline underline-offset-2 transition-all"
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          File content — empty / list / grid
      ══════════════════════════════════════════════════════════════════ */}
      {files.length === 0 ? (

        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[rgba(var(--primary),0.1)] flex items-center justify-center mb-1">
            <FolderOpen size={28} className="text-[rgb(var(--primary))]" />
          </div>
          <p className="text-base font-semibold text-[rgb(var(--text))]">
            No files yet
          </p>
          <p className="text-sm text-[rgba(var(--text),0.45)] max-w-[260px]">
            Upload your first file — images, docs, videos and more.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="
              mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl
              text-sm font-semibold bg-[rgb(var(--primary))] text-white border-none
              hover:bg-[rgb(var(--primary-dark))] hover:-translate-y-px
              hover:shadow-[0_6px_20px_rgba(var(--primary),0.35)]
              transition-all duration-150
            "
          >
            <Upload size={13} />
            Upload a file
          </button>
        </div>

      ) : viewMode === "list" ? (

        /* List view */
        <div className="flex flex-col gap-0.5">
          {/* Column headers — desktop only */}
          <div className="
            hidden md:flex items-center gap-3 px-3 pb-2 mb-0.5
            border-b border-[rgba(var(--border-rgb),0.3)]
            text-[10px] font-bold uppercase tracking-widest text-[rgba(var(--text),0.32)]
          ">
            <span className="w-4 flex-shrink-0" />
            <span className="w-8 flex-shrink-0" />
            <span className="flex-1">Name</span>
            <span className="hidden sm:block w-20 text-right">Type</span>
            <span className="hidden sm:block w-20 text-right">Size</span>
            <span className="hidden md:block w-36 text-right">Modified</span>
            <span className="w-[120px]" />
          </div>

          {files.map((file, i) => (
            <ListRow key={file.id} {...sharedProps(file, i)} />
          ))}
        </div>

      ) : (

        /* Grid view */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {files.map((file, i) => (
            <GridCard key={file.id} {...sharedProps(file, i)} />
          ))}
        </div>

      )}

      {/* ══════════════════════════════════════════════════════════════════
          Floating bulk-action bar
      ══════════════════════════════════════════════════════════════════ */}
      {selectedIds.length > 0 && (
        <div className="
          fixed bottom-6 left-1/2 -translate-x-1/2 z-50
          flex items-center gap-2 px-3 py-2 rounded-2xl
          bg-[rgba(var(--card),0.92)] backdrop-blur-xl
          border border-[rgba(var(--border-rgb),0.45)]
          shadow-[0_8px_32px_rgba(0,0,0,0.22)]
          animate-scaleIn whitespace-nowrap
        ">
          <span className="
            text-xs font-bold text-[rgb(var(--primary))]
            bg-[rgba(var(--primary),0.12)] px-2.5 py-1 rounded-lg tracking-wide
          ">
            {selectedIds.length} selected
          </span>

          <div className="w-px h-5 bg-[rgba(var(--border-rgb),0.4)]" />

          <button
            onClick={handleBulkDownload}
            className="
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-none
              text-xs font-semibold border border-[rgba(var(--border-rgb),0.45)]
              text-[rgba(var(--text),0.7)] hover:bg-[rgba(var(--card),0.8)]
              transition-colors
            "
          >
            <Download size={12} />
            Download
          </button>

          <button
            onClick={handleBulkDelete}
            className="
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-none
              text-xs font-semibold border border-[rgba(var(--danger),0.35)]
              text-[rgb(var(--danger))] bg-[rgba(var(--danger),0.06)]
              hover:bg-[rgba(var(--danger),0.12)] transition-colors
            "
          >
            <Trash2 size={12} />
            Delete
          </button>

          <button
            onClick={() => setSelectedIds([])}
            className="
              flex items-center justify-center w-7 h-7 rounded-lg border-none
              text-[rgba(var(--text),0.4)] hover:text-[rgba(var(--text),0.7)]
              transition-colors
            "
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Upload modal */}
      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Files;