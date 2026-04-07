import React from "react";
import { getFileConfig } from "@/utils/helpers/files/fileUtils";

interface TypeBadgeProps {
  mimeType: string;
  showIcon?: boolean; // Added for extra visual cueing
  className?: string;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ 
  mimeType, 
  showIcon = false,
  className = "" 
}) => {
  const config = getFileConfig(mimeType) || {
    label: "File",
    bg: "bg-[rgba(var(--text),0.05)]",
    color: "text-[rgba(var(--text),0.45)]",
    Icon: null
  };

  const { label, bg, color, Icon } = config;

  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 
        ${bg} ${color} 
        text-[9px] sm:text-[10px] font-bold uppercase tracking-widest 
        px-2 py-0.5 rounded-md whitespace-nowrap
        border border-black/5 dark:border-white/5
        transition-all duration-200 hover:brightness-95
        ${className}
      `}
    >
      {/* Optional Icon for high-density responsiveness */}
      {showIcon && Icon && (
        <Icon size={10} strokeWidth={3} className="opacity-80" />
      )}
      
      <span className="leading-none mt-[0.5px]">
        {label}
      </span>
    </span>
  );
};

export default TypeBadge;