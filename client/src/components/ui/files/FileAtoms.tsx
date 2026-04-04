import React from "react";
import { Check, X } from "lucide-react";
import { getFileConfig } from "@/utils/helpers/files/fileUtils";

/* ── Size System ───────────────────────────────────────────── */

const sizes = {
  sm: {
    btn: "w-7 h-7",
    icon: 12,
    input: "px-2 py-1 text-xs",
    gap: "gap-1.5",
  },
  md: {
    btn: "w-8 h-8",
    icon: 14,
    input: "px-3 py-2 text-sm",
    gap: "gap-2",
  },
  lg: {
    btn: "w-10 h-10",
    icon: 16,
    input: "px-4 py-2.5 text-base",
    gap: "gap-2.5",
  },
};

type Size = keyof typeof sizes;

/* ── Base Button ───────────────────────────────────────────── */

const baseBtn =
  "inline-flex items-center justify-center rounded-xl transition-all duration-200 ease-out active:scale-95";

/* ── RenameForm ───────────────────────────────────────────── */

interface RenameFormProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  size?: Size;
}

export const RenameForm: React.FC<RenameFormProps> = ({
  value,
  onChange,
  onSubmit,
  onCancel,
  size = "md",
}) => {
  const s = sizes[size];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={`flex items-center ${s.gap} w-full min-w-0`}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
        className={`
          flex-1 min-w-0 rounded-xl
          ${s.input}
          border border-[rgba(var(--border-rgb),0.5)]
          bg-[rgba(var(--bg),0.6)] backdrop-blur-md
          text-[rgb(var(--text))]
          outline-none
          transition-all duration-200

          focus:border-[rgba(var(--primary),0.6)]
          focus:ring-4 focus:ring-[rgba(var(--primary),0.12)]
          focus:bg-[rgba(var(--bg),0.9)]
        `}
      />

      {/* Confirm */}
      <button
        type="submit"
        className={`
          ${baseBtn} ${s.btn}
          group
          bg-gradient-to-br from-emerald-500/20 to-emerald-500/5
          border border-emerald-500/30
          text-emerald-500
          hover:scale-105
        `}
      >
        <Check
          size={s.icon}
          className="transition-transform group-hover:scale-110"
        />
      </button>

      {/* Cancel */}
      <button
        type="button"
        onClick={onCancel}
        className={`
          ${baseBtn} ${s.btn}
          group
          bg-[rgba(var(--danger),0.08)]
          border border-[rgba(var(--danger),0.25)]
          text-[rgb(var(--danger))]
          hover:scale-105
        `}
      >
        <X
          size={s.icon}
          className="transition-transform group-hover:scale-110"
        />
      </button>
    </form>
  );
};

/* ── FileIcon ───────────────────────────────────────────── */

interface FileIconProps {
  mimeType: string;
  size?: Size;
}

export const FileIcon: React.FC<FileIconProps> = ({
  mimeType,
  size = "md",
}) => {
  const { Icon, bg, color } = getFileConfig(mimeType);

  const map = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSize = {
    sm: 14,
    md: 18,
    lg: 20,
  };

  return (
    <div
      className={`
        ${map[size]}
        ${bg}
        rounded-2xl flex items-center justify-center
        shadow-sm transition-all duration-200
      `}
    >
      <Icon size={iconSize[size]} className={`${color}`} />
    </div>
  );
};

/* ── TypeBadge ───────────────────────────────────────────── */

export const TypeBadge: React.FC<{ mimeType: string }> = ({
  mimeType,
}) => {
  const { label, bg, color } = getFileConfig(mimeType);

  return (
    <span
      className={`
        ${bg} ${color}
        text-[clamp(9px,0.7vw,11px)]
        font-semibold uppercase tracking-wider
        px-[clamp(6px,0.6vw,10px)]
        py-[2px]
        rounded-full
      `}
    >
      {label}
    </span>
  );
};

/* ── IconBtn ───────────────────────────────────────────── */

interface IconBtnProps {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  size?: Size;
  children?: React.ReactNode;
  className?: string;
}

export const IconBtn: React.FC<IconBtnProps> = ({
  icon: Icon,
  title,
  onClick,
  active = false,
  danger = false,
  size = "md",
}) => {
  const s = sizes[size];

  return (
    <button
      title={title}
      onClick={onClick}
      className={[
        baseBtn,
        s.btn,
        "group border",

        danger
          ? "border-transparent text-[rgba(var(--text),0.35)] hover:text-[rgb(var(--danger))]"
          : active
          ? "border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.12)]"
          : "border-transparent text-[rgba(var(--text),0.4)] hover:text-[rgb(var(--text))]",
      ].join(" ")}
    >
      <Icon size={s.icon} />
    </button>
  );
};

/* ── TypePill ───────────────────────────────────────────── */

interface TypePillProps {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
  size?: Size;
  children?: React.ReactNode;
}

export const TypePill: React.FC<TypePillProps> = ({
  label,
  icon: Icon,
  active,
  onClick,
  size = "md",
}) => {
  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      className={[
        baseBtn,
        "group border whitespace-nowrap",
        s.input,

        active
          ? "border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.1)]"
          : "border-[rgba(var(--border-rgb),0.45)] text-[rgba(var(--text),0.5)]",
      ].join(" ")}
    >
      <Icon size={s.icon} />
      {label}
    </button>
  );
};