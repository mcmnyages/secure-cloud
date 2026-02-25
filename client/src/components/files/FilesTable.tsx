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
import type { CloudFile } from '../../types/fileTypes';

interface FilesTableProps {
  files: CloudFile[];
  onDelete: (id: string) => void;
  onDownload: (id: string, name: string) => void;
  onUpload: () => void;
}

// Map MIME types to icons, colors, and badge variables
const getFileIcon = (mimeType: string) => {
  if (!mimeType) return { Icon: File, color: 'text-[rgb(var(--text-muted))]', label: 'File', badge: '--badge-file' };
  if (mimeType.startsWith('image/')) return { Icon: ImageIcon, color: 'text-[rgb(var(--primary))]', label: 'Image', badge: '--badge-image' };
  if (mimeType.startsWith('video/')) return { Icon: Video, color: 'text-[rgb(var(--purple))]', label: 'Video', badge: '--badge-video' };
  if (mimeType.startsWith('audio/')) return { Icon: Music, color: 'text-[rgb(var(--pink))]', label: 'Audio', badge: '--badge-audio' };
  if (mimeType.includes('pdf')) return { Icon: FileText, color: 'text-[rgb(var(--danger))]', label: 'PDF', badge: '--badge-pdf' };
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return { Icon: Archive, color: 'text-[rgb(var(--orange))]', label: 'Archive', badge: '--badge-archive' };
  if (mimeType.includes('javascript') || mimeType.includes('typescript') || mimeType.includes('json') || mimeType.includes('html')) return { Icon: FileCode, color: 'text-[rgb(var(--yellow))]', label: 'Code', badge: '--badge-code' };
  return { Icon: File, color: 'text-[rgb(var(--text-muted))]', label: 'File', badge: '--badge-file' };
};

// Format bytes to KB/MB/GB
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const FilesTable = ({ files, onDelete, onDownload, onUpload }: FilesTableProps) => {
  return (
    <div className="md:col-span-2 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[rgb(var(--border))] flex justify-between items-center">
        <h2 className="font-bold text-lg text-[rgb(var(--text))]">Recent Files</h2>
        <button
          onClick={onUpload}
          className="flex items-center gap-2 bg-[rgb(var(--primary))] text-white px-5 py-2 rounded-lg hover:bg-[rgb(var(--primary-dark))] transition-shadow shadow-md"
        >
          <Upload size={18} />
          Upload
        </button>
      </div>

      {/* Empty state */}
      {files.length === 0 ? (
        <div className="p-16 text-center text-[rgb(var(--text-muted))] flex flex-col items-center gap-4">
          <File size={60} className="opacity-20 animate-pulse" />
          <p className="text-lg">No files uploaded yet.</p>
          <button
            onClick={onUpload}
            className="mt-2 bg-[rgb(var(--primary))] text-white px-4 py-2 rounded-lg hover:bg-[rgb(var(--primary-dark))] transition"
          >
            Upload Your First File
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-[rgb(var(--border)/0.1)] text-[rgb(var(--text-muted))] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Size</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[rgb(var(--border)/0.1)]">
              {files.map((file) => {
                const { Icon, color, label, badge } = getFileIcon(file.mimeType);
                return (
                  <tr key={file.id} className="hover:bg-[rgb(var(--primary)/0.05)] transition-colors group">
                    {/* File Name */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Icon size={20} className={`${color} shrink-0`} />
                      <span
                        className="font-medium text-[rgb(var(--text))] truncate max-w-[200px] md:max-w-xs"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                    </td>

                    {/* File Type Badge */}
                    <td className="px-6 py-4">
                      <span
                        className="text-[10px] uppercase font-bold px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: `rgba(var(${badge}-rgb), 0.15)`,
                          color: `rgb(var(${badge}-rgb))`,
                        }}
                      >
                        {label}
                      </span>
                    </td>

                    {/* File Size */}
                    <td className="px-6 py-4 text-sm text-[rgb(var(--text-muted))]">
                      {formatFileSize(file.size)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right flex justify-end items-center space-x-2">
                      <button
                        onClick={() => onDownload(file.id, file.name)}
                        className="p-2 text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary)/0.15)] rounded-lg transition-transform hover:scale-110"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(file.id)}
                        className="p-2 text-[rgb(var(--danger))] hover:bg-[rgb(var(--danger)/0.15)] rounded-lg transition-transform hover:scale-110"
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