// client/src/types/file.ts
export interface File {
  id: string;
  name: string;
  size: number;
  path: string; // Internal use only, not sent to client
  mimeType: string;
  createdAt: string; // ISO date string from backend
  ownerId: string;
}

export type FileCategory = 'all' | 'image' | 'video' | 'audio' | 'document' | 'other';

export interface CloudFile {
  id: string
  name: string
  size: number
  mimeType: string
  createdAt: string // ISO date string
}