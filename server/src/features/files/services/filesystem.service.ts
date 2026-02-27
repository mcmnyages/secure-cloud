import fs from 'fs/promises';

export class FilesystemService {

  async deleteFile(path: string) {
    await fs.unlink(path);
  }

  async deleteMany(paths: string[]) {

    for (const path of paths) {
      await fs.unlink(path);
    }

  }

}