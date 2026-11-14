import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  User as UserIcon,
  Edit as EditIcon,
  Trash2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import type { BlogWithAuthor } from '@/types';
import { formatDate, getCategoryColor } from '@/utils/format';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<BlogWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchBlog() {
      if (!id) return;
      const { data, error } = await supabase
        .from('blogs')
        .select('*, profiles:profiles(full_name, avatar_url)')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        notify('error', error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setBlog(data as BlogWithAuthor);
      setLoading(false);
    }
    fetchBlog();
  }, [id, notify]);

  const isOwner = blog && user && blog.user_id === user.id;

  async function handleDelete() {
    setDeleting(true);
    const { error } = await supabase.from('blogs').delete().eq('id', id!);
    setDeleting(false);
    setShowDeleteDialog(false);

    if (error) {
      notify('error', error.message);
      return;
    }

    notify('success', 'Blog deleted successfully!');
    navigate('/dashboard');
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-slate-300" />
        <h1 className="text-xl font-bold text-slate-900">Blog not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          This blog doesn't exist or may have been removed.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-12">
      {/* Hero image */}
      {blog.featured_image && (
        <div className="relative h-[300px] w-full overflow-hidden bg-slate-200 sm:h-[420px]">
          <img
            src={blog.featured_image}
            alt={blog.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).parentElement!.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Category + meta */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(blog.category)}`}
          >
            <Tag className="h-3 w-3" /> {blog.category}
          </span>
          {!blog.published && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              Draft
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          {blog.title}
        </h1>

        {/* Author + date */}
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <UserIcon className="h-4 w-4" />
            {blog.profiles?.full_name || 'Unknown author'}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(blog.created_at)}
          </span>
        </div>

        {/* Description */}
        <p className="mt-6 border-l-4 border-brand-500 bg-brand-50 py-3 pl-4 text-lg italic leading-relaxed text-slate-700">
          {blog.description}
        </p>

        {/* Content */}
        <div className="blog-content mt-8 whitespace-pre-wrap font-serif text-base leading-[1.8] text-slate-800">
          {blog.content}
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="mt-10 flex items-center gap-3 border-t border-slate-200 pt-6">
            <Link to={`/blogs/${blog.id}/edit`} className="btn-secondary">
              <EditIcon className="h-4 w-4" /> Edit
            </Link>
            <button onClick={() => setShowDeleteDialog(true)} className="btn-danger">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete this blog?"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </article>
  );
}
