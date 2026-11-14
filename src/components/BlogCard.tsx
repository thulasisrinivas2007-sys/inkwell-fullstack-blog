import { Link } from 'react-router-dom';
import { Calendar, User as UserIcon } from 'lucide-react';
import type { BlogWithAuthor } from '@/types';
import { getCategoryColor, truncate, formatRelativeTime } from '@/utils/format';

interface BlogCardProps {
  blog: BlogWithAuthor;
  showAuthor?: boolean;
  actions?: React.ReactNode;
}

export default function BlogCard({ blog, showAuthor = true, actions }: BlogCardProps) {
  const fallbackImage =
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect fill="#e2e8f0" width="400" height="240"/><text x="50%" y="50%" text-anchor="middle" dy=".35em" fill="#94a3b8" font-family="sans-serif" font-size="20">Inkwell</text></svg>`,
    );

  return (
    <article className="card group flex flex-col overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
      <Link to={`/blogs/${blog.id}`} className="block overflow-hidden">
        <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
          <img
            src={blog.featured_image || fallbackImage}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(blog.category)}`}
          >
            {blog.category}
          </span>
          <span className="text-xs text-slate-400">
            {formatRelativeTime(blog.created_at)}
          </span>
        </div>

        <Link to={`/blogs/${blog.id}`}>
          <h3 className="mb-2 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-600">
            {blog.title}
          </h3>
        </Link>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
          {truncate(blog.description, 120)}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {showAuthor && (
              <span className="flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5" />
                {blog.profiles?.full_name || 'Unknown'}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatRelativeTime(blog.created_at)}
            </span>
          </div>
          {actions && <div className="flex items-center gap-1.5">{actions}</div>}
        </div>
      </div>
    </article>
  );
}
