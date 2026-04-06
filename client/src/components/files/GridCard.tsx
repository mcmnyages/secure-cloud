import React from "react";
import RenameForm from "./RenameForm";
import FileIcon from "./FileIcon";
import TypeBadge from "./TypeBadge";
import IconBtn from "./IconBtn";
import { CheckSquare, Square, PencilLine, Download, Trash2, FolderOpen } from "lucide-react";
import { filesize } from "filesize";

const fmtSize = (b: number) => filesize(b, { standard: "jedec" }) as string;
const smartDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString();
};

const GridCard = ({
    file, selected, renaming, editName, index,
    onSelect, onRename, onEditName, onSubmitRename,
    onCancelRename, onDownload, onDelete, onOpen,
}: any) => (
    <div
        style={{ animationDelay: `${index * 30}ms` }}
        className={[
            "group relative flex flex-col gap-3 p-4 rounded-xl border animate-scaleIn",
            "bg-[rgb(var(--card))] transition-all duration-200",
            selected
                ? "border-[rgba(var(--primary),0.5)] bg-[rgba(var(--primary),0.04)] shadow-[0_0_0_1px_rgba(var(--primary),0.15)]"
                : "border-[rgba(var(--border-rgb),0.5)] hover:border-[rgba(var(--border-rgb),0.8)] hover:shadow-md",
        ].join(" ")}
    >
        {/* Checkbox */}
        <button
            onClick={(e) => onSelect(file.id, index, (e as React.MouseEvent).shiftKey)}
            data-sel={selected}
            className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 data-[sel=true]:opacity-100 transition-opacity">
            {selected
                ? <CheckSquare size={15} className="text-[rgb(var(--primary))]" />
                : <Square size={15} className="text-[rgba(var(--text),0.35)]" />}
        </button>

        {/* Icon */}
        <div className="flex justify-center py-2">
            <FileIcon mimeType={file.currentVersion.mimeType} size="md" />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 min-w-0">
            {renaming ? (
                <RenameForm value={editName} onChange={onEditName}
                    onSubmit={() => onSubmitRename(file.id)} onCancel={onCancelRename} />
            ) : (
                <>
                    <p title={file.currentVersion.name}
                        className="text-sm font-medium truncate text-[rgb(var(--text))]">
                        {file.currentVersion.name}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <TypeBadge mimeType={file.currentVersion.mimeType} />
                        <span className="text-xs text-[rgba(var(--text),0.4)]">
                            {fmtSize(file.currentVersion.size)}
                        </span>
                    </div>
                    <p className="text-xs text-[rgba(var(--text),0.3)]">
                        {smartDate(file.createdAt)}
                    </p>
                </>
            )}
        </div>

        {/* Actions */}
        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <IconBtn icon={PencilLine} title="Rename" onClick={() => onRename(file)} />
            <IconBtn icon={Download} title="Download" onClick={() => onDownload(file.id, file.currentVersion.name)} />
            <IconBtn icon={Trash2} title="Delete" onClick={() => onDelete(file.id)} danger />
            <IconBtn icon={FolderOpen} title="Open" onClick={() => onOpen(file.id)} />
        </div>
    </div>
);

export default GridCard;
