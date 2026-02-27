import { StorageLimitExceededError } from '../../../exceptions/file/file.exceptions.js';
import { FileRepository } from '../repositories/file.repository.js';

export class StorageService {

  private repo = new FileRepository();

  async checkLimit(userId: string, increment: number) {

    const user = await this.repo.findUser(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const newTotal =
      Number(user.storageUsed) +
      increment;

    if (newTotal > Number(user.storageLimit)) {
      throw new StorageLimitExceededError();
    }

    return user;
  }

}