import { FileCommandService } from './services/file-command.service.js';
import { FileQueryService } from './services/file-query.service.js';

export class FileService {

  private command = new FileCommandService();
  private query = new FileQueryService();

  uploadBatch(
    userId: string,
    files: Express.Multer.File[],
    replace: boolean
  ) {
    return this.command.uploadBatch(
      userId,
      files,
      replace
    );
  }

  listUserFiles(userId: string) {
    return this.query.listUserFiles(userId);
  }

  getFileForUser(
    fileId: string,
    userId: string
  ) {
    return this.query.getFileForUser(
      fileId,
      userId
    );
  }

  getFileVersions(
    fileId: string,
    userId: string
  ) {
    return this.query.getFileVersions(
      fileId,
      userId
    );
  }

  getFileVersionForUser(
    fileId: string,
    versionId: string,
    userId: string
  ) {
    return this.query.getFileVersionForUser(
      fileId,
      versionId,
      userId
    );
  }

  uploadNewVersion(
    fileId: string,
    userId: string,
    file: Express.Multer.File
  ) {
    return this.command.uploadNewVersion(
      fileId,
      userId,
      file
    );
  }

  renameFile(
    fileId: string,
    userId: string,
    newName: string
  ) {
    return this.command.renameFile(
      fileId,
      userId,
      newName
    );
  }
  
   restoreVersion(
    fileId: string,
    versionId: string,
    userId: string
  ) {
    return this.command.restoreVersion(
      fileId,
      versionId,
      userId
    );
  }

   deleteFile(
    fileId: string,
    userId: string
  ) {
    return this.command.deleteFile(
      fileId,
      userId
    );
  }

  bulkDeleteFiles(
    fileIds: string[],
    userId: string
  ) {
    return this.command.bulkDeleteFiles(
      fileIds,
      userId
    );
  }

}