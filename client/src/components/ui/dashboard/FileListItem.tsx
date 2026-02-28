import { Download, Trash2 } from "lucide-react";
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

const FileListItem = ({
  file,
  formatSize,
  onDownload,
  onDelete,
}: FileListItemProps) => {
  const fileConfig = getFileConfig(file.mimeType);
  const Icon = fileConfig?.Icon;
  const label = fileConfig?.label;

  return (
    <div
      onClick={() => onDownload(file.id, file.name)}
      className="
        group flex items-center justify-between
        px-4 py-3
        rounded-xl
        hover:bg-[rgb(var(--muted)/0.25)]
        transition-all duration-200
        cursor-pointer
      "
    >
      {/* Left Section */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Icon */}
        <div
          className={`
            p-2.5 rounded-xl border
            ${fileConfig.bg}
            ${fileConfig.color}
            border-[rgb(var(--border)/0.5)]
            transition-transform duration-200
            group-hover:scale-95
          `}
        >
          {Icon && <Icon size={20} />}
        </div>

        {/* File Info */}
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">
            {file.name}
          </p>

          <p className="text-xs text-[rgb(var(--text)/0.5)] truncate">
            {file.size ? formatSize(file.size) : "—"} • {label} •{" "}
            {formatDate(file.createdAt)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div
        className="
          flex gap-1
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
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
            hover:bg-[rgb(var(--background))]
            transition-colors
          "
        >
          <Download size={16} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete.mutate(file.id);
          }}
          className="
            p-2 rounded-lg
            text-red-500
            hover:bg-red-500/10
            transition-colors
          "
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default FileListItem;