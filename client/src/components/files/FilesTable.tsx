import { 
  FileText, 
  Trash2, 
  Download, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Music, 
  FileCode, 
  File, 
  Archive 
} from 'lucide-react';
import type { CloudFile } from '../../types/fileTypes'; // assuming your types are in a separate file

interface FilesTableProps {
  files: CloudFile[];
  onDelete: (id: string) => void;
  onDownload: (id: string, name: string) => void;
  onUpload: () => void;
}

// Map MIME types to icons and colors
const getFileIcon = (mimeType: string) => {
  if (!mimeType) return { Icon: File, color: 'text-[rgb(var(--text-muted))]', label: 'File' };

  if (mimeType.startsWith('image/')) return { Icon: ImageIcon, color: 'text-[rgb(var(--primary))]', label: 'Image' };
  if (mimeType.startsWith('video/')) return { Icon: Video, color: 'text-[rgb(var(--purple))]', label: 'Video' };
  if (mimeType.startsWith('audio/')) return { Icon: Music, color: 'text-[rgb(var(--pink))]', label: 'Audio' };
  if (mimeType.includes('pdf')) return { Icon: FileText, color: 'text-[rgb(var(--red))]', label: 'PDF' };
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
    return { Icon: Archive, color: 'text-[rgb(var(--orange))]', label: 'Archive' };
  }
  if (mimeType.includes('javascript') || mimeType.includes('typescript') || mimeType.includes('json') || mimeType.includes('html')) {
    return { Icon: FileCode, color: 'text-[rgb(var(--yellow))]', label: 'Code' };
  }

  return { Icon: File, color: 'text-[rgb(var(--text-muted))]', label: 'File' };
};

// Format file size nicely
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const FilesTable = ({ files, onDelete, onDownload, onUpload }: FilesTableProps) => {
  return (
    <div className="md:col-span-2 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[rgb(var(--border))] flex justify-between items-center">
        <h2 className="font-semibold text-lg text-[rgb(var(--text))]">Recent Files</h2>
        <button
          onClick={onUpload}
          className="flex items-center gap-2 bg-[rgb(var(--primary))] text-white px-4 py-2 rounded-lg hover:bg-[rgb(var(--primary-dark))] transition shadow-sm"
        >
          <Upload size={18} />
          Upload
        </button>
      </div>

      {files.length === 0 ? (
        <div className="p-10 text-center text-[rgb(var(--text-muted))] flex flex-col items-center gap-2">
          <File size={40} className="opacity-20" />
          <p>No files uploaded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[rgb(var(--border)/0.2)] text-[rgb(var(--text-muted))] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Kind</th>
                <th className="px-6 py-4 font-semibold">Size</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[rgb(var(--border)/0.2)]">
              {files.map((file) => {
                const { Icon, color, label } = getFileIcon(file.mimeType);

                return (
                  <tr key={file.id} className="hover:bg-[rgb(var(--primary)/0.1)] transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Icon size={20} className={`${color} shrink-0`} />
                      <span className="font-medium text-[rgb(var(--text))] truncate max-w-[180px] md:max-w-xs" title={file.name}>
                        {file.name}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-[10px] uppercase font-bold px-2 py-1 bg-[rgb(var(--border)/0.2)] text-[rgb(var(--text-muted))] rounded-md">
                        {label}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-[rgb(var(--text-muted))]">
                      {formatFileSize(file.size)}
                    </td>

                    <td className="px-6 py-4 text-right space-x-1">
                      <button
                        onClick={() => onDownload(file.id, file.name)}
                        className="p-2 text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary)/0.1)] rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(file.id)}
                        className="p-2 text-[rgb(var(--red))] hover:bg-[rgb(var(--red)/0.1)] rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FilesTable;
