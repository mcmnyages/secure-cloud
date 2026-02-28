// src/utils/helpers/files/fileUtils.ts
import {
  FileText,
  ImageIcon,
  Video,
  Music,
  FileCode,
  File,
  Archive,
  FileSpreadsheet,
  FileImage,
  FileJson,
  type LucideIcon,
} from 'lucide-react';

export interface FileTypeConfig {
  Icon: LucideIcon;
  bg: string;
  color: string;
  label: string;
}

interface MimeMatcher {
  match: (mime: string) => boolean;
  config: FileTypeConfig;
}

const defaultConfig: FileTypeConfig = {
  Icon: File,
  bg: 'bg-gray-500/10',
  color: 'text-gray-400',
  label: 'File',
};

const mimeMatchers: MimeMatcher[] = [
  // Images
  {
    match: (m) => m.startsWith('image/'),
    config: {
      Icon: ImageIcon,
      bg: 'bg-blue-500/10',
      color: 'text-blue-500',
      label: 'Image',
    },
  },

  // Videos
  {
    match: (m) => m.startsWith('video/'),
    config: {
      Icon: Video,
      bg: 'bg-purple-500/10',
      color: 'text-purple-500',
      label: 'Video',
    },
  },

  // Audio
  {
    match: (m) => m.startsWith('audio/'),
    config: {
      Icon: Music,
      bg: 'bg-pink-500/10',
      color: 'text-pink-500',
      label: 'Audio',
    },
  },

  // PDF
  {
    match: (m) => m === 'application/pdf',
    config: {
      Icon: FileText,
      bg: 'bg-red-500/10',
      color: 'text-red-500',
      label: 'PDF',
    },
  },

  // Word
  {
    match: (m) =>
      m.includes('msword') ||
      m.includes('wordprocessingml'),
    config: {
      Icon: FileText,
      bg: 'bg-blue-600/10',
      color: 'text-blue-600',
      label: 'Word',
    },
  },

  // Excel / CSV
  {
    match: (m) =>
      m.includes('spreadsheetml') ||
      m.includes('excel') ||
      m === 'text/csv',
    config: {
      Icon: FileSpreadsheet,
      bg: 'bg-green-600/10',
      color: 'text-green-600',
      label: 'Spreadsheet',
    },
  },

  // PowerPoint
  {
    match: (m) =>
      m.includes('presentationml') ||
      m.includes('powerpoint'),
    config: {
      Icon: FileImage,
      bg: 'bg-orange-600/10',
      color: 'text-orange-600',
      label: 'Presentation',
    },
  },

  // Archives
  {
    match: (m) =>
      [
        'application/zip',
        'application/x-zip-compressed',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/gzip',
        'application/x-tar',
      ].includes(m),
    config: {
      Icon: Archive,
      bg: 'bg-orange-500/10',
      color: 'text-orange-500',
      label: 'Archive',
    },
  },

  // JSON
  {
    match: (m) =>
      m === 'application/json' ||
      m.endsWith('+json'),
    config: {
      Icon: FileJson,
      bg: 'bg-yellow-600/10',
      color: 'text-yellow-600',
      label: 'JSON',
    },
  },

  // Code
  {
    match: (m) =>
      [
        'text/javascript',
        'application/javascript',
        'text/typescript',
        'text/html',
        'text/css',
        'text/plain',
        'application/xml',
      ].includes(m) ||
      m.endsWith('+xml'),
    config: {
      Icon: FileCode,
      bg: 'bg-yellow-500/10',
      color: 'text-yellow-500',
      label: 'Code',
    },
  },
];

export const getFileConfig = (mimeType?: string, _p0?: number): FileTypeConfig => {
  if (!mimeType) return defaultConfig;

  const normalized = mimeType.toLowerCase().split(';')[0]; // remove charset

  const match = mimeMatchers.find((m) => m.match(normalized));

  return match?.config ?? defaultConfig;
};

export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 Bytes';

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = today.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return `Today at ${time}`;
  }

  if (isYesterday) {
    return `Yesterday at ${time}`;
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


export const getReadableType = (mimeType: string) => {
  if (!mimeType) return "File";

  if (mimeType.includes("pdf")) return "PDF";
  if (mimeType.includes("image")) return "Image";
  if (mimeType.includes("video")) return "Video";
  if (mimeType.includes("audio")) return "Audio";
  if (mimeType.includes("spreadsheet")) return "Spreadsheet";
  if (mimeType.includes("presentation")) return "Presentation";
  if (mimeType.includes("word")) return "Document";

  return "File";
};