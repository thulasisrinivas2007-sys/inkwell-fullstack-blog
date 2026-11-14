import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, Mail, FileText, Calendar, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import type { Blog } from '@/types';
import BlogCard from '@/components/BlogCard';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import ConfirmDialog from '@/components/ConfirmDialog';
import { formatDate } from '@/utils/format';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { notify } = useNotification();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchUserBlogs() {
      if (!user) return;
      const { data, error: fetchError } = await supabase
        .from('blogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }
      setBlogs((data ?? []) as Blog[]);
      setLoading(false);
    }
    fetchUserBlogs();
  }, [user]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error: deleteError } = await supabase
      .from('blogs')
      .delete()
      .eq('id', deleteTarget);
    setDeleting(false);
    setDeleteTarget(null);

    if (deleteError) {
      notify('error', deleteError.message);
      return;
    }

    setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget));
    notify('success', 'Blog deleted successfully!');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Welcome header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome back, {profile?.full_name || 'Writer'}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Mail className="h-4 w-4" /> {user?.email}
          </p>
        </div>
        <Link to="/blogs/create" className="btn-primary">
          <PenSquare className="h-4 w-4" /> Create New Blog
        </Link>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">Total Blogs</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{blogs.length}</p>
        </div>
        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Member Since</span>
          </div>
          <p className="text-lg font-bold text-slate-900">
            {profile ? formatDate(profile.created_at) : '—'}
          </p>
        </div>
        <div className="card p-5">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <PenSquare className="h-5 w-5" />
            <span className="text-sm font-medium">Published</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {blogs.filter((b) => b.published).length}
          </p>
        </div>
      </div>

      {/* Blog list */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Your Blogs</h2>
        {blogs.length > 0 && (
          <Link to="/profile" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
          {error}
        </div>
      ) : blogs.length === 0 ? (
        <EmptyState
          icon="pen"
          title="No blogs yet"
          message="You haven't created any blogs yet. Start writing your first post and share it with the world."
          actionLabel="Create your first blog"
          actionHref="/blogs/create"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={{ ...blog, profiles: { full_name: profile?.full_name ?? '' } }}
              showAuthor={false}
              actions={
                <>
                  <Link
                    to={`/blogs/${blog.id}/edit`}
                    className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-brand-100 hover:text-brand-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(blog.id)}
                    className="flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this blog?"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
