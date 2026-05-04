import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg text-sm font-medium border transition-all animate-slide-up
            ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/40 dark:border-green-700 dark:text-green-300' : ''}
            ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/40 dark:border-red-700 dark:text-red-300' : ''}
            ${toast.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300' : ''}
          `}
        >
          {toast.type === 'success' && <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />}
          {toast.type === 'error' && <XCircle className="h-4 w-4 mt-0.5 shrink-0" />}
          {toast.type === 'info' && <Info className="h-4 w-4 mt-0.5 shrink-0" />}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => dismissToast(toast.id)} className="shrink-0 hover:opacity-70 transition-opacity">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
