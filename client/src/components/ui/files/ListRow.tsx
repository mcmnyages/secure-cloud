import React from "react";
import { Download, Trash2, PencilLine, FolderOpen, CheckSquare, Square } from "lucide-react";
import { FileIcon, TypeBadge, IconBtn, RenameForm } from "./Fileatoms";
import {formatDate,formatFileSize } from "@/utils/helpers/files/fileUtils";
import type { FileItemProps } from "@/types/fileTypes";

const ListRow: React.FC<FileItemProps> = ({
  file, index, selected, renaming, editName,
  onSelect, onRename, onEditName, onSubmitRename, onCancelRename,
  onDownload, onDelete, onOpen,
}) => (
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
      onClick={(e) => onSelect(file.id, index, e.shiftKey)}
      data-sel={selected}
      className="flex-shrink-0 opacity-0 group-hover:opacity-100 data-[sel=true]:opacity-100 transition-opacity"
    >
      {selected
        ? <CheckSquare size={15} className="text-[rgb(var(--primary))]" />
        : <Square      size={15} className="text-[rgba(var(--text),0.3)]" />}
    </button>

    <FileIcon mimeType={file.currentVersion.mimeType} size="sm" />

    {/* Name */}
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
          className="block text-sm font-medium truncate text-[rgb(var(--text))]"
        >
          {file.currentVersion.name}
        </span>
      )}
    </div>

    <div className="hidden sm:block flex-shrink-0">
      <TypeBadge mimeType={file.currentVersion.mimeType} />
    </div>

    <span className="hidden sm:block w-20 text-right text-xs text-[rgba(var(--text),0.4)] tabular-nums flex-shrink-0">
      {formatFileSize(file.currentVersion.size)}
    </span>

    <span className="hidden md:block w-36 text-right text-xs text-[rgba(var(--text),0.35)] flex-shrink-0">
      {formatDate(file.createdAt)}
    </span>

    {/* Actions */}
    <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      <IconBtn icon={PencilLine} title="Rename"   onClick={() => onRename(file)} />
      <IconBtn icon={Download}   title="Download" onClick={() => onDownload(file.id, file.currentVersion.name)} />
      <IconBtn icon={Trash2}     title="Delete"   onClick={() => onDelete(file.id)} danger />
      <IconBtn icon={FolderOpen} title="Open"     onClick={() => onOpen(file.id)} />
    </div>
  </div>
);

export default ListRow;