import { useParams, useNavigate } from 'react-router-dom';
import { useFiles } from '@/hooks/files/queries/useFiles';
import { useFileActions } from '@/hooks/files/mutations/useFileActions';
import { formatFileSize, formatDate } from '@/utils/helpers/files/fileUtils';
import { useEffect } from 'react';

const FileVersionPage = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  
  const { 
    setSelectedFileId, 
    versions, 
    isVersionsLoading, 
    selectedFile 
  } = useFiles();
  console.log('Files:', versions, selectedFile);

  const { downloadFile, deleteFile } = useFileActions();

  // Sync the URL ID with our hook's state
  useEffect(() => {
    if (fileId) setSelectedFileId(fileId);
    return () => setSelectedFileId(null);
  }, [fileId, setSelectedFileId]);

  if (isVersionsLoading) return <div className="p-20 text-center">Loading version history...</div>;

  return (
    <div className="min-h-screen mt-16 bg-[rgb(var(--background))] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-blue-500 hover:underline flex items-center gap-2"
        >
          ← Back to Files
        </button>

        <div className="flex justify-between items-end mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold">{selectedFile?.currentVersion.name}</h1>
            <p className="text-[rgb(var(--text)/0.6)] mt-2">
              Full version history and management
            </p>
          </div>
          <div className="text-right">
             <span className="block text-xs font-bold opacity-50 uppercase">Total Versions</span>
             <span className="text-2xl font-mono">{versions.length}</span>
          </div>
        </div>

        {/* Versions Table/List */}
        <div className="space-y-4">
          {versions.map((v) => (
            <div 
              key={v.id} 
              className={`p-6 border rounded-2xl bg-[rgb(var(--text)/0.02)] flex items-center justify-between transition-all
                ${v.versionNumber === selectedFile?.currentVersion.versionNumber ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-[rgb(var(--text)/0.1)]'}
              `}
            >
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-blue-500 text-white font-bold">
                  <span className="text-[10px] uppercase opacity-80">Ver</span>
                  <span className="text-lg">{v.versionNumber}</span>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">{v.name}</h3>
                  <div className="flex gap-4 text-sm opacity-60">
                    <span>{formatFileSize(v.size)}</span>
                    <span>•</span>
                    <span>Created: {formatDate(v.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => downloadFile(fileId!, v.name)}
                  className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all font-medium"
                >
                  Download This
                </button>
                
                {/* Prevent deleting the current active version if desired */}
                <button 
                  disabled={v.versionNumber === selectedFile?.currentVersion.versionNumber}
                  className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all font-medium disabled:opacity-30 disabled:hover:bg-red-500/10 disabled:hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileVersionPage;