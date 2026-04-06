import React from "react";

const TypePill = ({
    label, icon: Icon, active, onClick,
}: {
    label: string; icon: React.ElementType; active: boolean; onClick: () => void;
}) => (
    <button onClick={onClick}
        className={[
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 whitespace-nowrap",
            active
                ? "border-[rgba(var(--primary),0.5)] text-[rgb(var(--primary))] bg-[rgba(var(--primary),0.08)]"
                : "border-[rgba(var(--border-rgb),0.45)] text-[rgba(var(--text),0.5)] hover:border-[rgba(var(--border-rgb),0.7)] hover:text-[rgb(var(--text))]",
        ].join(" ")}>
        <Icon size={12} />
        {label}
    </button>
);

export default TypePill;
