import { Router } from "express";
import { NotificationController } from "./notification.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();
const controller = new NotificationController();

router.get("/", authenticate, controller.getMyNotifications);
router.get("/unread-count", authenticate, controller.getUnreadCount);
router.patch("/read-all", authenticate, controller.markAllAsRead);
router.patch("/:id/read", authenticate, controller.markAsRead);

export default router;