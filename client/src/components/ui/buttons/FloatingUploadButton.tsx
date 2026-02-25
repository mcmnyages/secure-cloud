// components/ui/dashboard/FloatingUploadButton.tsx
import { Plus } from 'lucide-react'

interface FloatingUploadButtonProps {
  onUpload: () => void
}

const FloatingUploadButton: React.FC<FloatingUploadButtonProps> = ({ onUpload }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 lg:hidden">
      <button
        onClick={onUpload}
        className="bg-[rgb(var(--primary))] p-4 rounded-full text-white shadow-lg shadow-[rgb(var(--primary)/0.3)] hover:scale-105 transition-transform flex items-center justify-center gap-2"
      >
        <Plus size={20} />
      </button>
    </div>
  )
}

export default FloatingUploadButton