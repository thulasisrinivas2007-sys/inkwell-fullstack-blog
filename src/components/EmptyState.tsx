import { Link } from 'react-router-dom';
import { FileText, PenSquare, Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: 'file' | 'pen' | 'search';
}

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
  icon = 'file',
}: EmptyStateProps) {
  const icons = {
    file: <FileText className="h-10 w-10" />,
    pen: <PenSquare className="h-10 w-10" />,
    search: <Search className="h-10 w-10" />,
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/50 py-16 px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        {icons[icon]}
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500">{message}</p>
      {actionLabel && actionHref && (
        <Link to={actionHref} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
