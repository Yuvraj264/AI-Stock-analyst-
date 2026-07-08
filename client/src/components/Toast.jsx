import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info as InfoIcon } from 'lucide-react';

const ToastContext = createContext(null);

/**
 * Custom hook to dispatch Toast notifications.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * ToastProvider Wrapper.
 * Houses the stacked notification state and overlays.
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast stack overlay portal */}
      <div 
        className="fixed top-20 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none" 
        role="alert" 
        aria-live="polite"
      >
        {toasts.map((toast) => {
          let typeClass = '';
          let Icon = InfoIcon;

          if (toast.type === 'success') {
            typeClass = 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-450';
            Icon = CheckCircle;
          } else if (toast.type === 'error') {
            typeClass = 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-955/20 dark:border-rose-900/50 dark:text-rose-455';
            Icon = AlertCircle;
          } else {
            typeClass = 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-450';
            Icon = InfoIcon;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slideIn ${typeClass}`}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs font-bold leading-normal">{toast.message}</div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0 cursor-pointer"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
