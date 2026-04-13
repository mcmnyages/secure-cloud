import multer from 'multer';
import path from 'path';
import fs from 'fs';

const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

type UploadOptions = {
  folder?: string;
  getFolder?: (req: any, file: Express.Multer.File) => string;
};

export const upload = (options: UploadOptions = {}) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const folder =
        options.getFolder?.(req, file) ||
        options.folder ||
        'misc';

      const fullPath = path.resolve('uploads', folder);

      ensureDirExists(fullPath);
      cb(null, fullPath);
    },

    filename: (req, file, cb) => {
      const uniqueSuffix =
        Date.now() + '-' + Math.round(Math.random() * 1e9);

      const sanitized = file.originalname.replace(/\s+/g, '_');

      cb(null, `${uniqueSuffix}-${sanitized}`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }
  });
};