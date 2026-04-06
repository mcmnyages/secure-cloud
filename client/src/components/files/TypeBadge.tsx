
import { getFileConfig } from "@/utils/helpers/files/fileUtils";

const TypeBadge = ({ mimeType }: { mimeType: string }) => {
    const { label, bg, color } = getFileConfig(mimeType);
    return (
        <span className={`${bg} ${color} text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md whitespace-nowrap`}>
            {label}
        </span>
    );
};

export default TypeBadge;
