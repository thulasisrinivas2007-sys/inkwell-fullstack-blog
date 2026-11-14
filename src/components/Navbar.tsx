import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PenSquare, LogOut, LayoutDashboard, User as UserIcon, Menu, X, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setMobileOpen(false);
    navigate('/login');
  }

  const navLinkClass =
    'text-sm font-medium text-slate-600 transition-colors hover:text-brand-600';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-slate-900">Inkwell</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link to="/" className={navLinkClass}>
            Home
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className={navLinkClass}>
                Dashboard
              </Link>
              <Link to="/blogs/create" className={navLinkClass}>
                Write
              </Link>
              <Link to="/profile" className={navLinkClass}>
                Profile
              </Link>
              <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
                <span className="text-sm text-slate-500">
                  {profile?.full_name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className={navLinkClass}>
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </span>
                </Link>
                <Link
                  to="/blogs/create"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <PenSquare className="h-4 w-4" /> Write
                  </span>
                </Link>
                <Link to="/profile" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  <span className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Profile
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-sm font-medium text-red-600"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
