import type { Request, Response } from 'express';
import { NotificationService } from './notification.service.js';

const service = new NotificationService();

export class NotificationController {
  // GET /notifications
  async getMyNotifications(req: Request, res: Response) {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { page, limit, onlyUnread } = req.query;

    const notifications = await service.getUserNotifications(req.userId, {
      page: typeof page === 'string' ? Number(page) : 1,
      limit: typeof limit === 'string' ? Number(limit) : 10,
      onlyUnread: onlyUnread === 'true',
    });

    return res.status(200).json({ success: true, data: notifications });
  }

  // GET /notifications/unread-count
  async getUnreadCount(req: Request, res: Response) {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const count = await service.getUnreadCount(req.userId);

    return res.status(200).json({ success: true, data: { count } });
  }

  // PATCH /notifications/:id/read
  async markAsRead(req: Request, res: Response) {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification id' });
    }

    await service.markAsRead(id, req.userId);

    return res.status(200).json({ success: true, message: 'Notification marked as read' });
  }

  // PATCH /notifications/read-all
  async markAllAsRead(req: Request, res: Response) {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    await service.markAllAsRead(req.userId);

    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  }

  // DELETE /notifications/:id
  async deleteNotification(req: Request, res: Response) {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ success: false, message: 'Invalid notification id' });
    }

    await service.deleteNotification(id, req.userId);

    return res.status(200).json({ success: true, message: 'Notification deleted' });
  }

  // DELETE /notifications
  async deleteAllNotifications(req: Request, res: Response) {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    await service.deleteAllNotifications(req.userId);

    return res.status(200).json({ success: true, message: 'All notifications deleted' });
  }
}