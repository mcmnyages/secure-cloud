// settings.controller.ts

import type { Response, NextFunction } from "express";
import { SettingsService } from "./settings.service.js";
import type { SettingsRequest } from "./settings.types.js";

export class SettingsController {
  constructor(
    private readonly settingsService = new SettingsService()
  ) {}

  private getUserId(req: SettingsRequest): string {
    if (!req.userId) {
      throw new Error("Unauthorized");
    }

    return req.userId;
  }

  getUserSettings = async (
    req: SettingsRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const settings = await this.settingsService.getUserSettings(
        this.getUserId(req)
      );

      return res.status(200).json(settings);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: SettingsRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.settingsService.updateUser(
        this.getUserId(req),
        req.body
      );

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };


  updatePassword = async (
    req: SettingsRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.settingsService.updatePassword(
        this.getUserId(req),
        req.body.currentPassword,
        req.body.newPassword
      );

      return res.status(200).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  updateUserProfile = async (
    req: SettingsRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.settingsService.updateUserProfile(
        this.getUserId(req),
        req.body
      );

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUserSettings = async (
    req: SettingsRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.settingsService.updateUserSettings(
        this.getUserId(req),
        req.body
      );

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}