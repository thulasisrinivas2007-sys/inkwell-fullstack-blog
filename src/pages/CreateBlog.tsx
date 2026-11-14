import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PenSquare } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import BlogForm, { type BlogFormData } from '@/components/BlogForm';

export default function CreateBlog() {
  const { user } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  async function handleSubmit(data: BlogFormData) {
    if (!user) throw new Error('You must be logged in to create a blog.');

    const { error } = await supabase.from('blogs').insert({
      user_id: user.id,
      title: data.title,
      description: data.description,
      content: data.content,
      category: data.category,
      featured_image: data.featured_image || null,
      published: data.published,
    });

    if (error) throw error;

    notify('success', 'Blog created successfully!');
    navigate('/dashboard');
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
          <PenSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create a New Blog</h1>
          <p className="text-sm text-slate-500">Share your thoughts with the world</p>
        </div>
      </div>

      <div className="card p-6 sm:p-8">
        <BlogForm onSubmit={handleSubmit} submitLabel="Publish Blog" />
      </div>
    </div>
  );
}
