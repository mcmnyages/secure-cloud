// client/src/types/fileTypes.ts
// fileTypes.ts
export interface ServerFile {
  id: string;
  name: string;
  size: number;
  path: string;
  mimeType: string;
  createdAt: string;
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