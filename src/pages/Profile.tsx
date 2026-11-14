import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Calendar, FileText, Save, User as UserIcon, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import type { Blog } from '@/types';
import { formatDate, getInitials } from '@/utils/format';
import LoadingSpinner from '@/components/LoadingSpinner';
import BlogCard from '@/components/BlogCard';
import EmptyState from '@/components/EmptyState';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { notify } = useNotification();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogCount, setBlogCount] = useState(0);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name);
      setAvatarUrl(profile.avatar_url ?? '');
    }
  }, [profile]);

  useEffect(() => {
    async function fetchBlogs() {
      if (!user) return;
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        notify('error', error.message);
        setLoadingBlogs(false);
        return;
      }
      const userBlogs = (data ?? []) as Blog[];
      setBlogs(userBlogs);
      setBlogCount(userBlogs.length);
      setLoadingBlogs(false);
    }
    fetchBlogs();
  }, [user, notify]);

  async function handleUpdateProfile(e: FormEvent) {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Full name cannot be empty.');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user!.id);

    setSaving(false);

    if (error) {
      setFormError(error.message);
      notify('error', error.message);
      return;
    }

    await refreshProfile();
    notify('success', 'Profile updated successfully!');
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const avatarSrc = avatarUrl || profile?.avatar_url;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Profile header card */}
      <div className="card mb-8 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-brand-600 to-brand-800" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-brand-100 text-xl font-bold text-brand-700 shadow-md">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={profile?.full_name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                getInitials(profile?.full_name ?? '')
              )}
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {profile?.full_name || 'Your Name'}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-slate-500">
                <Mail className="h-4 w-4" /> {user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <FileText className="h-3.5 w-3.5" /> Total Blogs
              </div>
              <p className="text-xl font-bold text-slate-900">{blogCount}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Calendar className="h-3.5 w-3.5" /> Joined
              </div>
              <p className="text-sm font-bold text-slate-900">
                {profile ? formatDate(profile.created_at) : '—'}
              </p>
            </div>
            <div className="col-span-2 rounded-lg bg-slate-50 p-4 sm:col-span-1">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <UserIcon className="h-3.5 w-3.5" /> Account ID
              </div>
              <p className="truncate text-xs font-mono font-bold text-slate-600">
                {user.id.slice(0, 16)}...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Edit profile form */}
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Edit Profile</h2>
          <div className="card p-6">
            {formError && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              {avatarUrl && (
                <div className="flex items-center gap-3">
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    className="h-14 w-14 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs text-slate-400">Preview</span>
                </div>
              )}
              <button type="submit" disabled={saving} className="btn-primary w-full">
                <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Blog activity */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Blog Activity</h2>
            <Link to="/dashboard" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              Go to Dashboard
            </Link>
          </div>

          {loadingBlogs ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : blogs.length === 0 ? (
            <EmptyState
              icon="pen"
              title="No blogs yet"
              message="You haven't published any blogs yet."
              actionLabel="Create a blog"
              actionHref="/blogs/create"
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {blogs.slice(0, 6).map((blog) => (
                <BlogCard
                  key={blog.id}
                  blog={{ ...blog, profiles: { full_name: profile?.full_name ?? '' } }}
                  showAuthor={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
