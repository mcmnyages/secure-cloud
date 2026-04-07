import React from "react";
import RenameForm from "./RenameForm";
import FileIcon from "./FileIcon";
import TypeBadge from "./TypeBadge";
import IconBtn from "./IconBtn";
import { CheckSquare, Square, PencilLine, Download, Trash2, FolderOpen} from "lucide-react";
import { filesize } from "filesize";

const fmtSize = (b: number) => filesize(b, { standard: "jedec" }) as string;
const smartDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const GridCard = ({
  file, selected, renaming, editName, index,
  onSelect, onRename, onEditName, onSubmitRename,
  onCancelRename, onDownload, onDelete, onOpen,
}: any) => {
  const { name, mimeType, size } = file.currentVersion;

  return (
    <div
      style={{ animationDelay: `${index * 30}ms` }}
      className={`
        group relative flex flex-col h-full p-3 sm:p-4 rounded-2xl border animate-scaleIn
        transition-all duration-300 ease-out select-none
        ${selected 
          ? "border-[rgba(var(--primary),0.5)] bg-[rgba(var(--primary),0.05)] shadow-lg shadow-[rgba(var(--primary),0.1)] translate-y-[-4px]" 
          : "border-[rgba(var(--border-rgb),0.5)] bg-[rgb(var(--card))] hover:border-[rgba(var(--border-rgb),0.8)] hover:shadow-xl hover:translate-y-[-2px]"
        }
      `}
    >
      {/* Selection Overlay/Checkbox - Larger Tap Target for Mobile */}
      <div className="absolute top-2 left-2 z-20">
        <button
          onClick={(e) => onSelect(file.id, index, (e as React.MouseEvent).shiftKey)}
          className={`
            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
            ${selected 
              ? "bg-[rgb(var(--primary))] text-white opacity-100 shadow-md" 
              : "bg-white/80 dark:bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 border border-[rgba(var(--border-rgb),0.5)]"
            }
          `}
        >
          {selected ? <CheckSquare size={16} strokeWidth={3} /> : <Square size={16} className="text-[rgba(var(--text),0.5)]" />}
        </button>
      </div>

      {/* Main Preview Area */}
      <div 
        className="flex-1 flex flex-col items-center justify-center pt-4 pb-2 cursor-pointer group/icon"
        onClick={() => !renaming && onOpen(file.id)}
      >
        <div className="transition-transform duration-300 group-hover/icon:scale-110 group-active:scale-95">
            {/* Responsive Icon Sizes */}
            <div className="hidden sm:block">
               <FileIcon mimeType={mimeType} size="lg" />
            </div>
            <div className="sm:hidden">
               <FileIcon mimeType={mimeType} size="md" />
            </div>
        </div>
      </div>

      {/* Info Block */}
      <div className="mt-auto space-y-1.5">
        {renaming ? (
          <div className="py-1">
            <RenameForm 
              value={editName} 
              onChange={onEditName} 
              onSubmit={() => onSubmitRename(file.id)} 
              onCancel={onCancelRename} 
            />
          </div>
        ) : (
          <>
            <h3 title={name} className="text-sm font-semibold truncate text-[rgb(var(--text))] text-center px-1">
              {name}
            </h3>
            
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <TypeBadge mimeType={mimeType} />
                <span className="text-[10px] font-medium text-[rgba(var(--text),0.4)] tabular-nums">
                  {fmtSize(size)}
                </span>
              </div>
              <p className="text-[10px] text-[rgba(var(--text),0.3)] font-medium">
                {smartDate(file.createdAt)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Action Bar - Context Sensitive */}
      <div className={`
        flex items-center justify-center gap-1 mt-4 pt-3 border-t border-[rgba(var(--border-rgb),0.2)]
        transition-all duration-200
        ${renaming ? "hidden" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"}
      `}>
        <IconBtn icon={FolderOpen} variant="primary" title="Open" onClick={() => onOpen(file.id)} />
        <IconBtn icon={Download} title="Download" onClick={() => onDownload(file.id, name)} />
        <IconBtn icon={PencilLine} title="Rename" onClick={() => onRename(file)} />
        <IconBtn icon={Trash2} variant="danger" title="Delete" onClick={() => onDelete(file.id)} />
      </div>
    </div>
  );
};

export default GridCard;