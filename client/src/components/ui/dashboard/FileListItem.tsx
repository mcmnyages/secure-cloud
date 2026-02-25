import { Download, Trash2 } from 'lucide-react'
import { getFileConfig } from '@/utils/helpers/files/fileUtils'
interface FileListItemProps {
  file: any;
  formatSize: (size: number) => string;
  onDownload: (id: string, name: string) => void;
  onDelete: any;
}

const FileListItem = ({ file, formatSize, onDownload, onDelete }: FileListItemProps) => {
  const fileConfig = getFileConfig(file.mimeType)
  const Icon = fileConfig?.Icon

  return (
  <div className="group flex items-center justify-between p-4 hover:bg-[rgb(var(--muted)/0.2)] transition-colors">
    <div className="flex items-center gap-4 min-w-0">
      <div className="p-2.5 bg-[rgb(var(--background))] border border-[rgb(var(--border))] rounded-xl text-[rgb(var(--primary))] group-hover:bg-[rgb(var(--card))] transition-colors">
        {Icon && <Icon size={20} />}
      </div>
      <div className="truncate">
        <p className="text-sm font-semibold truncate">{file.name}</p>
        <p className="text-xs text-[rgb(var(--text)/0.5)]">{formatSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
    <div className="flex gap-1">
      <button onClick={() => onDownload(file.id, file.name)} className="p-2 hover:bg-[rgb(var(--background))] rounded-lg transition-colors"><Download size={16}/></button>
      <button onClick={() => onDelete.mutate(file.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
    </div>
  </div>
  )
}

export default FileListItem