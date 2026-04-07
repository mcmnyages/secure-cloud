import React from "react";

interface TypePillProps {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
  count?: number; // Added: showing counts is a massive UX win for filters
}

const TypePill: React.FC<TypePillProps> = ({ 
  label, 
  icon: Icon, 
  active, 
  onClick,
  count 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-3.5 py-2 rounded-full border 
        text-xs font-semibold whitespace-nowrap transition-all duration-200
        active:scale-95 select-none
        ${active
          ? "border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.1)] shadow-sm shadow-[rgba(var(--primary),0.1)]"
          : "border-[rgba(var(--border-rgb),0.6)] text-[rgba(var(--text),0.5)] bg-[rgb(var(--card))] hover:border-[rgba(var(--text),0.2)] hover:text-[rgb(var(--text))] hover:shadow-sm"
        }
      `}
    >
      <Icon 
        size={14} 
        strokeWidth={active ? 2.5 : 2} 
        className={`transition-transform duration-200 ${active ? "scale-110" : "opacity-70"}`} 
      />
      
      <span className="leading-none">{label}</span>

      {/* Optional Count Badge: Helps users see "What's inside" before clicking */}
      {count !== undefined && (
        <span className={`
          ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold
          ${active 
            ? "bg-[rgb(var(--primary))] text-white" 
            : "bg-[rgba(var(--text),0.05)] text-[rgba(var(--text),0.4)]"
          }
        `}>
          {count}
        </span>
      )}
    </button>
  );
};

export default TypePill;