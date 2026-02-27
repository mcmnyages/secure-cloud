import { prisma } from '../../../lib/prisma.js';
import { FileRepository } from '../repositories/file.repository.js';
import { StorageService } from './storage.service.js';
import { VersionService } from './version.service.js';
import { FilesystemService } from './filesystem.service.js';
import { DuplicateFileError } from '../../../exceptions/file/file.exceptions.js';

export class FileCommandService {

    private repo = new FileRepository();
    private storage = new StorageService();
    private versionService = new VersionService();
    private fsService = new FilesystemService();

    async uploadBatch(
        userId: string,
        files: Express.Multer.File[],
        replace: boolean
    ) {

        const names = files.map(
            (f) => f.originalname
        );

        if (new Set(names).size !== names.length) {
            const duplicate = names.find(
                (name, index) => names.indexOf(name) !== index
            );
            throw new DuplicateFileError(
                duplicate || names[0]!
            );
        }

        return prisma.$transaction(
            async (tx) => {

                let totalStorageIncrement = 0;

                const results: any[] = [];

                const existingFiles =
                    await this.repo.findExistingFiles(
                        userId,
                        names
                    );

                const existingMap =
                    new Map<string, any>(
                        existingFiles.map(file => {

                            const current =
                                file.versions.find(
                                    v => v.isCurrent
                                );

                            return [
                                current?.displayName!,
                                file
                            ];

                        })
                    );

                for (const file of files) {

                    const existing =
                        existingMap.get(
                            file.originalname
                        );

                    if (existing && replace) {

                        const nextVersion =
                            await this.versionService
                                .getNextVersionNumber(
                                    tx,
                                    existing.id
                                );

                        await this.versionService
                            .deactivateCurrent(
                                tx,
                                existing.id
                            );

                        const version =
                            await tx.fileVersion.create({
                                data: {
                                    fileId: existing.id,
                                    versionNumber:
                                        nextVersion,
                                    storageKey:
                                        file.path,
                                    originalName:
                                        file.originalname,
                                    displayName:
                                        file.originalname,
                                    size:
                                        file.size,
                                    mimeType:
                                        file.mimetype,
                                    isCurrent: true
                                }
                            });

                        totalStorageIncrement +=
                            file.size;

                        results.push({
                            fileId:
                                existing.id,
                            version
                        });

                    }

                    else if (existing && !replace) {

                        throw new DuplicateFileError(
                            file.originalname
                        );

                    }

                    else {

                        const newFile =
                            await this.repo.createFile(
                                tx,
                                userId
                            );

                        const version =
                            await tx.fileVersion.create({
                                data: {
                                    fileId:
                                        newFile.id,
                                    versionNumber:
                                        1,
                                    storageKey:
                                        file.path,
                                    originalName:
                                        file.originalname,
                                    displayName:
                                        file.originalname,
                                    size:
                                        file.size,
                                    mimeType:
                                        file.mimetype,
                                    isCurrent: true
                                }
                            });

                        totalStorageIncrement +=
                            file.size;

                        results.push({
                            fileId:
                                newFile.id,
                            version
                        });

                    }

                }

                await this.storage.checkLimit(
                    userId,
                    totalStorageIncrement
                );

                await this.repo.updateStorage(
                    tx,
                    userId,
                    totalStorageIncrement
                );

                return results;

            }
        );

    }

    async uploadNewVersion(
        fileId: string,
        userId: string,
        file: Express.Multer.File
    ) {
        return prisma.$transaction(
            async (tx) => {
                const existingFile =
                    await this.repo.findByIdAndUser(
                        fileId,
                        userId
                    );

                if (!existingFile) {
                    throw new Error(
                        "File not found or access denied"
                    );
                }

                if (!file.path) {
                    console.error('uploadNewVersion: file.path is undefined for file', file);
                    throw new Error('File path is missing. Cannot create file version.');
                }

                const nextVersion =
                    await this.versionService
                        .getNextVersionNumber(
                            tx,
                            fileId
                        );
                await this.versionService.deactivateCurrent(
                    tx,
                    fileId
                );
                const version = await tx.fileVersion.create({
                    data: {
                        fileId,
                        versionNumber: nextVersion,
                        storageKey: file.path,
                        originalName: file.originalname,
                        displayName: file.originalname,
                        size: file.size,
                        mimeType: file.mimetype,
                        isCurrent: true
                    }
                });

                await this.storage.checkLimit(
                    userId,
                    file.size
                );
                await this.repo.updateStorage(
                    tx,
                    userId,
                    file.size
                );

                return version;
            }
        );
    }


    async renameFile(
        fileId: string,
        userId: string,
        newName: string
    ) {
        const file = await prisma.file.findFirst({
            where: {
                id: fileId,
                ownerId: userId,
                deletedAt: null
            },
            include: {
                versions: true
            }
        });

        if (!file) {
            throw new Error("File not found or access denied");
        }

        const currentVersion = file.versions.find(v => v.isCurrent);

        if (!currentVersion) {
            throw new Error("No active file version found");
        }

        return prisma.fileVersion.update({
            where: { id: currentVersion.id },
            data: { displayName: newName }
        });
    }

    async restoreVersion(
        fileId: string,
        versionId: string,
        userId: string
    ) {
        const file =
            await this.repo.findByIdAndUser(
                fileId,
                userId
            );

        if (!file) {
            throw new Error("File not found");
        }

        const version =
            file.versions.find(
                v => v.id === versionId
            );

        if (!version) {
            throw new Error("Version not found");
        }

        return prisma.$transaction(
            async (tx) => {
                await this.versionService.deactivateCurrent(
                    tx,
                    fileId
                );

                await this.versionService.activateVersion(
                    tx,
                    versionId
                );

                return {
                    message: "Version restored successfully"
                };
            }
        );
    }



    async deleteFile(
        fileId: string,
        userId: string
    ) {

        const file =
            await this.repo.findFile(
                fileId,
                userId
            );

        if (!file) {
            throw new Error(
                "File not found"
            );
        }

        return prisma.$transaction(
            async (tx) => {

                await tx.file.update({
                    where: {
                        id: fileId
                    },
                    data: {
                        deletedAt: new Date()
                    }
                });

                const totalSize =
                    file.versions.reduce(
                        (a, v) => a + v.size,
                        0
                    );

                await this.repo.decrementStorage(
                    tx,
                    userId,
                    totalSize
                );

                await this.fsService.deleteMany(
                    file.versions.map(
                        v => v.storageKey
                    )
                );

                return {
                    message:
                        "File deleted successfully"
                };

            }
        );

    }

    async bulkDeleteFiles(
        fileIds: string[],
        userId: string
    ) {

        const files =
            await this.repo.findFilesByIds(
                fileIds,
                userId
            );

        if (!files.length) {
            throw new Error(
                "No files found"
            );
        }

        return prisma.$transaction(
            async (tx) => {

                let totalSize = 0;

                for (const file of files) {

                    for (const version of file.versions) {
                        totalSize += version.size;
                    }

                    await tx.file.update({
                        where: {
                            id: file.id
                        },
                        data: {
                            deletedAt: new Date()
                        }
                    });

                    await this.fsService.deleteMany(
                        file.versions.map(
                            v => v.storageKey
                        )
                    );

                }

                await this.repo.decrementStorage(
                    tx,
                    userId,
                    totalSize
                );

                return {
                    message:
                        "Files deleted successfully"
                };

            }
        );

    }

}


