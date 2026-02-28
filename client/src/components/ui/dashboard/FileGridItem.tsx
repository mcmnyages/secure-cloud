import { Download, Trash2 } from "lucide-react";
import { getFileConfig, formatDate } from "@/utils/helpers/files/fileUtils";

interface File {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  createdAt: string;
}

interface FileGridItemProps {
  file: File;
  formatSize?: (size: number) => string;
  onDownload: (id: string, name: string) => void;
  onDelete: {
    mutate: (id: string) => void;
  };
}

const FileGridItem = ({
  file,
  formatSize,
  onDownload,
  onDelete,
}: FileGridItemProps) => {
  const config = getFileConfig(file.mimeType);
  const Icon = config?.Icon;
  const label = config?.label;

  return (
    <div
      onClick={() => onDownload(file.id, file.name)}
      className="
        group relative overflow-hidden
        rounded-2xl p-4
        bg-gradient-to-b from-[rgb(var(--card))] to-[rgb(var(--card)/0.9)]
        border border-[rgb(var(--border)/0.6)]
        backdrop-blur-xl
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl
        hover:border-[rgb(var(--primary)/0.4)]
        cursor-pointer
      "
    >
      {/* Floating Actions */}
      <div
        className="
          absolute top-3 right-3 flex gap-1
          opacity-0 translate-y-1
          group-hover:opacity-100 group-hover:translate-y-0
          transition-all duration-200
        "
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(file.id, file.name);
          }}
          className="
            p-2 rounded-lg
            bg-[rgb(var(--background)/0.7)]
            backdrop-blur-md
            hover:bg-[rgb(var(--muted)/0.6)]
            transition-colors
          "
        >
          <Download size={14} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete.mutate(file.id);
          }}
          className="
            p-2 rounded-lg
            bg-[rgb(var(--background)/0.7)]
            backdrop-blur-md
            text-red-500
            hover:bg-red-500/10
            transition-colors
          "
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* File Icon */}
      <div
        className={`
          aspect-square mb-4
          rounded-xl
          flex items-center justify-center
          ${config.bg}
          ${config.color}
          transition-transform duration-300
          group-hover:scale-95
        `}
      >
        {Icon && <Icon size={34} />}
      </div>

      {/* File Info */}
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold truncate">
          {file.name}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[rgb(var(--text)/0.5)]">
          {file.size && formatSize && (
            <>
              <span>{formatSize(file.size)}</span>
              <span className="w-1 h-1 rounded-full bg-[rgb(var(--text)/0.3)]" />
            </>
          )}

          <span>{label}</span>

          <span className="w-1 h-1 rounded-full bg-[rgb(var(--text)/0.3)]" />

          <span>{formatDate(file.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default FileGridItem;