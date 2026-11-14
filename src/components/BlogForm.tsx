import { useState, type FormEvent } from 'react';
import { Save, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES, type Category } from '@/types';
import { useNotification } from '@/context/NotificationContext';

export interface BlogFormData {
  title: string;
  description: string;
  content: string;
  category: string;
  featured_image: string;
  published: boolean;
}

interface BlogFormProps {
  initialData?: Partial<BlogFormData>;
  onSubmit: (data: BlogFormData) => Promise<void>;
  submitLabel: string;
}

export default function BlogForm({ initialData, onSubmit, submitLabel }: BlogFormProps) {
  const { notify } = useNotification();
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [category, setCategory] = useState<string>(initialData?.category ?? 'Technology');
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image ?? '');
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Short description is required.');
      return;
    }
    if (!content.trim()) {
      setError('Content is required.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        category,
        featured_image: featuredImage.trim(),
        published,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
      notify('error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="An engaging title for your blog"
          className="input-field text-base"
          maxLength={200}
          required
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Short Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A brief summary that appears in blog cards and previews (1-2 sentences)"
          className="input-field min-h-[80px] resize-y"
          maxLength={300}
          required
        />
        <p className="mt-1 text-xs text-slate-400">{description.length}/300 characters</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog content here. You can use plain text with paragraphs."
          className="input-field min-h-[300px] resize-y font-serif text-base leading-relaxed"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="input-field cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Featured Image URL
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      {featuredImage && (
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <img
            src={featuredImage}
            alt="Featured preview"
            className="h-48 w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="peer sr-only"
          />
          <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-brand-600 peer-checked:after:translate-x-5" />
        </label>
        <div>
          <span className="text-sm font-semibold text-slate-700">Publish immediately</span>
          <p className="text-xs text-slate-400">
            {published ? 'Visible on the public home page' : 'Saved as draft (only visible to you)'}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button type="submit" disabled={loading} className="btn-primary">
          <Save className="h-4 w-4" />
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
