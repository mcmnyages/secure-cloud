import React from "react";
import { Download, Trash2 } from 'lucide-react'
import { getFileConfig } from '@/utils/helpers/files/fileUtils'


interface FileGridItemProps {
  file: any;
  formatSize: (size: number) => string;
  onDownload: (id: string, name: string) => void;
  onDelete: any;
}


const FileGridItem = ({ file, onDownload, onDelete }: FileGridItemProps) => (
  <div className="group relative bg-[rgb(var(--card))] border border-[rgb(var(--border))] p-4 rounded-2xl hover:border-[rgb(var(--primary)/0.5)] transition-all">
    <div className="aspect-square mb-4 bg-[rgb(var(--background))] rounded-xl flex items-center justify-center text-[rgb(var(--primary))] group-hover:scale-95 transition-transform">
      {React.createElement(getFileConfig(file.mimeType, 32)?.Icon)}
    </div>
    <p className="text-sm font-medium truncate mb-1">{file.name}</p>
    <div className="flex items-center justify-between">
       <span className="text-[10px] text-[rgb(var(--text)/0.4)] uppercase font-bold">{file.mimeType.split('/')[1] || 'File'}</span>
       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
         <button onClick={() => onDownload(file.id, file.name)} className="p-1.5 hover:bg-[rgb(var(--muted)/0.5)] rounded-md"><Download size={14}/></button>
         <button onClick={() => onDelete.mutate(file.id)} className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-md"><Trash2 size={14}/></button>
       </div>
    </div>
  </div>
)

export default FileGridItem

