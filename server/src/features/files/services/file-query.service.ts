import { prisma } from '../../../lib/prisma.js';

export class FileQueryService {

    async listUserFiles(userId: string) {

        return prisma.file.findMany({
            where: {
                ownerId: userId,
                deletedAt: null
            },
            include: {
                versions: {
                    where: { isCurrent: true }
                }
            }
        });

    }

    async getFileForUser(
        fileId: string,
        userId: string
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
            throw new Error("File not found");
        }

        const current =
            file.versions.find(
                v => v.isCurrent
            );

        if (!current) {
            throw new Error(
                "No version found"
            );
        }

        return {
            path: current.storageKey,
            name: current.displayName
        };

    }

    async getFileVersionForUser(
        fileId: string,
        versionId: string,
        userId: string
    ) {
        const version = await prisma.fileVersion.findFirst({
            where: {
                id: versionId,
                fileId,
                file: {
                    ownerId: userId,
                    deletedAt: null
                }
            }
        });

        if (!version) {
            throw new Error("Version not found");
        }
        return version;
    }

    async getFileVersions(
        fileId: string,
        userId: string
    ) {

        return prisma.fileVersion.findMany({
            where: {
                fileId,
                file: {
                    ownerId: userId,
                    deletedAt: null
                }
            },
            orderBy: {
                versionNumber: 'desc'
            }
        });

    }


}