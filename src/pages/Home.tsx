import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Filter as FilterIcon, PenSquare } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import type { BlogWithAuthor } from '@/types';
import { CATEGORIES } from '@/types';
import BlogCard from '@/components/BlogCard';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<BlogWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('blogs')
        .select('*, profiles:profiles(full_name, avatar_url)')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }
      setBlogs((data ?? []) as BlogWithAuthor[]);
      setError('');
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return blogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === 'all' || blog.category === selectedCategory;
      const matchesSearch =
        !query ||
        blog.title.toLowerCase().includes(query) ||
        blog.description.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [blogs, searchQuery, selectedCategory]);

  const hasFilters = searchQuery.trim() !== '' || selectedCategory !== 'all';

  function clearFilters() {
    setSearchQuery('');
    setSelectedCategory('all');
  }

  return (
    <div>
      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-brand-300 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Discover stories<br className="hidden sm:block" /> that matter
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-brand-100">
            Explore insights on technology, programming, AI, lifestyle, travel, and more from
            writers around the world.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {user ? (
              <Link to="/blogs/create" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-md transition-all hover:bg-brand-50 hover:shadow-lg active:scale-[0.98]">
                <PenSquare className="h-4 w-4" /> Write a Blog
              </Link>
            ) : (
              <>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-md transition-all hover:bg-brand-50 hover:shadow-lg active:scale-[0.98]">
                  Get Started Free
                </Link>
                <Link to="/login" className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                  Sign In
                </Link>
              </>
            )}
          </div>
          <p className="mt-4 text-sm text-brand-200">
            {blogs.length > 0 ? `${blogs.length} published blogs and counting` : 'Be the first to share your story'}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Search & filter bar */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blogs by title, description, or content..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
              <FilterIcon className="h-4 w-4" /> Categories:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                {cat}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
              >
                <X className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
            {error}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <EmptyState
            icon="search"
            title="No blogs found"
            message={
              hasFilters
                ? 'Try adjusting your search or filters to find what you are looking for.'
                : 'No blogs have been published yet. Be the first to share your story!'
            }
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-slate-500">
              Showing {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? 's' : ''}
              {hasFilters && ' matching your filters'}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
