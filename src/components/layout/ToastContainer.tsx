import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl shadow-black/50 text-xs text-white animate-slide-up"
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              {toast.type === 'info' && (
                <Info className="w-4 h-4 text-brand-400 shrink-0" />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
