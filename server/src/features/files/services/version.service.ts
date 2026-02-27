export class VersionService {
    async getCurrentVersion(tx: any, fileId: string) {
        return tx.fileVersion.findFirst({
            where: {
                fileId,
                isCurrent: true
            }
        });
    }

    async getNextVersionNumber(tx: any, fileId: string) {

        const latest =
            await tx.fileVersion.findFirst({
                where: { fileId },
                orderBy: {
                    versionNumber: 'desc'
                }
            });

        return (latest?.versionNumber ?? 0) + 1;

    }

    async activateVersion(tx: any, versionId: string) {

        const version = await tx.fileVersion.update({
            where: { id: versionId },
            data: { isCurrent: true }
        });

        return version;

    }

    async deactivateCurrent(tx: any, fileId: string) {

        await tx.fileVersion.updateMany({
            where: {
                fileId,
                isCurrent: true
            },
            data: {
                isCurrent: false
            }
        });

    }

}