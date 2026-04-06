import React from "react";

const IconBtn = ({
    icon: Icon, title, onClick, active = false, danger = false,
}: {
    icon: React.ElementType; title: string; onClick: () => void;
    active?: boolean; danger?: boolean;
}) => (
    <button title={title} onClick={onClick}
        className={[
            "inline-flex items-center justify-center w-8 h-8 rounded-lg border flex-shrink-0 transition-all duration-150",
            danger
                ? "border-transparent text-[rgba(var(--text),0.35)] hover:border-[rgba(var(--danger),0.4)] hover:text-[rgb(var(--danger))] hover:bg-[rgba(var(--danger),0.07)]"
                : active
                    ? "border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.1)]"
                    : "border-transparent text-[rgba(var(--text),0.4)] hover:border-[rgba(var(--border-rgb),0.5)] hover:text-[rgb(var(--text))] hover:bg-[rgba(var(--card),0.6)]",
        ].join(" ")}>
        <Icon size={14} />
    </button>
);

export default IconBtn;
