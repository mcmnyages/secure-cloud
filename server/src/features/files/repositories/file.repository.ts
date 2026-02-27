import { prisma } from '../../../lib/prisma.js';

export class FileRepository {

  async findUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId }
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async findByIdAndUser(fileId: string, userId: string) {
    return prisma.file.findFirst({
      where: {
        id: fileId,
        ownerId: userId,
        deletedAt: null
        },
        include: { versions: true }
    });
  }

  async findFile(fileId: string, userId: string) {
    return prisma.file.findFirst({
      where: {
        id: fileId,
        ownerId: userId,
        deletedAt: null
      },
      include: { versions: true }
    });
  }

  async findFilesByIds(fileIds: string[], userId: string) {
    return prisma.file.findMany({
      where: {
        id: { in: fileIds },
        ownerId: userId,
        deletedAt: null
      },
      include: { versions: true }
    });
  }

  async findExistingFiles(userId: string, names: string[]) {
    return prisma.file.findMany({
      where: {
        ownerId: userId,
        deletedAt: null,
        versions: {
          some: {
            isCurrent: true,
            displayName: { in: names }
          }
        }
      },
      include: { versions: true }
    });
  }

  async createFile(tx: any, userId: string) {
    return tx.file.create({
      data: { ownerId: userId }
    });
  }

  async renameFile(tx: any, fileId: string, newName: string) {
    const currentVersion =
      await tx.fileVersion.findFirst({
        where: {
          fileId,
          isCurrent: true
        }
      });

    return tx.fileVersion.update({
      where: { id: currentVersion.id },
      data: { displayName: newName }
    });

  }

  async updateStorage(tx: any, userId: string, amount: number) {
    return tx.user.update({
      where: { id: userId },
      data: {
        storageUsed: {
          increment: amount
        }
      }
    });
  }

  async decrementStorage(tx: any, userId: string, amount: number) {
    return tx.user.update({
      where: { id: userId },
      data: {
        storageUsed: {
          decrement: amount
        }
      }
    });
  }

}