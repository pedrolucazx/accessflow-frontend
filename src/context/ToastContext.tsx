import React, { createContext, useState } from 'react';
import { TOAST_DURATION } from '../config/constants';

type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

export interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), TOAST_DURATION);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast--${toast.type}`}>
            <strong className="toast__title">{toast.title}</strong>
            {toast.description && (
              <p className="toast__description">{toast.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
