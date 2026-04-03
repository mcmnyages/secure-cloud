// client/src/types/fileTypes.ts

// Backend flat file from API
export interface FlatFile {
  id: string
  versionId: string
  versionNumber: number
  name: string
  size: number
  mimeType: string
  createdAt: string
}

// Frontend-friendly version info
export interface FileVersion {
  id: string
  versionNumber: number
  name: string
  size: number
  mimeType: string
  createdAt: string
  isCurrent?: boolean
}

export interface VersionsMap {
  [fileId: string]: FileVersion[];
}

// CloudFile used in UI
export interface CloudFile {
  id: string
  createdAt: string
  currentVersion: FileVersion
}

// File category enum
export type FileCategory = 'all' | 'image' | 'video' | 'audio' | 'document' | 'other'



export interface FileItemProps {
  file: CloudFile;
  index: number;
  selected: boolean;
  renaming: boolean;
  editName: string;
  onSelect: (id: string, index: number, shiftKey: boolean) => void;
  onRename: (file: CloudFile) => void;
  onEditName: (name: string) => void;
  onSubmitRename: (id: string) => void;
  onCancelRename: () => void;
  onDownload: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
}