import { useState } from 'react';
import api from '../api/axios';
import { X, Upload, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadModal = ({ isOpen, onClose, onUploadSuccess }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploadSuccess();
      onClose();
      setFile(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Upload File</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X /></button>
        </div>

        <div 
          className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative"
        >
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Upload size={24} />
          </div>
          <p className="text-sm text-gray-600 font-medium">
            {file ? file.name : "Click to browse or drag and drop"}
          </p>
          <p className="text-xs text-gray-400">Max file size: 100MB</p>
        </div>

        <div className="mt-6 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button 
            disabled={!file || uploading}
            onClick={handleUpload}
            className="flex-1 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? <Loader2 className="animate-spin" size={18} /> : "Upload Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;