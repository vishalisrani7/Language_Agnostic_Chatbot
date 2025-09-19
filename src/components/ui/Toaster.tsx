import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export type Toast = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

interface ToasterProps {
  toasts?: Toast[];
}

const toastQueue: Toast[] = [];
const listeners: Array<(toasts: Toast[]) => void> = [];

export const toast = {
  success: (message: string, duration = 5000) => {
    addToast({ id: Date.now().toString(), message, type: 'success', duration });
  },
  error: (message: string, duration = 5000) => {
    addToast({ id: Date.now().toString(), message, type: 'error', duration });
  },
  warning: (message: string, duration = 5000) => {
    addToast({ id: Date.now().toString(), message, type: 'warning', duration });
  },
  info: (message: string, duration = 5000) => {
    addToast({ id: Date.now().toString(), message, type: 'info', duration });
  }
};

const addToast = (newToast: Toast) => {
  toastQueue.push(newToast);
  notifyListeners();
  
  setTimeout(() => {
    removeToast(newToast.id);
  }, newToast.duration);
};

const removeToast = (id: string) => {
  const index = toastQueue.findIndex(toast => toast.id === id);
  if (index > -1) {
    toastQueue.splice(index, 1);
    notifyListeners();
  }
};

const notifyListeners = () => {
  listeners.forEach(listener => listener([...toastQueue]));
};

const subscribe = (listener: (toasts: Toast[]) => void) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

export const Toaster: React.FC<ToasterProps> = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = subscribe(setToasts);
    return unsubscribe;
  }, []);

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg border transition-all duration-300 transform translate-x-0 ${getBackgroundColor(toast.type)}`}
        >
          {getIcon(toast.type)}
          <p className="text-sm font-medium text-gray-900">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};