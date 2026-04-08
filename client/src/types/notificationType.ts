// types/notificationType.ts

// All known actions, plus allow new ones dynamically
export type ClickAction =
  | "OPEN_FILE"
  | "OPEN_STORAGE_SETTINGS"
  | "OPEN_SHARED_FILE"
  | "OPEN_SYNC_STATUS"
  | "OPEN_FOLDER"
  | "OPEN_TRASH"
  | "OPEN_BACKUPS"
  | "OPEN_OFFLINE_FILES"
  | "RETRY_UPLOAD"
  | "OPEN_COMMENTS"
  | "OPEN_VERSION_HISTORY"
  | "OPEN_SECURITY_SETTINGS"
  | "OPEN_PLAN_DETAILS"
  | string; // ✅ allow new actions dynamically

// Flexible notification data for all actions
export type NotificationData = {
  click_action: ClickAction;
  [key: string]: any; // ✅ dynamic extra fields like fileId, folderId, plan, etc.
};

// Raw message from API / mock
export type Message = {
  token: string;
  notification: {
    title: string;
    body: string;
  };
  data: NotificationData;
};

// Enhanced message for UI with read state and unique ID
export type NotificationItem = Message & {
  id: string;     // unique key for UI
  read: boolean;  // read/unread state
};