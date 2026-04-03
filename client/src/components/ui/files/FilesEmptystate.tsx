import React from "react";
import { FolderOpen, Upload } from "lucide-react";

interface FilesEmptyStateProps {
  onUpload: () => void;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: {
    container: "py-16 gap-2",
    iconWrap: "w-12 h-12",
    icon: 22,
    title: "text-sm",
    desc: "text-xs max-w-[200px]",
    btn: "px-3 py-1.5 text-xs",
  },
  md: {
    container: "py-[clamp(80px,12vh,120px)] gap-3",
    iconWrap: "w-14 h-14",
    icon: 26,
    title: "text-base",
    desc: "text-sm max-w-[240px]",
    btn: "px-4 py-2 text-sm",
  },
  lg: {
    container: "py-[clamp(100px,14vh,160px)] gap-4",
    iconWrap: "w-16 h-16",
    icon: 30,
    title: "text-lg",
    desc: "text-base max-w-[280px]",
    btn: "px-5 py-2.5 text-sm",
  },
};

const FilesEmptyState: React.FC<FilesEmptyStateProps> = ({
  onUpload,
  size = "md",
}) => {
  const s = sizeMap[size];

  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center
        ${s.container}
        px-4
        animate-fadeIn
      `}
    >
      {/* Icon */}
      <div
        className={`
          ${s.iconWrap}
          relative flex items-center justify-center rounded-2xl
          bg-[rgba(var(--primary),0.08)]
          backdrop-blur-md
          shadow-sm
        `}
      >
        {/* subtle glow */}
        <div className="absolute inset-0 rounded-2xl bg-[rgba(var(--primary),0.12)] blur-xl opacity-40" />

        <FolderOpen
          size={s.icon}
          className="relative text-[rgb(var(--primary))] drop-shadow-sm"
        />
      </div>

      {/* Title */}
      <p
        className={`
          ${s.title}
          font-semibold
          text-[rgb(var(--text))]
        `}
      >
        No files yet
      </p>

      {/* Description */}
      <p
        className={`
          ${s.desc}
          text-[rgba(var(--text),0.45)]
        `}
      >
        Upload your first file to get started.
      </p>

      {/* CTA */}
      <button
        onClick={onUpload}
        className={`
          group mt-2 inline-flex items-center gap-2
          ${s.btn}
          rounded-xl font-medium

          bg-gradient-to-br
          from-[rgb(var(--primary))]
          to-[rgba(var(--primary),0.85)]
          text-white

          shadow-[0_6px_20px_rgba(var(--primary),0.25)]
          transition-all duration-200 ease-out

          hover:shadow-[0_10px_30px_rgba(var(--primary),0.35)]
          hover:-translate-y-0.5
          active:translate-y-0 active:scale-95
        `}
      >
        <Upload
          size={14}
          className="transition-transform group-hover:scale-110"
        />
        Upload file
      </button>
    </div>
  );
};

export default FilesEmptyState;