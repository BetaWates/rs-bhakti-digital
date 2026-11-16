import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { Icon, type IconName } from "@/components/shared/Icon";
import type { ToastMessage, ToastType } from "@/lib/types";

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 4500) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastMessage = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [dismissToast]
  );

  const success = useCallback(
    (message: string, duration?: number) => showToast(message, "success", duration),
    [showToast]
  );
  const error = useCallback(
    (message: string, duration?: number) => showToast(message, "error", duration),
    [showToast]
  );
  const warning = useCallback(
    (message: string, duration?: number) => showToast(message, "warning", duration),
    [showToast]
  );
  const info = useCallback(
    (message: string, duration?: number) => showToast(message, "info", duration),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, success, error, warning, info, dismissToast }}
    >
      {children}

      {/* Toast Notification Container */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 200);
  };

  const typeConfig: Record<
    ToastType,
    { icon: IconName; bg: string; border: string; text: string; iconColor: string }
  > = {
    success: {
      icon: "check",
      bg: "bg-white",
      border: "border-emerald-200",
      text: "text-[#172b4d]",
      iconColor: "text-emerald-600 bg-emerald-50",
    },
    error: {
      icon: "alertCircle",
      bg: "bg-white",
      border: "border-rose-200",
      text: "text-[#172b4d]",
      iconColor: "text-rose-600 bg-rose-50",
    },
    warning: {
      icon: "alertCircle",
      bg: "bg-white",
      border: "border-amber-200",
      text: "text-[#172b4d]",
      iconColor: "text-amber-600 bg-amber-50",
    },
    info: {
      icon: "info",
      bg: "bg-white",
      border: "border-blue-200",
      text: "text-[#172b4d]",
      iconColor: "text-blue-600 bg-blue-50",
    },
  };

  const config = typeConfig[toast.type];

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-lg border shadow-lg transition-all duration-200 ${
        config.bg
      } ${config.border} ${config.text} ${
        isExiting ? "opacity-0 translate-y-2 scale-95" : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${config.iconColor}`}
        >
          <Icon name={config.icon} size={16} />
        </div>
        <p className="text-xs font-medium leading-relaxed">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={handleClose}
        aria-label="Tutup notifikasi"
        className="p-1 -mr-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors shrink-0 cursor-pointer"
      >
        <Icon name="close" size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a safe fallback if used outside provider so app doesn't crash
    return {
      showToast: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      dismissToast: () => {},
    };
  }
  return context;
}

export default ToastProvider;
