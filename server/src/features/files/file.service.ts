import { prisma } from '../../../lib/prisma.js';

export class FileService {
  async uploadFile(userId: string, fileName: string, filePath: string, fileSize: number) {
    // 1. Get user storage info
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    // 2. Check if new file exceeds 100MB total limit
    const newTotal = Number(user.storageUsed) + fileSize;
    if (newTotal > Number(user.storageLimit)) {
      throw new Error("Storage limit exceeded (100MB max)");
    }

    // 3. Save file record and update user's storage count in a TRANSACTION
    // This ensures either both happen or neither happens
    return await prisma.$transaction(async (tx) => {
      const savedFile = await tx.file.create({
        data: {
          name: fileName,
          path: filePath,
          size: fileSize,
          ownerId: userId,
        }
      });

      await tx.user.update({
        where: { id: userId },
        data: { storageUsed: newTotal }
      });

      return savedFile;
    });
  }
}