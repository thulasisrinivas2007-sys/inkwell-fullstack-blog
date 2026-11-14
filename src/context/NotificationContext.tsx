import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationItem {
  id: number;
  type: NotificationType;
  message: string;
}

interface NotificationContextValue {
  notify: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

let nextId = 1;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (type: NotificationType, message: string) => {
      const id = nextId++;
      setItems((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {items.map((item) => (
          <NotificationToast key={item.id} item={item} onClose={() => remove(item.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function NotificationToast({ item, onClose }: { item: NotificationItem; onClose: () => void }) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-brand-500" />,
  };

  const borders = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    info: 'border-l-brand-500',
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-slate-200 border-l-4 ${borders[item.type]} bg-white px-4 py-3 shadow-lg animate-slide-up min-w-[300px] max-w-[400px]`}
    >
      <span className="mt-0.5 shrink-0">{icons[item.type]}</span>
      <p className="flex-1 text-sm font-medium text-slate-700">{item.message}</p>
      <button
        onClick={onClose}
        className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
