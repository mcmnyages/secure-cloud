import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, UploadCloud, 
  Layers, Calendar, HardDrive, Edit3, 
  Check, X, Trash2, 
  AlertCircle, CloudIcon
} from 'lucide-react';

// Types & Utils
import { useFiles } from '@/hooks/files/queries/useFiles';
import { useFileActions } from '@/hooks/files/mutations/useFileActions';
import { formatFileSize, formatDate, getFileConfig } from '@/utils/helpers/files/fileUtils';
import type { FileVersion } from '@/types/fileTypes';

const FileVersionPage: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { setSelectedFileId, versions, isVersionsLoading, selectedFile } = useFiles();
  const { downloadFile, uploadNewVersion, renameFile, deleteFile } = useFileActions();

  // Selection & Edit States
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [tempName, setTempName] = useState<string>("");

  useEffect(() => {
    if (fileId) setSelectedFileId(fileId);
    return () => setSelectedFileId(null);
  }, [fileId, setSelectedFileId]);

  const handleStartRename = (v: FileVersion): void => {
    setEditingVersionId(v.id);
    setTempName(v.name);
  };

  const handleSaveRename = (_vId: string): void => {
    if (tempName.trim() && fileId) {
      renameFile({ id: fileId, name: tempName }); 
      setEditingVersionId(null);
    }
  };

  const handleFileDelete = (): void => {
    if (!fileId) return;
    const confirm = window.confirm("Archive this entire asset? This will remove all versions.");
    if (confirm) {
      deleteFile(fileId);
      navigate('/files');
    }
  };

  if (isVersionsLoading) return (
    <div className="h-screen bg-[rgb(var(--background))] flex flex-col items-center justify-center space-y-4">
       <div className="w-12 h-12 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
       <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">Syncing Version History</span>
    </div>
  );

  const config = getFileConfig(selectedFile?.currentVersion.mimeType);

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--text))] antialiased">
      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-24">
        
        {/* TOP NAVIGATION BAR */}
        <div className="flex items-center justify-between mb-16">
          <button 
            onClick={() => navigate('/files')}
            className="group flex items-center gap-3 px-4 py-2 bg-[rgb(var(--text)/0.03)] hover:bg-[rgb(var(--text)/0.08)] rounded-xl transition-all"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Library</span>
          </button>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleFileDelete}
              className="p-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              title="Delete Asset"
            >
              <Trash2 size={20} />
            </button>
            <div className="h-6 w-px bg-[rgb(var(--text)/0.1)] mx-2" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              <UploadCloud size={18} /> Push Update
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* ASSET DATA PANEL */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 p-10 rounded-[2.5rem] bg-[rgb(var(--text)/0.02)] border border-[rgb(var(--text)/0.05)] overflow-hidden">
              <div className={`w-16 h-16 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center mb-8`}>
                <config.Icon size={32} />
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-black tracking-tighter leading-none">{selectedFile?.currentVersion.name}</h1>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-md bg-[rgb(var(--text)/0.05)] text-[10px] font-black uppercase opacity-50 tracking-widest">{config.label}</span>
                  <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest">Managed</span>
                </div>
              </div>

              <div className="mt-12 space-y-6 pt-10 border-t border-[rgb(var(--text)/0.05)]">
                <DataPoint icon={<HardDrive size={16}/>} label="Storage" value={formatFileSize(selectedFile?.currentVersion.size || 0)} />
                <DataPoint icon={<Layers size={16}/>} label="History" value={`${versions.length} versions`} />
                <DataPoint icon={<Calendar size={16}/>} label="Created" value={formatDate(selectedFile?.createdAt || '')} />
              </div>
            </div>
          </aside>

          {/* VERSION TIMELINE */}
          <main className="lg:col-span-8">
            <div className="relative space-y-6">
              {/* Central Line */}
              <div className="absolute left-[39px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-500/50 via-[rgb(var(--text)/0.05)] to-transparent" />

              {versions.map((v: FileVersion, i: number) => {
                const isLatest = i === 0;
                const isEditing = editingVersionId === v.id;

                return (
                  <div key={v.id} className="relative pl-24 group">
                    {/* The Dot */}
                    <div className={`absolute left-[31px] top-8 w-4 h-4 rounded-full border-4 border-[rgb(var(--background))] z-10 transition-all duration-500
                      ${isLatest ? 'bg-blue-600 scale-125 ring-8 ring-blue-500/10' : 'bg-[rgb(var(--text)/0.2)] group-hover:bg-blue-400'}
                    `} />

                    <div className={`p-8 rounded-[2rem] border transition-all duration-500 
                      ${isLatest 
                        ? 'bg-white dark:bg-[rgb(var(--text)/0.03)] border-blue-500/20 shadow-2xl shadow-black/5' 
                        : 'bg-transparent border-transparent hover:bg-[rgb(var(--text)/0.02)] hover:border-[rgb(var(--text)/0.08)]'}
                    `}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Iteration {v.versionNumber}</span>
                            {isLatest && <span className="text-[8px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">ACTIVE</span>}
                          </div>

                          {isEditing ? (
                            <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                              <input 
                                autoFocus
                                className="bg-[rgb(var(--background))] border-2 border-blue-500 rounded-xl px-4 py-2 text-lg font-bold w-full outline-none"
                                value={tempName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempName(e.target.value)}
                                onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSaveRename(v.id)}
                              />
                              <button onClick={() => handleSaveRename(v.id)} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20"><Check size={20}/></button>
                              <button onClick={() => setEditingVersionId(null)} className="p-3 bg-[rgb(var(--text)/0.05)] rounded-xl"><X size={20}/></button>
                            </div>
                          ) : (
                            <h3 
                              onClick={() => handleStartRename(v)}
                              className="text-xl font-bold truncate hover:text-blue-500 transition-colors cursor-text inline-block"
                            >
                              {v.name}
                            </h3>
                          )}

                          <div className="flex items-center gap-4 mt-2 text-xs font-medium opacity-40">
                            <span className="flex items-center gap-1"><CloudIcon size={12}/> {formatFileSize(v.size)}</span>
                            <span className="flex items-center gap-1"><AlertCircle size={12}/> {formatDate(v.createdAt)}</span>
                          </div>
                        </div>

                        {/* VERSION ACTIONS */}
                        {!isEditing && (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleStartRename(v)}
                              className="p-3 hover:bg-blue-500/10 text-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                              title="Rename Iteration"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => downloadFile(fileId!, v.name)}
                              className="flex items-center gap-2 px-5 py-3 bg-[rgb(var(--text)/0.05)] hover:bg-blue-600 hover:text-white rounded-xl font-bold text-xs transition-all shadow-sm"
                            >
                              <Download size={16} /> Get File
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>

      <input 
        type="file" 
        hidden 
        ref={fileInputRef} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if(fileId && e.target.files?.[0]) uploadNewVersion({ id: fileId, file: e.target.files[0] });
        }} 
      />
    </div>
  );
};

const DataPoint = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3 opacity-30">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-xs font-bold">{value}</span>
  </div>
);

export default FileVersionPage;