import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, CheckCheck, Clock, Sparkles } from "lucide-react";
import type { NotificationItem } from "@/types/notificationType";

type NotificationModalProps = {
  messages: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead?: () => void;
};

export const NotificationModal: React.FC<NotificationModalProps> = ({
  messages,
  isOpen,
  onClose,
  onMarkAllRead,
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }} // Quick fade out
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            /* REMOVED 'animate-scaleIn' to prevent the closing delay conflict.
               Using a snappier transition for instant response.
            */
            transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
            className="relative h-full w-full max-w-[380px] shadow-2xl flex flex-col border-l"
            style={{ 
                backgroundColor: 'rgb(var(--card))', 
                borderColor: 'rgb(var(--border))',
                color: 'rgb(var(--text))'
            }}
          >
            {/* Header */}
            <div className="p-6 border-b sticky top-0 z-10" style={{ borderColor: 'rgb(var(--border))' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6" style={{ color: 'rgb(var(--primary))' }} />
                  <h2 className="text-xl font-black tracking-tight">Notifications</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-500/10 transition-all"
                >
                  <X className="w-5 h-5 opacity-60" color="red" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="badge bg-blue-500/10" style={{ color: 'rgb(var(--primary))' }}>
                  {messages.length} Total
                </span>
                {messages.length > 0 && (
                  <button 
                    onClick={onMarkAllRead}
                    className="text-xs flex items-center gap-1 font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="empty-state flex flex-col items-center justify-center h-full">
                  <div className="bg-gradient-to-tr from-blue-500/20 to-purple-500/20 p-8 rounded-full mb-4 animate-premium-spin">
                    <Sparkles className="w-12 h-12 opacity-40" />
                  </div>
                  <p className="opacity-50 text-sm font-medium">Nothing to see yet</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group relative p-4 rounded-2xl border transition-all hover:shadow-lg cursor-pointer overflow-hidden"
                    style={{ 
                        backgroundColor: 'rgba(var(--text), 0.03)', 
                        borderColor: 'rgb(var(--border))' 
                    }}
                  >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-40 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Just now
                            </span>
                        </div>
                        <h4 className="font-bold text-sm leading-tight group-hover:text-blue-500 transition-colors">
                            {msg.notification.title}
                        </h4>
                        <p className="text-xs mt-1 leading-relaxed opacity-70">
                            {msg.notification.body}
                        </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4" style={{ backgroundColor: 'rgb(var(--card))' }}>
               <button 
                className="w-full py-3 rounded-xl font-bold text-sm shadow-xl active:scale-[0.98] transition-transform"
                style={{ backgroundColor: 'rgb(var(--primary))', color: 'white' }}
               >
                 View Settings
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};