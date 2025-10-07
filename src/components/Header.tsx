import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link className="flex items-center gap-2" to="/">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_319)">
                  <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_319">
                    <rect fill="white" height="48" width="48"></rect>
                  </clipPath>
                </defs>
              </svg>
              <h2 className="text-lg font-bold">SmartContent AI</h2>
            </Link>
          </div>
          <nav className="hidden items-center gap-8 lg:flex">
            <a className="text-sm font-medium hover:text-blue-600 transition-colors" href="#features">Product</a>
            <a className="text-sm font-medium hover:text-blue-600 transition-colors" href="#testimonials">Solutions</a>
            <a className="text-sm font-medium hover:text-blue-600 transition-colors" href="#contact">Resources</a>
            <a className="text-sm font-medium hover:text-blue-600 transition-colors" href="#pricing">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="text-sm text-gray-700 mr-2">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-red-600/20 px-4 text-sm font-bold text-red-600 transition-colors hover:bg-red-600/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-blue-600/20 px-4 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-600/30"
                >
                  Log In
                </Link>
                <Link 
                  to="/register"
                  className="flex h-10 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-blue-600 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-600/90"
                >
                  Start Free Trial
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
