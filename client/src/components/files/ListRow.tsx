import React from "react";
import RenameForm from "./RenameForm";
import FileIcon from "./FileIcon";
import TypeBadge from "./TypeBadge";
import IconBtn from "./IconBtn";
import { CheckSquare, Square, PencilLine, Download, Trash2, FolderOpen } from "lucide-react";
import { filesize } from "filesize";

const fmtSize = (b: number) => filesize(b, { standard: "jedec" }) as string;

const smartDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const ListRow = ({
  file, selected, renaming, editName, index,
  onSelect, onRename, onEditName, onSubmitRename,
  onCancelRename, onDownload, onDelete, onOpen,
}: any) => {
  const { name, mimeType, size } = file.currentVersion;

  return (
    <div
      style={{ animationDelay: `${index * 25}ms` }}
      className={`
        group relative flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:py-2.5 rounded-2xl border animate-fadeIn 
        transition-all duration-200 ease-out
        ${selected 
          ? "border-[rgba(var(--primary),0.4)] bg-[rgba(var(--primary),0.04)] shadow-sm" 
          : "border-transparent hover:bg-[rgb(var(--card))] hover:border-[rgba(var(--border-rgb),0.5)]"
        }
      `}
    >
      {/* TOP SECTION: Icon, Name, and Checkbox */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Checkbox: Always visible on mobile if selected, otherwise hover-only on desktop */}
        <button
          onClick={(e) => onSelect(file.id, index, (e as React.MouseEvent).shiftKey)}
          className={`
            flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all
            ${selected ? "opacity-100" : "opacity-0 sm:group-hover:opacity-100 hover:bg-[rgba(var(--text),0.05)]"}
          `}
        >
          {selected ? (
            <CheckSquare size={18} strokeWidth={2.5} className="text-[rgb(var(--primary))]" />
          ) : (
            <Square size={18} strokeWidth={2} className="text-[rgba(var(--text),0.3)]" />
          )}
        </button>

        <div className="flex flex-1 items-center gap-3 min-w-0 cursor-pointer" onClick={() => !renaming && onOpen(file.id)}>
          <FileIcon mimeType={mimeType} size="sm" />
          
          <div className="flex-1 min-w-0">
            {renaming ? (
              <div onClick={(e) => e.stopPropagation()}>
                <RenameForm value={editName} onChange={onEditName} onSubmit={() => onSubmitRename(file.id)} onCancel={onCancelRename} />
              </div>
            ) : (
              <div className="flex flex-col sm:block">
                <span className="text-sm font-semibold sm:font-medium truncate text-[rgb(var(--text))] leading-tight">
                  {name}
                </span>
                {/* Mobile Meta: Visible only on small screens */}
                <div className="flex items-center gap-2 mt-0.5 sm:hidden text-[10px] font-medium text-[rgba(var(--text),0.45)] uppercase tracking-wider">
                   <span>{fmtSize(size)}</span>
                   <span className="w-1 h-1 rounded-full bg-[rgba(var(--text),0.2)]" />
                   <span>{smartDate(file.createdAt)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION: Desktop Desktop Columns */}
      <div className="hidden sm:flex flex-1 items-center justify-end gap-4 md:gap-8 ml-auto">
        <div className="hidden lg:block">
            <TypeBadge mimeType={mimeType} />
        </div>
        
        <span className="w-16 text-right text-xs font-medium text-[rgba(var(--text),0.5)] tabular-nums">
          {fmtSize(size)}
        </span>

        <span className="hidden md:block w-24 text-right text-xs text-[rgba(var(--text),0.4)]">
          {smartDate(file.createdAt)}
        </span>
      </div>

      {/* BOTTOM SECTION: Actions (Sticky to right on desktop, Full width flex on mobile) */}
      <div className={`
        flex items-center justify-end gap-1 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgba(var(--border-rgb),0.2)]
        transition-all duration-200
        ${renaming ? "hidden" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"}
      `}>
        <IconBtn icon={FolderOpen} title="Open" onClick={() => onOpen(file.id)} />
        <IconBtn icon={Download} title="Download" onClick={() => onDownload(file.id, name)} />
        <IconBtn icon={PencilLine} title="Rename" onClick={() => onRename(file)} />
        <div className="mx-1 w-px h-4 bg-[rgba(var(--border-rgb),0.3)] hidden sm:block" />
        <IconBtn icon={Trash2} title="Delete" onClick={() => onDelete(file.id)} variant="danger" />
      </div>
    </div>
  );
};

export default ListRow;