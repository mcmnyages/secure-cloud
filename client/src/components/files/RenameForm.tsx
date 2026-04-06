
import { Check, X } from "lucide-react";

const RenameForm = ({
    value, onChange, onSubmit, onCancel,
}: {
    value: string; onChange: (v: string) => void;
    onSubmit: () => void; onCancel: () => void;
}) => (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        className="flex items-center gap-1.5 w-full min-w-0">
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
            className="flex-1 min-w-0 px-2.5 py-1.5 text-sm rounded-lg
        border border-[rgba(var(--primary),0.5)]
        bg-[rgba(var(--bg),0.8)] text-[rgb(var(--text))]
        outline-none ring-2 ring-[rgba(var(--primary),0.1)]"
        />
        <button type="submit"
            className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg
        bg-emerald-500/10 border border-emerald-500/30 text-emerald-500
        hover:bg-emerald-500/20 transition-colors">
            <Check size={12} />
        </button>
        <button type="button" onClick={onCancel}
            className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg
        bg-[rgba(var(--danger),0.08)] border border-[rgba(var(--danger),0.3)]
        text-[rgb(var(--danger))] hover:bg-[rgba(var(--danger),0.15)] transition-colors">
            <X size={12} />
        </button>
    </form>
);

export default RenameForm;
