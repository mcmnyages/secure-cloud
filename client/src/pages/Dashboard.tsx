import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { HardDrive, FileText, Upload, Trash2, Download, LogOut } from 'lucide-react';
import UploadModal from '../components/UploadModal';

interface CloudFile {
  id: string;
  name: string;
  size: number;
  createdAt: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [storage, setStorage] = useState({ used: 0, limit: 104857600 }); // 100MB default
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [filesRes, userRes] = await Promise.all([
        api.get('/files'),
        api.get('/auth/me') // You might need to add this simple GET route to your backend
      ]);
      setFiles(filesRes.data);
      setStorage({ used: Number(userRes.data.storageUsed), limit: Number(userRes.data.storageLimit) });
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const calculateProgress = () => (storage.used / storage.limit) * 100;

  const handleDelete = async (fileId: string) => {
  if (!confirm("Are you sure you want to delete this file?")) return;
  try {
    await api.delete(`/files/${fileId}`);
    fetchDashboardData(); // Refresh list and storage
  } catch (err) {
    alert("Failed to delete file");
  }
};

const handleDownload = async (fileId: string, fileName: string) => {
  try {
    // We use 'blob' to handle binary file data
    const response = await api.get(`/files/download/${fileId}`, {
      responseType: 'blob',
    });
    
    // Create a temporary link to trigger the browser download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    alert("Download failed");
  }
};

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">My Secure Cloud</h1>
          <p className="text-gray-500">Welcome back, {user?.name || user?.email}</p>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition">
          <LogOut size={20} /> Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Storage Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
            <HardDrive size={24} />
            <h2 className="font-semibold text-lg text-gray-800">Storage</h2>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {(storage.used / 1024 / 1024).toFixed(2)} MB of {(storage.limit / 1024 / 1024)} MB used
          </p>
        </div>

        {/* Files Table Section */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-lg">Recent Files</h2>
                <button 
                     onClick={() => setIsModalOpen(true)}
                     className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Upload size={18} /> Upload
                 </button>
        </div>
          
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {files.map(file => (
                <tr key={file.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <FileText size={20} className="text-gray-400" />
                    <span className="font-medium">{file.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => handleDownload(file.id, file.name)}><Download size={18} /></button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => handleDelete(file.id)}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {files.length === 0 && (
            <div className="p-10 text-center text-gray-400">No files uploaded yet.</div>
          )}
        </div>
      </div>
      <UploadModal 
       isOpen={isModalOpen} 
       onClose={() => setIsModalOpen(false)} 
       onUploadSuccess={fetchDashboardData} // Refreshes the list and storage bar
      />
    </div> 
  );

  

};


export default Dashboard;