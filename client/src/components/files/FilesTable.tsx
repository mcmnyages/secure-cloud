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

/**
 * Updated interface to include mimeType from our Express backend
 */
export interface CloudFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
}

interface FilesTableProps {
  files: CloudFile[];
  onDelete: (id: string) => void;
  onDownload: (id: string, name: string) => void;
  onUpload: () => void;
}

/**
 * Helper to map MIME types to specific Lucide icons and Tailwind colors
 */
const getFileIcon = (mimeType: string) => {
  if (!mimeType) return { Icon: File, color: 'text-gray-400', label: 'File' };

  if (mimeType.startsWith('image/')) return { Icon: ImageIcon, color: 'text-blue-500', label: 'Image' };
  if (mimeType.startsWith('video/')) return { Icon: Video, color: 'text-purple-500', label: 'Video' };
  if (mimeType.startsWith('audio/')) return { Icon: Music, color: 'text-pink-500', label: 'Audio' };
  if (mimeType.includes('pdf')) return { Icon: FileText, color: 'text-red-500', label: 'PDF' };
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
    return { Icon: Archive, color: 'text-orange-500', label: 'Archive' };
  }
  if (mimeType.includes('javascript') || mimeType.includes('typescript') || mimeType.includes('json') || mimeType.includes('html')) {
    return { Icon: FileCode, color: 'text-yellow-600', label: 'Code' };
  }
  
  return { Icon: File, color: 'text-gray-400', label: 'File' };
};

/**
 * Helper to format file sizes professionally
 */
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const FilesTable = ({
  files,
  onDelete,
  onDownload,
  onUpload,
}: FilesTableProps) => {
  return (
    <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Recent Files</h2>
        <button
          onClick={onUpload}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Upload size={18} />
          Upload
        </button>
      </div>

      {files.length === 0 ? (
        <div className="p-10 text-center text-gray-400 flex flex-col items-center gap-2">
          <File size={40} className="opacity-20" />
          <p>No files uploaded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Kind</th>
                <th className="px-6 py-4 font-semibold">Size</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {files.map((file) => {
                const { Icon, color, label } = getFileIcon(file.mimeType);

                return (
                  <tr
                    key={file.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Icon size={20} className={`${color} shrink-0`} />
                      <span className="font-medium text-gray-700 truncate max-w-[180px] md:max-w-xs" title={file.name}>
                        {file.name}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-[10px] uppercase font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                        {label}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>

                    <td className="px-6 py-4 text-right space-x-1">
                      <button
                        onClick={() => onDownload(file.id, file.name)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(file.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
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