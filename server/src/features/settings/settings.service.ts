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

    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new Error("Email is already in use");
      }
    }

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
    userId: string,
    currentPassword: string,
    newPassword: string,

  ) {
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
  profileData: {
    bio?: string;
    location?: string;
    website?: string;
  }
) {
  return prisma.userProfile.upsert ({
    where: {
      userId,
    },
    update: profileData,
    create:{
      userId,
      ...profileData
    }
  });
}

 async updateUserSettings(
  userId: string,
  settingsData: {
    theme?: string;
    language?: string;
    emailNotifications?: boolean;
  }
) {
  return prisma.userSettings.upsert({
    where: {
      userId,
    },
    update: settingsData,
    create:{
      userId,
      ...settingsData
    }
  });
}

}