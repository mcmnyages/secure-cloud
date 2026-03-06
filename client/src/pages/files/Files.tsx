import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFiles } from "@/hooks/files/queries/useFiles";
import { useFileActions } from "@/hooks/files/mutations/useFileActions";
import type { CloudFile } from "@/types/fileTypes";

import UploadModal from "@/components/ui/modals/UploadModal";
import { LoadingSpinner } from "@/components/ui/spinners";
import { formatDistanceToNow } from "date-fns";
import { filesize } from "filesize";

const Files: React.FC = () => {
  const navigate = useNavigate();

  const {
    files,
    isLoading,
    isModalOpen,
    viewMode,
    setIsModalOpen,
    setViewMode,
    filters,
  } = useFiles();

  const { deleteFile, bulkDeleteFiles, downloadFile, renameFile } =
    useFileActions();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const startRename = (file: CloudFile) => {
    setRenamingId(file.id);
    setEditName(file.currentVersion.name);
  };

  const submitRename = (id: string) => {
    if (editName.trim()) {
      renameFile({ id, name: editName });
    }
    setRenamingId(null);
  };

  const handleBulkDelete = () => {
    bulkDeleteFiles(selectedIds);
    setSelectedIds([]);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-15">
      {/* Search */}
      <input
        className="border-blue-600"
        type="text"
        placeholder="Search"
        value={filters.search}
        onChange={(e) => filters.setSearch(e.target.value)}
      />

      {/* Filters */}
      <div className="flex gap-2">
        <button onClick={() => filters.setTypeFilter("all")}>All</button>
        <button onClick={() => filters.setTypeFilter("image")}>Images</button>
        <button onClick={() => filters.setTypeFilter("document")}>
          Documents
        </button>
        <button onClick={() => filters.setTypeFilter("video")}>Videos</button>
      </div>

      {/* View Mode */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode("list")}
          className="px-3 py-1 border rounded"
        >
          List
        </button>

        <button
          onClick={() => setViewMode("grid")}
          className="px-3 py-1 border rounded"
        >
          Grid
        </button>
      </div>

      {/* Files */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "flex flex-col gap-2"
        }
      >
        {files.map((file) => (
          <div
            key={file.id}
            className={
              viewMode === "grid"
                ? "border rounded p-4 flex flex-col gap-2"
                : "border rounded p-3 flex items-center justify-between"
            }
          >
            <div className={viewMode === "grid" ? "flex items-center gap-2" : "flex items-center gap-2 w-full"}>
              {/* Toggle select checkbox */}
              <input
                type="checkbox"
                checked={selectedIds.includes(file.id)}
                onChange={() => toggleSelect(file.id)}
                className="mr-2"
              />
              {/* Rename UI */}
              {renamingId === file.id ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    submitRename(file.id);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoFocus
                    className="border rounded px-2 py-1"
                  />
                  <button type="submit" className="text-green-600">Save</button>
                  <button type="button" className="text-gray-500" onClick={() => setRenamingId(null)}>Cancel</button>
                </form>
              ) : (
                <div className="flex flex-col flex-1">
                  <span className="font-medium">
                    {file.currentVersion.name}
                  </span>

                  <span className="text-sm text-gray-500">
                    {filesize(file.currentVersion.size)} • {formatDistanceToNow(file.createdAt, { addSuffix: true })}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => startRename(file)}>Rename</button>
              <button
                onClick={() =>
                  downloadFile(file.id, file.currentVersion.name)
                }
              >
                Download
              </button>
              <button onClick={() => deleteFile(file.id)}>
                Delete
              </button>
              <button
                onClick={() =>
                  navigate(`/files/${file.id}/versions`)
                }
              >
                Open
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div>
          <span>{selectedIds.length} selected</span>
          <button onClick={handleBulkDelete}>Delete Selected</button>
          <button onClick={() => setSelectedIds([])}>Clear</button>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Files;