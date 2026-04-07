import React from "react";
import { FileQuestion } from "lucide-react";
import { getFileConfig } from "@/utils/helpers/files/fileUtils";

interface FileIconProps {
  mimeType: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ 
  mimeType, 
  size = "md", 
  className = "" 
}) => {
  // Get config with a fallback safety check
  const config = getFileConfig(mimeType) || {
    Icon: FileQuestion,
    bg: "bg-[rgba(var(--text),0.05)]",
    color: "text-[rgba(var(--text),0.4)]",
  };

  const { Icon, bg, color } = config;

  // Responsive and fluid sizing map
  const sizeMap = {
    xs: { container: "w-7 h-7 rounded-md", icon: 13 },
    sm: { container: "w-9 h-9 rounded-lg", icon: 16 },
    md: { container: "w-11 h-11 rounded-xl", icon: 20 },
    lg: { container: "w-14 h-14 rounded-2xl", icon: 26 },
  };

  const currentSize = sizeMap[size];

  return (
    <div 
      className={`
        ${currentSize.container} 
        ${bg} 
        flex items-center justify-center flex-shrink-0 
        transition-transform duration-200 group-hover:scale-105
        relative overflow-hidden
        ${className}
      `}
      aria-hidden="true"
    >
      {/* Subtle "Gloss" overlay for a premium feel */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />
      
      {/* Border ring to define shape on backgrounds similar to the icon color */}
      <div className="absolute inset-0 rounded-[inherit] border border-black/5 dark:border-white/5" />

      <Icon 
        size={currentSize.icon} 
        className={`${color} drop-shadow-sm`} 
        strokeWidth={2.2}
      />
    </div>
  );
};

export default FileIcon;