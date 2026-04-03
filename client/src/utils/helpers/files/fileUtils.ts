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
import { format, isToday, isYesterday, parseISO } from 'date-fns';



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
  if (!dateString) return "";

  const date = parseISO(dateString);
  if (isNaN(date.getTime())) return "";

  if (isToday(date)) {
    return `Today at ${format(date, "hh:mm a")}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, "hh:mm a")}`;
  }

  return format(date, "MMM d, yyyy, hh:mm a");
};


const readableMap: Record<string, string> = {
  pdf: "PDF",
  image: "Image",
  video: "Video",
  audio: "Audio",
  spreadsheet: "Spreadsheet",
  presentation: "Presentation",
  word: "Document",
};

export const getReadableType = (mimeType: string) => {
  if (!mimeType) return "File";

  const match = Object.keys(readableMap).find((key) =>
    mimeType.includes(key)
  );

  return match ? readableMap[match] : "File";
};


export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith("image")) return "image";
  if (mimeType.startsWith("video")) return "video";
  if (mimeType.startsWith("audio")) return "audio";
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("text") || mimeType.includes("sheet")) return "document";
  return "other";
}

export const inputCls =
  "w-full px-3 py-2 text-sm rounded-lg " +
  "border border-[rgba(var(--border-rgb),0.5)] " +
  "bg-[rgba(var(--bg),0.6)] text-[rgb(var(--text))] " +
  "outline-none transition-colors duration-150 " +
  "focus:border-[rgba(var(--primary),0.6)] " +
  "focus:ring-2 focus:ring-[rgba(var(--primary),0.1)] " +
  "placeholder:text-[rgba(var(--text),0.3)]";

export function downloadFileAsBlob(_fileId: string, fileName: string) {
  // Simulate download
  const blob = new Blob(["Simulated file content"], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}