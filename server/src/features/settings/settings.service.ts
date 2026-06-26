// settings.service.ts
import bcrypt from 'bcrypt';
import { prisma } from "../../lib/prisma.js";
import type { UpdateUserDto, UpdatePasswordDto } from "./settings.types.js";


export class SettingsService {
  async getUserSettings(userId: string) {
    return prisma.userSettings.findUnique({
      where: { userId },
    });
  }

   async updateUser(
    userId: string,
    data: UpdateUserDto
  ) {
    const updateData = Object.fromEntries(
      Object.entries({
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl,
      }).filter(([, value]) => value !== undefined)
    );

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    });
  }


  async updatePassword(
    userId:string,
    currentPassword:string,
    newPassword:string,
  
  ){
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    });

    if (!user || !user.password) {
      throw new Error('User not Found!');
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

        if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

  }

  async updateUserProfile(
    userId: string,
    profileData: Record<string, any>
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        profile: profileData,
      },
    });
  }

  async updateUserSettings(
    userId: string,
    settingsData: Record<string, any>
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        settings: settingsData,
      },
    });
  }
}