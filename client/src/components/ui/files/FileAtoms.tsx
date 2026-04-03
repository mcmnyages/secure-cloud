import React from "react";
import { Check, X } from "lucide-react";
import { getFileConfig } from "@/utils/helpers/files/fileUtils";

/* ── RenameForm ─────────────────────────────────────────────────────────── */
interface RenameFormProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const RenameForm: React.FC<RenameFormProps> = ({
  value, onChange, onSubmit, onCancel,
}) => (
  <form
    onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
    className="flex items-center gap-1.5 w-full min-w-0"
  >
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus
      className="flex-1 min-w-0 px-2.5 py-1.5 text-sm rounded-lg
        border border-[rgba(var(--primary),0.5)]
        bg-[rgba(var(--bg),0.8)] text-[rgb(var(--text))]
        outline-none ring-2 ring-[rgba(var(--primary),0.1)]"
    />
    <button
      type="submit"
      className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg
        bg-emerald-500/10 border border-emerald-500/30 text-emerald-500
        hover:bg-emerald-500/20 transition-colors"
    >
      <Check size={12} />
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg
        bg-[rgba(var(--danger),0.08)] border border-[rgba(var(--danger),0.3)]
        text-[rgb(var(--danger))] hover:bg-[rgba(var(--danger),0.15)] transition-colors"
    >
      <X size={12} />
    </button>
  </form>
);

/* ── FileIcon ───────────────────────────────────────────────────────────── */
interface FileIconProps {
  mimeType: string;
  size?: "sm" | "md";
}

export const FileIcon: React.FC<FileIconProps> = ({ mimeType, size = "md" }) => {
  const { Icon, bg, color } = getFileConfig(mimeType);
  const cls = size === "sm" ? "w-8 h-8 rounded-lg" : "w-10 h-10 rounded-xl";
  const sz  = size === "sm" ? 15 : 18;
  return (
    <div className={`${cls} ${bg} flex items-center justify-center flex-shrink-0`}>
      <Icon size={sz} className={color} />
    </div>
  );
};

/* ── TypeBadge ──────────────────────────────────────────────────────────── */
export const TypeBadge: React.FC<{ mimeType: string }> = ({ mimeType }) => {
  const { label, bg, color } = getFileConfig(mimeType);
  return (
    <span
      className={`${bg} ${color} text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md whitespace-nowrap`}
    >
      {label}
    </span>
  );
};

/* ── IconBtn ────────────────────────────────────────────────────────────── */
interface IconBtnProps {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}

export const IconBtn: React.FC<IconBtnProps> = ({
  icon: Icon, title, onClick, active = false, danger = false,
}) => (
  <button
    title={title}
    onClick={onClick}
    className={[
      "inline-flex items-center justify-center w-8 h-8 rounded-lg border flex-shrink-0 transition-all duration-150",
      danger
        ? "border-transparent text-[rgba(var(--text),0.35)] hover:border-[rgba(var(--danger),0.4)] hover:text-[rgb(var(--danger))] hover:bg-[rgba(var(--danger),0.07)]"
        : active
          ? "border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.1)]"
          : "border-transparent text-[rgba(var(--text),0.4)] hover:border-[rgba(var(--border-rgb),0.5)] hover:text-[rgb(var(--text))] hover:bg-[rgba(var(--card),0.6)]",
    ].join(" ")}
  >
    <Icon size={14} />
  </button>
);

/* ── TypePill ───────────────────────────────────────────────────────────── */
interface TypePillProps {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}

export const TypePill: React.FC<TypePillProps> = ({
  label, icon: Icon, active, onClick,
}) => (
  <button
    onClick={onClick}
    className={[
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 whitespace-nowrap",
      active
        ? "border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.08)]"
        : "border-[rgba(var(--border-rgb),0.45)] text-[rgba(var(--text),0.5)] hover:border-[rgba(var(--border-rgb),0.7)] hover:text-[rgb(var(--text))]",
    ].join(" ")}
  >
    <Icon size={12} />
    {label}
  </button>
);