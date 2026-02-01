import { 
  FileText, Image as ImageIcon, Video, 
  Music, File, FileCode, Archive 
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

export const getFileDetails = (mimeType: string): { icon: LucideIcon; color: string; label: string } => {
  if (mimeType.startsWith('image/')) return { icon: ImageIcon, color: 'text-blue-500', label: 'Image' };
  if (mimeType.startsWith('video/')) return { icon: Video, color: 'text-purple-500', label: 'Video' };
  if (mimeType.startsWith('audio/')) return { icon: Music, color: 'text-pink-500', label: 'Audio' };
  if (mimeType.includes('pdf')) return { icon: FileText, color: 'text-red-500', label: 'PDF' };
  if (mimeType.includes('zip') || mimeType.includes('rar')) return { icon: Archive, color: 'text-orange-500', label: 'Archive' };
  if (mimeType.includes('javascript') || mimeType.includes('typescript') || mimeType.includes('json')) {
    return { icon: FileCode, color: 'text-yellow-600', label: 'Code' };
  }
  return { icon: File, color: 'text-gray-400', label: 'File' };
};