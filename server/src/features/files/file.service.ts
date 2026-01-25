import { prisma } from '../../../lib/prisma.js';

export class FileService {
  async getUserStorageStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { storageLimit: true, storageUsed: true }
    });
    
    if (!user) throw new Error("User not found");
    return user;
  }

  // We will add the 'uploadFile' method here in the next step
}