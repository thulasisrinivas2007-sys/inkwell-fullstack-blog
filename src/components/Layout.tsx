import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-bold text-slate-900">Inkwell</span>
            </Link>
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Inkwell — A modern blogging platform. Share your stories with the world.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <Link to="/" className="transition-colors hover:text-brand-600">Home</Link>
              <Link to="/login" className="transition-colors hover:text-brand-600">Login</Link>
              <Link to="/register" className="transition-colors hover:text-brand-600">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
