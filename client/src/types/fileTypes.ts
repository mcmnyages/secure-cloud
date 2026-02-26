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
}

// CloudFile used in UI
export interface CloudFile {
  id: string
  createdAt: string
  currentVersion: FileVersion
}

// File category enum
export type FileCategory = 'all' | 'image' | 'video' | 'audio' | 'document' | 'other'