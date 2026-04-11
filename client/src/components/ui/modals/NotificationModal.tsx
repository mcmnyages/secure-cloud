import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Bell,
  CheckCheck,
  Clock,
  Sparkles,
  Trash2,
  Check,
} from "lucide-react";

import type { Notification } from "@/types/notificationTypes";

type TabType = "all" | "unread" | "read";

type NotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];

  onMarkAllRead?: () => void;
  onMarkRead?: (ids: string[]) => void;

  onDelete?: (ids: string[]) => void;
  onDeleteAll?: () => void;
};

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onMarkRead,
  onDelete,
  onDeleteAll,
}) => {
  const [tab, setTab] = useState<TabType>("unread");
  const [selected, setSelected] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const filteredNotifications = useMemo(() => {
    if (tab === "unread") return notifications.filter(n => !n.isRead);
    if (tab === "read") return notifications.filter(n => n.isRead);
    return notifications;
  }, [notifications, tab]);

  const formatTime = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} day ago`;
  };

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelected([]);
    setSelectionMode(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">

          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* MODAL */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative h-full w-full max-w-[380px] shadow-2xl flex flex-col border-l"
            style={{
              backgroundColor: "rgb(var(--card))",
              borderColor: "rgb(var(--border))",
              color: "rgb(var(--text))",
            }}
          >

            {/* HEADER */}
            <div className="p-6 border-b space-y-3">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-black">Notifications</h2>
                </div>

                <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full">
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </div>

              {/* TABS */}
              <div className="flex gap-2">
                {(["all", "unread", "read"] as TabType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-xs px-3 py-1 rounded-full border transition ${
                      tab === t
                        ? "bg-blue-500 text-white border-blue-500"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* ACTION BAR */}
              <div className="flex justify-between items-center">

                <span className="text-xs opacity-60">
                  {filteredNotifications.length} items
                </span>

                <div className="flex gap-3 text-xs">

                  <button onClick={() => setSelectionMode(!selectionMode)}>
                    {selectionMode ? "Cancel" : "Select"}
                  </button>

                  {notifications.length > 0 && (
                    <button onClick={onMarkAllRead} className="flex items-center gap-1">
                      <CheckCheck className="w-4 h-4" />
                      All Read
                    </button>
                  )}

                  {notifications.length > 0 && (
                    <button onClick={onDeleteAll} className="flex items-center gap-1 text-red-500">
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* BULK ACTIONS */}
              {selectionMode && selected.length > 0 && (
                <div className="flex gap-3 text-xs pt-2">

                  <button
                    onClick={() => {
                      onMarkRead?.(selected);
                      clearSelection();
                    }}
                    className="flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    Mark Selected
                  </button>

                  <button
                    onClick={() => {
                      onDelete?.(selected);
                      clearSelection();
                    }}
                    className="flex items-center gap-1 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </button>
                </div>
              )}

            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Sparkles className="w-10 h-10 opacity-40 mb-3" />
                  <p className="text-sm opacity-50">No notifications</p>
                </div>
              ) : (
                filteredNotifications.map((n, idx) => {
                  const isSelected = selected.includes(n.id);

                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() =>
                        selectionMode
                          ? toggleSelect(n.id)
                          : onMarkRead?.([n.id])
                      }
                      className={`relative p-4 rounded-2xl border cursor-pointer transition ${
                        isSelected ? "ring-2 ring-blue-500" : ""
                      }`}
                      style={{
                        backgroundColor: "rgba(var(--text), 0.03)",
                        borderColor: "rgb(var(--border))",
                      }}
                    >

                      {/* unread dot */}
                      {!n.isRead && (
                        <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full" />
                      )}

                      {/* delete single */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.([n.id]);
                        }}
                        className="absolute bottom-3 right-3 opacity-50 hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>

                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] opacity-40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(n.createdAt)}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm">{n.title}</h4>
                      <p className="text-xs opacity-70">{n.message}</p>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t">
              <button className="w-full py-3 rounded-xl font-bold text-sm bg-blue-500 text-white">
                View Settings
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};