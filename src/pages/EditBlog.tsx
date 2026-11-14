import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit as EditIcon, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import BlogForm, { type BlogFormData } from '@/components/BlogForm';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<Partial<BlogFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchBlog() {
      if (!id || !user) return;
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
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

      if (data.user_id !== user.id) {
        notify('error', 'You can only edit your own blogs.');
        navigate('/dashboard');
        return;
      }

      setInitialData({
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        featured_image: data.featured_image ?? '',
        published: data.published,
      });
      setLoading(false);
    }
    fetchBlog();
  }, [id, user, notify, navigate]);

  async function handleSubmit(data: BlogFormData) {
    const { error } = await supabase
      .from('blogs')
      .update({
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        featured_image: data.featured_image || null,
        published: data.published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id!);

    if (error) throw error;

    notify('success', 'Blog updated successfully!');
    navigate(`/blogs/${id}`);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-slate-300" />
        <h1 className="text-xl font-bold text-slate-900">Blog not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The blog you're trying to edit doesn't exist or has been removed.
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-6">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
          <EditIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Blog</h1>
          <p className="text-sm text-slate-500">Update your blog post</p>
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        {initialData && <BlogForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Save Changes" />}
      </div>
    </div>
  );
}
