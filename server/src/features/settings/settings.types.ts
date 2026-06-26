// types/auth-request.ts

import type { Request } from "express";

export interface SettingsRequest extends Request {
  userId?: string;
}

// settings.types.ts
export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  avatarUrl?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}