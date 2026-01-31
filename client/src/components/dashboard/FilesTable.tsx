import { FileText, Trash2, Download, Upload } from 'lucide-react'

export interface CloudFile {
  id: string
  name: string
  size: number
}

interface FilesTableProps {
  files: CloudFile[]
  onDelete: (id: string) => void
  onDownload: (id: string, name: string) => void
  onUpload: () => void
}

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
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Upload size={18} />
          Upload
        </button>
      </div>

      {files.length === 0 ? (
        <div className="p-10 text-center text-gray-400">
          No files uploaded yet.
        </div>
      ) : (
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
              <tr
                key={file.id}
                className="hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <FileText size={18} className="text-gray-400" />
                  <span className="font-medium">{file.name}</span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onDownload(file.id, file.name)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Download size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(file.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default FilesTable
