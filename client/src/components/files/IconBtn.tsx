import React from "react";

// Define the available "moods" for your buttons
type ButtonVariant = "default" | "primary" | "danger" | "success" | "warning";

interface IconBtnProps {
  icon: React.ElementType;
  title: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: ButtonVariant;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

const IconBtn: React.FC<IconBtnProps> = ({
  icon: Icon,
  title,
  onClick,
  variant = "default",
  isActive = false,
  disabled = false,
  className = "",
}) => {
  
  // Mapping variants to your RGB theme variables
  const variants = {
    default: {
      text: "text-[rgba(var(--text),0.45)]",
      hover: "hover:text-[rgb(var(--text))] hover:bg-[rgba(var(--text),0.05)] hover:border-[rgba(var(--border-rgb),0.6)]",
      active: "text-[rgb(var(--text))] bg-[rgba(var(--text),0.1)] border-[rgba(var(--text),0.2)]",
    },
    primary: {
      text: "text-[rgb(var(--primary))]",
      hover: "hover:bg-[rgba(var(--primary),0.1)] hover:border-[rgba(var(--primary),0.4)]",
      active: "bg-[rgba(var(--primary),0.15)] border-[rgba(var(--primary),0.5)]",
    },
    danger: {
      text: "text-[rgb(var(--danger))]",
      hover: "hover:bg-[rgba(var(--danger),0.1)] hover:border-[rgba(var(--danger),0.4)]",
      active: "bg-[rgba(var(--danger),0.15)] border-[rgba(var(--danger),0.5)]",
    },
    success: {
      // Assuming you have a --success variable in your theme
      text: "text-[rgb(var(--success,34,197,94))]", 
      hover: "hover:bg-[rgba(var(--success,34,197,94),0.1)] hover:border-[rgba(var(--success,34,197,94),0.4)]",
      active: "bg-[rgba(var(--success),0.15)] border-[rgba(var(--success),0.5)]",
    },
    warning: {
      text: "text-[rgb(var(--warning,245,158,11))]",
      hover: "hover:bg-[rgba(var(--warning),0.1)] hover:border-[rgba(var(--warning),0.4)]",
      active: "bg-[rgba(var(--warning),0.15)] border-[rgba(var(--warning),0.5)]",
    }
  };

  const currentVariant = variants[variant];

  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick(e);
      }}
      className={`
        relative inline-flex items-center justify-center 
        w-8 h-8 rounded-lg border border-transparent
        transition-all duration-200 ease-in-out
        active:scale-90 disabled:opacity-30 disabled:pointer-events-none
        ${currentVariant.text}
        ${isActive ? currentVariant.active : currentVariant.hover}
        ${className}
      `}
    >
      <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
    </button>
  );
};

export default IconBtn;