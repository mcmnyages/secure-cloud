import React from "react";
import { Upload } from "lucide-react";

interface UploadFabButtonProps {
    onClick: () => void;
}

const UploadFabButton: React.FC<UploadFabButtonProps> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="
      fixed bottom-6 right-6 z-50 shadow-lg
      bg-[rgb(var(--primary))] text-white rounded-full flex items-center justify-center
      transition-all duration-150
      p-4 lg:p-5
      hover:bg-[rgb(var(--primary-dark))]
    "
        aria-label="Upload file"
    >
        <Upload size={22} />
        <span className="hidden lg:inline ml-2 text-base font-semibold">Upload</span>
    </button>
);

export default UploadFabButton;