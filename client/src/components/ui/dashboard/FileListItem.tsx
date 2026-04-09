import { Download, Trash2, FileIcon, Copy } from "lucide-react";
import { getFileConfig, formatDate } from "@/utils/helpers/files/fileUtils";

interface File {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  createdAt: string;
}

interface FileListItemProps {
  file: File;
  formatSize: (size: number) => string;
  onDownload: (id: string, name: string) => void;
  onDelete: {
    mutate: (id: string) => void;
  };
}

const FileListItem = ({ file, formatSize, onDownload, onDelete }: FileListItemProps) => {
  const fileConfig = getFileConfig(file.mimeType);
  const Icon = fileConfig?.Icon || FileIcon;

  // --- Creative Middle Truncation Logic ---
  const formatLongName = (name: string) => {
    if (name.length <= 32) return name;
    // Keep first 18 chars and last 10 chars (usually includes extension)
    return `${name.substring(0, 18)}...${name.substring(name.length - 10)}`;
  };

  const handleCopyName = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(file.name);
    // You could trigger a small "Copied!" toast here
  };

  return (
    <div
      onClick={() => onDownload(file.id, file.name)}
      className="
        group flex items-center justify-between
        px-4 py-3.5 gap-4
        rounded-2xl
        hover:bg-[rgb(var(--primary)/0.04)]
        border border-transparent hover:border-[rgb(var(--primary)/0.1)]
        transition-all duration-300
        cursor-pointer
      "
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Animated Icon Wrapper */}
        <div className={`
          shrink-0 h-12 w-12 flex items-center justify-center rounded-2xl border
          ${fileConfig?.bg || 'bg-[rgb(var(--text)/0.05)]'}
          ${fileConfig?.color || 'text-[rgb(var(--text)/0.5)]'}
          border-[rgb(var(--border)/0.5)]
          shadow-sm group-hover:shadow-md transition-all duration-500
          group-hover:-rotate-2 group-hover:scale-105
        `}>
          <Icon size={24} strokeWidth={1.5} />
        </div>

        {/* Info Area */}
        <div className="min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-[rgb(var(--text))] tracking-tight">
              {formatLongName(file.name)}
            </p>
            <button 
              onClick={handleCopyName}
              className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity p-1"
              title="Copy full name"
            >
              <Copy size={12} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[rgb(var(--text)/0.4)]">
            <span className="bg-[rgb(var(--text)/0.05)] px-1.5 py-0.5 rounded text-[rgb(var(--text)/0.6)]">
               {fileConfig?.label || "FILE"}
            </span>
            <span className="w-1 h-1 rounded-full bg-[rgb(var(--border))]" />
            <span>{file.size ? formatSize(file.size) : "—"}</span>
            <span className="w-1 h-1 rounded-full bg-[rgb(var(--border))]" />
            <span className="truncate">{formatDate(file.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Modern Floating Action Pills */}
      <div className="flex items-center gap-2 pl-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(file.id, file.name);
          }}
          className="
            flex items-center gap-2 px-3 py-2 rounded-xl
            bg-[rgb(var(--card))] border border-[rgb(var(--border))]
            text-[rgb(var(--text)/0.6)] hover:text-[rgb(var(--primary))]
            hover:border-[rgb(var(--primary)/0.3)] hover:shadow-lg
            transition-all duration-200 active:scale-90
          "
        >
          <Download size={15} strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase hidden md:block">Get</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete.mutate(file.id);
          }}
          className="
            p-2.5 rounded-xl
            text-[rgb(var(--destructive)/0.5)] hover:text-[rgb(var(--destructive))]
            hover:bg-[rgb(var(--destructive)/0.1)]
            transition-all duration-200 active:scale-90
          "
        >
          <Trash2 size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default FileListItem;