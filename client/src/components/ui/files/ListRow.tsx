import React from "react";
import {
  Download,
  Trash2,
  PencilLine,
  FolderOpen,
  CheckSquare,
  Square,
} from "lucide-react";

import { FileIcon, TypeBadge, IconBtn, RenameForm } from "./Fileatoms";
import { formatDate, formatFileSize } from "@/utils/helpers/files/fileUtils";
import type { FileItemProps } from "@/types/fileTypes";

/* ── Size System ───────────────────────────────────────────── */

const sizes = {
  sm: {
    row: "px-2 py-2 gap-2",
    text: "text-xs",
    meta: "text-[10px]",
    icon: "sm",
  },
  md: {
    row: "px-[clamp(10px,1vw,14px)] py-[clamp(8px,1vh,12px)] gap-3",
    text: "text-sm",
    meta: "text-xs",
    icon: "sm",
  },
  lg: {
    row: "px-[clamp(14px,1.5vw,18px)] py-[clamp(10px,1.2vh,14px)] gap-4",
    text: "text-base",
    meta: "text-sm",
    icon: "md",
  },
};

type Size = keyof typeof sizes;

/* ── Component ───────────────────────────────────────────── */

const ListRow: React.FC<FileItemProps & { size?: Size }> = ({
  file,
  index,
  selected,
  renaming,
  editName,
  onSelect,
  onRename,
  onEditName,
  onSubmitRename,
  onCancelRename,
  onDownload,
  onDelete,
  onOpen,
  size = "md",
}) => {
  const s = sizes[size];

  return (
    <div
      style={{ animationDelay: `${index * 20}ms` }}
      className={[
        "group flex items-center rounded-xl border",
        "transition-all duration-200 ease-out animate-fadeIn",
        "bg-transparent",

        s.row,

        selected
          ? "border-[rgba(var(--primary),0.4)] bg-[rgba(var(--primary),0.05)]"
          : "border-transparent hover:bg-[rgba(var(--card),0.7)] hover:border-[rgba(var(--border-rgb),0.5)]",
      ].join(" ")}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => onSelect(file.id, index, e.shiftKey)}
        data-sel={selected}
        className="
          flex-shrink-0
          opacity-100 md:opacity-0
          md:group-hover:opacity-100
          transition-all duration-200
          hover:scale-110 active:scale-95
        "
      >
        {selected ? (
          <CheckSquare
            size={16}
            className="text-[rgb(var(--primary))]"
          />
        ) : (
          <Square
            size={16}
            className="text-[rgba(var(--text),0.35)]"
          />
        )}
      </button>

      {/* Icon */}
      <FileIcon
        mimeType={file.currentVersion.mimeType}
        size={s.icon as any}
      />

      {/* Name */}
      <div className="flex-1 min-w-0">
        {renaming ? (
          <RenameForm
            value={editName}
            onChange={onEditName}
            onSubmit={() => onSubmitRename(file.id)}
            onCancel={onCancelRename}
            size={size}
          />
        ) : (
          <span
            title={file.currentVersion.name}
            className={`
              block truncate font-medium
              text-[rgb(var(--text))]
              ${s.text}
            `}
          >
            {file.currentVersion.name}
          </span>
        )}
      </div>

      {/* Type */}
      <div className="hidden sm:flex min-w-[70px] justify-end">
        <TypeBadge mimeType={file.currentVersion.mimeType} />
      </div>

      {/* Size */}
      <span
        className={`
          hidden sm:block
          min-w-[80px] text-right tabular-nums
          text-[rgba(var(--text),0.45)]
          ${s.meta}
        `}
      >
        {formatFileSize(file.currentVersion.size)}
      </span>

      {/* Date */}
      <span
        className={`
          hidden md:block
          min-w-[140px] text-right
          text-[rgba(var(--text),0.35)]
          ${s.meta}
        `}
      >
        {formatDate(file.createdAt)}
      </span>

      {/* Actions */}
      <div
        className="
          flex gap-0.5 flex-shrink-0
          opacity-100 md:opacity-0
          md:group-hover:opacity-100
          translate-x-1 md:group-hover:translate-x-0
          transition-all duration-200
        "
      >
        <IconBtn
          icon={PencilLine}
          title="Rename"
          onClick={() => onRename(file)}
          size={size}
        />
        <IconBtn
          icon={Download}
          title="Download"
          onClick={() =>
            onDownload(file.id, file.currentVersion.name)
          }
          size={size}
        />
        <IconBtn
          icon={Trash2}
          title="Delete"
          onClick={() => onDelete(file.id)}
          danger
          size={size}
        />
        <IconBtn
          icon={FolderOpen}
          title="Open"
          onClick={() => onOpen(file.id)}
          size={size}
        />
      </div>
    </div>
  );
};

export default ListRow;