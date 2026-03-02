import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Grid, List, Download, Trash2, Edit3, X, Check, 
} from 'lucide-react';

// Hooks & Types
import { useFiles } from '@/hooks/files/queries/useFiles';
import { useFileActions } from '@/hooks/files/mutations/useFileActions';
import type { CloudFile } from '@/types/fileTypes';
import { formatFileSize, getFileConfig } from '@/utils/helpers/files/fileUtils';

// UI Components
import { LogoSpinner } from '@/components/ui/spinners';
import UploadModal from '@/components/ui/modals/UploadModal';

const Files: React.FC = () => {
  const navigate = useNavigate();
  const { files, isLoading, isModalOpen, setIsModalOpen, viewMode, setViewMode, filters } = useFiles();
  const { deleteFile, bulkDeleteFiles, downloadFile, renameFile } = useFileActions();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");

  

  const handleStartRename = (e: React.MouseEvent, file: CloudFile): void => {
    e.stopPropagation();
    setRenamingId(file.id);
    setEditName(file.currentVersion.name);
  };

  const submitRename = (id: string): void => {
    if (editName.trim()) renameFile({ id, name: editName });
    setRenamingId(null);
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] text-[rgb(var(--text))] font-sans selection:bg-blue-500/30">
      

      <main className="max-w-[1800px] mx-auto px-6 pt-32 pb-24">
        {/* 2. CREATIVE SEARCH COMMAND BAR */}
        <div className="relative max-w-2xl mx-auto mb-16">
          <div className="group relative flex items-center bg-[rgb(var(--text)/0.03)] border border-[rgb(var(--text)/0.08)] rounded-2xl p-2 transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/50">
            <Search className="ml-4 opacity-20 group-focus-within:opacity-100 group-focus-within:text-blue-500 transition-all" size={22} />
            <input 
              type="text"
              placeholder="Type to search assets..."
              className="w-full bg-transparent border-none outline-none px-4 py-3 text-xl font-medium placeholder:opacity-20"
              value={filters.search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => filters.setSearch(e.target.value)}
            />
            <div className="hidden sm:flex items-center gap-1 pr-4 opacity-30 pointer-events-none">
              <kbd className="px-2 py-1 bg-[rgb(var(--text)/0.1)] rounded text-xs font-bold font-mono">⌘</kbd>
              <kbd className="px-2 py-1 bg-[rgb(var(--text)/0.1)] rounded text-xs font-bold font-mono">K</kbd>
            </div>
          </div>
        </div>

        {/* 3. VIEW CONTROLS */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            {['all', 'image', 'document', 'video'].map((cat) => (
              <button
                key={cat}
                onClick={() => filters.setTypeFilter(cat as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filters.typeFilter === cat ? 'bg-blue-600 text-white' : 'bg-[rgb(var(--text)/0.05)] opacity-50 hover:opacity-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center bg-[rgb(var(--text)/0.05)] rounded-xl p-1">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[rgb(var(--background))] shadow-sm text-blue-500' : 'opacity-30'}`}><List size={18}/></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[rgb(var(--background))] shadow-sm text-blue-500' : 'opacity-30'}`}><Grid size={18}/></button>
          </div>
        </div>

        {/* 4. CONTENT GRID */}
        {isLoading ? (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-20"><LogoSpinner size={80} src='/favicon.ico' spinLogo /></div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4' : 'flex flex-col gap-2'}>
            {files.map((file) => (
              <FileCard 
                key={file.id} 
                file={file} 
                viewMode={viewMode}
                isSelected={selectedIds.includes(file.id)}
                isRenaming={renamingId === file.id}
                editName={editName}
                onSelect={(id) => setSelectedIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])}
                onRenameClick={(e) => handleStartRename(e, file)}
                onRenameChange={(val) => setEditName(val)}
                onRenameSubmit={() => submitRename(file.id)}
                onRenameCancel={() => setRenamingId(null)}
                onDownload={() => downloadFile(file.id, file.currentVersion.name)}
                onDelete={() => deleteFile(file.id)}
                onNavigate={() => navigate(`/files/${file.id}/versions`)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 5. FLOATING SELECTION BAR */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 px-8 py-4 bg-[rgb(var(--text))] text-[rgb(var(--background))] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-10">
          <span className="font-black text-sm uppercase tracking-widest">{selectedIds.length} Selected</span>
          <div className="w-px h-6 bg-[rgb(var(--background)/0.2)]" />
          <div className="flex gap-4">
            <button onClick={() => { bulkDeleteFiles(selectedIds); setSelectedIds([]); }} className="hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
            <button onClick={() => setSelectedIds([])} className="opacity-50 hover:opacity-100"><X size={20}/></button>
          </div>
        </div>
      )}

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

/* --- SUBCOMPONENT: FILE CARD --- */
interface CardProps {
  file: CloudFile;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  isRenaming: boolean;
  editName: string;
  onSelect: (id: string) => void;
  onRenameClick: (e: React.MouseEvent) => void;
  onRenameChange: (val: string) => void;
  onRenameSubmit: () => void;
  onRenameCancel: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onNavigate: () => void;
}

const FileCard: React.FC<CardProps> = ({ file, viewMode, isSelected, isRenaming, editName, onSelect, onRenameClick, onRenameChange, onRenameSubmit, onRenameCancel, onDownload, onDelete, onNavigate }) => {
  const isGrid = viewMode === 'grid';
  const config = getFileConfig(file.currentVersion.mimeType);
  const Icon = config.Icon;

  return (
    <div 
      onClick={onNavigate}
      className={`group relative rounded-3xl transition-all duration-500 cursor-pointer overflow-hidden border
        ${isSelected ? 'bg-blue-600/10 border-blue-500' : 'bg-[rgb(var(--text)/0.02)] border-[rgb(var(--text)/0.05)] hover:bg-[rgb(var(--text)/0.05)] hover:border-[rgb(var(--text)/0.15)]'}
        ${isGrid ? 'aspect-[4/5] p-6 flex flex-col justify-between' : 'p-3 flex items-center'}
      `}
    >
      <div 
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onSelect(file.id); }}
        className={`absolute top-4 left-4 z-10 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center
          ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-[rgb(var(--background))] border-[rgb(var(--text)/0.1)] opacity-0 group-hover:opacity-100'}`}
      >
        {isSelected && <Check size={12} className="text-white" strokeWidth={4} />}
      </div>

      <div className={`${isGrid ? 'w-16 h-16 mb-4' : 'w-10 h-10 mr-4 ml-10'} rounded-2xl ${config.bg} flex items-center justify-center ${config.color} transition-transform group-hover:scale-110 duration-500`}>
        <Icon size={isGrid ? 32 : 20} strokeWidth={2.5} />
      </div>

      <div className="flex-1 min-w-0">
        {isRenaming ? (
          <input 
            autoFocus 
            className="w-full bg-[rgb(var(--background))] border-2 border-blue-500 rounded-lg px-2 py-1 text-sm font-bold outline-none"
            value={editName}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onRenameChange(e.target.value)}
            onBlur={onRenameCancel}
            onKeyDown={(e) => e.key === 'Enter' && onRenameSubmit()}
          />
        ) : (
          <h3 className="font-bold text-sm truncate leading-tight">{file.currentVersion.name}</h3>
        )}
        <p className="text-[10px] font-black opacity-30 mt-1 uppercase tracking-tighter">
          {formatFileSize(file.currentVersion.size)} • v{file.currentVersion.versionNumber}
        </p>
      </div>

      <div className={`flex gap-1 ${isGrid ? 'mt-4 pt-4 border-t border-[rgb(var(--text)/0.05)]' : 'ml-auto'}`}>
         <button onClick={(e) => { e.stopPropagation(); onDownload(); }} className="p-2 hover:bg-[rgb(var(--text)/0.05)] rounded-lg transition-colors"><Download size={16}/></button>
         <button onClick={onRenameClick} className="p-2 hover:bg-[rgb(var(--text)/0.05)] rounded-lg transition-colors"><Edit3 size={16}/></button>
         <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
      </div>
    </div>
  );
};

export default Files;