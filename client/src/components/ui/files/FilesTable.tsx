import { useState } from 'react';
import { getFileConfig, formatFileSize, formatDate } from '../../../utils/helpers/files/fileUtils';
import { Check, Download, Trash2, Upload, X, Calendar } from 'lucide-react';
import type { CloudFile } from '../../../types/fileTypes';

interface FilesTableProps {
  files: CloudFile[];
  onDelete: (id: string) => void;
  onDownload: (id: string, name: string) => void;
  onUpload: () => void;
  onBulkDelete?: (ids: string[]) => void;
}

const FilesTable = ({ files, onDelete, onDownload, onUpload, onBulkDelete }: FilesTableProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Selection Logic
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === files.length && files.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(files.map((file) => file.id));
    }
  };

  return (
    <div className="relative md:col-span-2 bg-[rgb(var(--card)/0.8)] backdrop-blur-xl border border-[rgb(var(--border))] rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500">

      {/* 1. FLOATING BULK ACTION BAR (Z-INDEX 100) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-6 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 animate-in fade-in slide-in-from-bottom-8">
          <div className="flex items-center gap-3 pr-6 border-r border-white/20">
            <div className="bg-[rgb(var(--primary))] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
              {selectedIds.length}
            </div>
            <span className="text-sm font-medium">Files selected</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                onBulkDelete?.(selectedIds);
                setSelectedIds([]); // Clear selection after delete
              }}
              className="flex items-center gap-2 hover:text-red-400 transition-colors text-sm font-semibold"
            >
              <Trash2 size={18} /> Delete
            </button>
            <button className="flex items-center gap-2 hover:text-[rgb(var(--primary))] transition-colors text-sm font-semibold">
              <Download size={18} /> Download (.zip)
            </button>
            <button onClick={() => setSelectedIds([])} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="p-8 border-b border-[rgb(var(--border)/0.5)] flex justify-between items-center bg-gradient-to-r from-transparent to-[rgb(var(--primary)/0.02)]">
        <div>
          <h2 className="font-bold text-2xl text-[rgb(var(--text))] tracking-tight">Recent Files</h2>
          <p className="text-sm text-[rgb(var(--text-muted))]">Manage your recently uploaded assets</p>
        </div>
        <button onClick={onUpload} className="group flex items-center gap-2 bg-[rgb(var(--primary))] text-white px-6 py-3 rounded-xl hover:shadow-lg active:scale-95 transition-all">
          <Upload size={18} />
          <span className="font-semibold">Upload</span>
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto px-4 pb-4">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead className="text-[rgb(var(--text-muted))] text-[11px] uppercase tracking-[0.2em]">
            <tr>
              <th className="px-6 py-4">
                {/* 2. MASTER CHECKBOX UI */}
                <div
                  onClick={toggleSelectAll}
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${selectedIds.length === files.length && files.length > 0
                      ? 'bg-[rgb(var(--primary))] border-[rgb(var(--primary))]'
                      : 'border-[rgb(var(--border))] hover:border-[rgb(var(--primary))]'
                    }`}
                >
                  {selectedIds.length === files.length && files.length > 0 && <Check size={12} className="text-white stroke-[4px]" />}
                </div>
              </th>
              <th className="px-2 py-4 font-bold">File Name</th>
              <th className="px-6 py-4 font-bold hidden sm:table-cell">Category</th>
              {/* 3. NEW COLUMN: DATE UPLOADED */}
              <th className="px-6 py-4 font-bold hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>Uploaded</span>
                </div>
              </th>
              <th className="px-6 py-4 font-bold">Size</th>
              <th className="px-6 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {files.map((file) => {
              const { Icon, bg, color, label } = getFileConfig(file.mimeType);
              const isSelected = selectedIds.includes(file.id);

              return (
                <tr key={file.id} className={`group transition-all duration-300 ${isSelected ? 'bg-[rgb(var(--primary)/0.06)]' : 'hover:bg-[rgb(var(--primary)/0.02)]'}`}>
                  {/* 4. ROW CHECKBOX UI */}
                  <td className={`px-6 py-4 first:rounded-l-2xl transition-all ${isSelected ? 'border-l-4 border-[rgb(var(--primary))]' : 'border-l-4 border-transparent'}`}>
                    <div
                      onClick={() => toggleSelect(file.id)}
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected
                          ? 'bg-[rgb(var(--primary))] border-[rgb(var(--primary))] scale-110'
                          : 'border-[rgb(var(--border))] opacity-40 group-hover:opacity-100'
                        }`}
                    >
                      {isSelected && <Check size={12} className="text-white stroke-[4px]" />}
                    </div>
                  </td>

                  {/* FILE NAME & ICON */}
                  <td className="px-2 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`${bg} ${color} p-3 rounded-2xl group-hover:rotate-6 transition-transform`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex flex-col min-w-0 text-sm">
                        <span className={`font-semibold truncate max-w-[150px] md:max-w-xs ${isSelected ? 'text-[rgb(var(--primary))]' : 'text-[rgb(var(--text))]'}`}>
                          {file.name}
                        </span>
                        <span className="text-[10px] text-[rgb(var(--text-muted))] sm:hidden">{label}</span>
                      </div>
                    </div>
                  </td>

                  {/* TYPE BADGE */}
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className={`text-[10px] uppercase px-3 py-1 rounded-full border border-current font-bold opacity-80 ${color}`}>
                      {label}
                    </span>
                  </td>

                  {/* 5. DATA INJECTION: DATE COLUMN CELL */}
                  <td className="px-6 py-4 text-sm font-medium text-[rgb(var(--text-muted))] hidden lg:table-cell">
                    {formatDate(file.createdAt)}
                  </td>

                  {/* SIZE CELL */}
                  <td className="px-6 py-4 text-sm font-medium text-[rgb(var(--text-muted))]">
                    {formatFileSize(file.size)}
                  </td>

                  {/* ACTIONS CELL */}
                  <td className="px-6 py-4 text-right last:rounded-r-2xl">
                    <div className={`flex justify-end gap-1 transition-all ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <button onClick={() => onDownload(file.id, file.name)} className="p-2.5 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all border border-transparent hover:border-[rgb(var(--border))]">
                        <Download size={18} />
                      </button>
                      <button onClick={() => onDelete(file.id)} className="p-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilesTable;