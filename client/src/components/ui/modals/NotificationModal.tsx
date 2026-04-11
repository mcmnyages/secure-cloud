import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import {
  X,
  Bell,
  CheckCheck,
  Clock,
  Sparkles,
  Trash2,
  Check,
  ArrowLeft,
  SquareCheck,
  Square,
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
  const [tab, setTab] = useState<TabType>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [viewingNotification, setViewingNotification] = useState<Notification | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    if (!isOpen) {
      setViewingNotification(null);
      setSelectionMode(false);
      setSelected([]);
    }
  }, [isOpen]);

  const filteredNotifications = useMemo(() => {
    let list = [...notifications];
    if (tab === "unread") list = notifications.filter((n) => !n.isRead);
    if (tab === "read") list = notifications.filter((n) => n.isRead);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, tab]);

  const isAllSelected = filteredNotifications.length > 0 && selected.length === filteredNotifications.length;

  const toggleSelectAll = () => {
    if (isAllSelected) setSelected([]);
    else setSelected(filteredNotifications.map((n) => n.id));
  };

  // Shared Styles using your variables
  const themeCard = { backgroundColor: "rgb(var(--card))", color: "rgb(var(--text))" };
  const themeBorder = { borderColor: "rgb(var(--border))" };
  

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* MODAL CONTAINER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            style={themeCard}
            className="relative h-full w-full sm:max-w-[420px] shadow-2xl flex flex-col border-l transition-colors duration-300"
          >
            {/* HEADER */}
            <div className="p-5 sm:p-6 border-b" style={themeBorder}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-2xl">
                    <Bell className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight">Activity</h2>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 opacity-50 hover:opacity-100" />
                </button>
              </div>

              {/* TABS */}
              <div className="flex p-1 rounded-xl border" style={{ ...themeBorder, backgroundColor: "rgba(var(--text), 0.03)" }}>
                {(["all", "unread", "read"] as TabType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setSelected([]); }}
                    className={`flex-1 text-[10px] font-black py-2.5 rounded-lg transition-all tracking-widest ${
                      tab === t 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                        : "opacity-40 hover:opacity-100"
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BAR */}
            <div className="px-6 py-3 flex justify-between items-center border-b" style={{ ...themeBorder, backgroundColor: "rgba(var(--text), 0.01)" }}>
              <div className="flex items-center gap-4">
                {selectionMode ? (
                  <button onClick={toggleSelectAll} className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                    {isAllSelected ? <SquareCheck className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </button>
                ) : (
                  <button 
                    onClick={onMarkAllRead} 
                    className="flex items-center gap-2 text-[10px] font-bold opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest"
                  >
                    <CheckCheck className="w-4 h-4" /> Mark All Read
                  </button>
                )}
              </div>
              <button 
                onClick={() => setSelectionMode(!selectionMode)}
                className="text-[10px] font-black text-blue-500 tracking-widest hover:brightness-110"
              >
                {selectionMode ? "DONE" : "MANAGE"}
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto relative scrollbar-hide">
              <AnimatePresence mode="wait">
                {viewingNotification ? (
                  /* DETAIL VIEW */
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={themeCard}
                    className="absolute inset-0 z-40 p-6 sm:p-8 flex flex-col"
                  >
                    <button 
                      onClick={() => setViewingNotification(null)}
                      className="flex items-center gap-2 text-xs font-black opacity-40 hover:opacity-100 mb-8 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> BACK
                    </button>
                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Notification Detail</span>
                        <h3 className="text-2xl font-black leading-tight">{viewingNotification.title}</h3>
                      </div>
                      <p className="leading-relaxed text-sm sm:text-base whitespace-pre-wrap pt-6 border-t" style={themeBorder}>
                        {viewingNotification.message}
                      </p>
                    </div>
                    <button 
                      onClick={() => { onDelete?.([viewingNotification.id]); setViewingNotification(null); }}
                      className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> DELETE THIS NOTIFICATION
                    </button>
                  </motion.div>
                ) : (
                  /* LIST VIEW */
                  <div className="p-4 space-y-3">
                    <LayoutGroup>
                      {filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 opacity-20">
                          <Sparkles className="w-16 h-16 mb-4 stroke-[1px]" />
                          <p className="text-xs font-black tracking-[0.3em] uppercase">No Notifications</p>
                        </div>
                      ) : (
                        filteredNotifications.map((n) => (
                          <motion.div
                            layout
                            key={n.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={() => {
                              if (selectionMode) {
                                setSelected(prev => prev.includes(n.id) ? prev.filter(i => i !== n.id) : [...prev, n.id]);
                              } else {
                                setViewingNotification(n);
                                if (!n.isRead) onMarkRead?.([n.id]);
                              }
                            }}
                            className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                              selected.includes(n.id) ? "ring-2 ring-blue-500 bg-blue-500/5" : "hover:bg-black/5 dark:hover:bg-white/5"
                            }`}
                            style={themeBorder}
                          >
                            <div className="flex gap-4">
                              {selectionMode && (
                                <div className={`mt-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                                  selected.includes(n.id) ? "bg-blue-500 border-blue-500" : "opacity-20 border-current"
                                }`}>
                                  {selected.includes(n.id) && <Check className="w-3 h-3 text-white" />}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[9px] font-black opacity-30 uppercase tracking-wider flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    {new Date(n.createdAt).toLocaleDateString()}
                                  </span>
                                  {!n.isRead && (
                                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                                  )}
                                </div>
                                <h4 className={`text-sm font-bold truncate ${!n.isRead ? "opacity-100" : "opacity-50"}`}>
                                  {n.title}
                                </h4>
                                <p className="text-xs opacity-40 line-clamp-1 mt-1 group-hover:opacity-70 transition-opacity">
                                  {n.message}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </LayoutGroup>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* BULK ACTION FOOTER */}
            <AnimatePresence>
              {selectionMode && selected.length > 0 && (
                <motion.div 
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  style={{ ...themeCard, borderTopColor: "rgb(var(--border))" }}
                  className="p-6 border-t z-50 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.1)]"
                >
                  <div className="flex items-center justify-between mb-5 px-2">
                    <span className="text-lg font-black">{selected.length} Selected</span>
                    <button onClick={() => setSelected([])} className="text-xs font-bold opacity-40 hover:opacity-100">Clear</button>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { onMarkRead?.(selected); setSelectionMode(false); }}
                      className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Mark Read
                    </button>
                    <button 
                      onClick={() => {
                        if (selected.length === notifications.length) onDeleteAll?.();
                        else onDelete?.(selected);
                        setSelectionMode(false);
                      }}
                      className="px-6 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl font-black text-xs transition-all active:scale-95"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};