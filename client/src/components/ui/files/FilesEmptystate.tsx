import React from "react";
import { FolderOpen, Upload } from "lucide-react";

interface FilesEmptyStateProps {
  onUpload: () => void;
}

const FilesEmptyState: React.FC<FilesEmptyStateProps> = ({ onUpload }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
    <div className="w-14 h-14 rounded-2xl bg-[rgba(var(--primary),0.08)] flex items-center justify-center">
      <FolderOpen size={26} className="text-[rgb(var(--primary))]" />
    </div>
    <p className="text-sm font-semibold text-[rgb(var(--text))]">No files yet</p>
    <p className="text-sm text-[rgba(var(--text),0.4)] max-w-[220px]">
      Upload your first file to get started.
    </p>
    <button
      onClick={onUpload}
      className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg
        text-sm font-medium bg-[rgb(var(--primary))] text-white border-none
        hover:bg-[rgb(var(--primary-dark))] hover:-translate-y-px
        hover:shadow-[0_4px_16px_rgba(var(--primary),0.3)]
        transition-all duration-150"
    >
      <Upload size={14} /> Upload
    </button>
  </div>
);

export default FilesEmptyState;