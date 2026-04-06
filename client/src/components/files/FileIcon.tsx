
import { getFileConfig } from "@/utils/helpers/files/fileUtils";

const FileIcon = ({
    mimeType, size = "md",
}: { mimeType: string; size?: "sm" | "md" }) => {
    const { Icon, bg, color } = getFileConfig(mimeType);
    const cls = size === "sm"
        ? "w-8 h-8 rounded-lg"
        : "w-10 h-10 rounded-xl";
    const sz = size === "sm" ? 15 : 18;
    return (
        <div className={`${cls} ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={sz} className={color} />
        </div>
    );
};

export default FileIcon;
