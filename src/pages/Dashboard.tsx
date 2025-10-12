import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import api from '../config/api';
import { 
  Home, 
  FileEdit, 
  Share2, 
  Mail, 
  TrendingUp, 
  Settings, 
  Search,
  LogOut,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  X,
  FileText,
  Moon,
  Sun,
  Sparkles,
  ArrowRight,
  Clock,
  BarChart3,
  Zap,
  PenTool,
  Image as ImageIcon,
  Calendar
} from 'lucide-react';

interface RecentActivity {
  id: string;
  type: 'blog' | 'social';
  title: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user, logout, refreshUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [credits, setCredits] = useState(user?.credits || 0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [stats, setStats] = useState({ blogs: 0, posts: 0, totalContent: 0 });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const success = searchParams.get('success');
      const packageType = searchParams.get('package');
      const canceled = searchParams.get('canceled');
      
      if (success === 'true' && packageType) {
        try {
          // Call backend to add credits
          const response = await api.post('/payment/payment-success', { packageType });
          
          if (response.data.success) {
            setNotification({ 
              type: 'success', 
              message: `Payment successful! ${response.data.message}` 
            });
            setCredits(response.data.credits);
            // Refresh user data globally
            await refreshUser();
          }
        } catch (error) {
          console.error('Error processing payment success:', error);
          setNotification({ 
            type: 'error', 
            message: 'Payment successful but there was an error updating credits. Please contact support.' 
          });
        }
        
        // Clear URL parameters to prevent duplicate processing
        setSearchParams({});
      } else if (canceled === 'true') {
        setNotification({ 
          type: 'error', 
          message: 'Payment was canceled.' 
        });
        
        // Clear URL parameters
        setSearchParams({});
      }
      
      // Fetch current credits
      fetchCredits();
    };

    handlePaymentSuccess();
  }, [searchParams]);

  const fetchCredits = async () => {
    try {
      const response = await api.get('/payment/credits');
      setCredits(response.data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [blogsRes, postsRes] = await Promise.all([
        api.get('/blog/my-blogs'),
        api.get('/social-post/my-posts')
      ]);
      
      const blogCount = blogsRes.data.blogs?.length || 0;
      const postCount = postsRes.data.posts?.length || 0;
      
      setStats({
        blogs: blogCount,
        posts: postCount,
        totalContent: blogCount + postCount
      });

      // Set recent activity (combine blogs and posts, sort by date)
      const blogs = (blogsRes.data.blogs || []).map((blog: any) => ({
        id: blog._id,
        type: 'blog' as const,
        title: blog.title,
        createdAt: blog.createdAt
      }));

      const posts = (postsRes.data.posts || []).map((post: any) => ({
        id: post._id,
        type: 'social' as const,
        title: post.topic,
        createdAt: post.createdAt
      }));

      const combined = [...blogs, ...posts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setRecentActivity(combined);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showProfileDropdown && !target.closest('#profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  const handleLogout = () => {
    setShowProfileDropdown(false);
    logout();
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', active: true },
    { name: 'Blog Writer', icon: FileEdit, href: '/blog-writer', active: false },
    { name: 'My Blogs', icon: FileText, href: '/my-blogs', active: false },
    { name: 'Social Posts', icon: Share2, href: '/social-posts', active: false },
    { name: 'My Posts', icon: Share2, href: '/my-social-posts', active: false },
    { name: 'Pricing', icon: CreditCard, href: '/pricing', active: false },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
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
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">SmartContent</h1>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 font-semibold'
                      : 'hover:bg-blue-600/10 dark:hover:bg-blue-600/20 hover:text-blue-600'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-2">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg mb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap size={14} className="text-amber-600" />
              <span className="text-gray-700 dark:text-gray-300">{credits} Credits</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Search documents, templates, and more..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              title="Click to buy more credits"
            >
              <CreditCard size={18} />
              {credits} Credits
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon size={20} className="text-gray-600 dark:text-gray-400" />
                )}
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative" id="profile-dropdown">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold ring-2 ring-blue-200 dark:ring-blue-800">
                    {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-5 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap size={16} className="text-amber-600" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {credits} Credits
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            navigate('/pricing');
                          }}
                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Buy More
                        </button>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate('/dashboard');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <Home size={18} className="text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Dashboard</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate('/my-blogs');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <FileText size={18} className="text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">My Content</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          navigate('/pricing');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <CreditCard size={18} className="text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Pricing</span>
                      </button>

                      <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        {isDarkMode ? (
                          <>
                            <Sun size={18} className="text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Light Mode</span>
                          </>
                        ) : (
                          <>
                            <Moon size={18} className="text-gray-600 dark:text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left group"
                      >
                        <LogOut size={18} className="text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top-5 duration-300">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              ) : (
                <XCircle className="text-red-600 dark:text-red-400" size={24} />
              )}
              <p className={`text-sm font-medium ${
                notification.type === 'success' 
                  ? 'text-green-800 dark:text-green-300' 
                  : 'text-red-800 dark:text-red-300'
              }`}>
                {notification.message}
              </p>
              <button
                onClick={() => setNotification(null)}
                className={`ml-4 p-1 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors ${
                  notification.type === 'success' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="p-6 lg:p-10 bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/10 dark:to-purple-950/10">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Welcome back, {user?.name}! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Let's create something amazing today!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Content */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Sparkles size={24} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{stats.totalContent}</p>
                  <p className="text-blue-100 text-sm">Total Content</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-100 text-sm">
                <TrendingUp size={16} />
                <span>All time</span>
              </div>
            </div>

            {/* Blog Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <FileText size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.blogs}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Blog Posts</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/blog-writer')}
                className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-medium hover:gap-3 transition-all"
              >
                Create new <ArrowRight size={16} />
              </button>
            </div>

            {/* Social Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                  <Share2 size={24} className="text-pink-600 dark:text-pink-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.posts}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Social Posts</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/social-posts')}
                className="flex items-center gap-2 text-pink-600 dark:text-pink-400 text-sm font-medium hover:gap-3 transition-all"
              >
                Create new <ArrowRight size={16} />
              </button>
            </div>

            {/* Credits */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Zap size={24} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{credits}</p>
                  <p className="text-orange-100 text-sm">AI Credits</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="flex items-center gap-2 text-orange-100 text-sm font-medium hover:text-white hover:gap-3 transition-all"
              >
                Buy more <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="text-blue-600" size={24} />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/blog-writer')}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all group"
                  >
                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                      <PenTool size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">Write Blog</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Create AI-powered content</p>
                    </div>
                    <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => navigate('/social-posts')}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-900/30 dark:hover:to-purple-900/30 transition-all group"
                  >
                    <div className="p-2 bg-pink-600 rounded-lg text-white">
                      <Share2 size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">Social Post</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Generate viral content</p>
                    </div>
                    <ArrowRight size={20} className="text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => navigate('/my-blogs')}
                    className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all group"
                  >
                    <div className="p-2 bg-green-600 rounded-lg text-white">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">My Content</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">View saved work</p>
                    </div>
                    <ArrowRight size={20} className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="text-blue-600" size={24} />
                    Recent Activity
                  </h3>
                  <button
                    onClick={() => navigate('/my-blogs')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all
                  </button>
                </div>

                {recentActivity.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                      <FileText size={32} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No content yet</p>
                    <button
                      onClick={() => navigate('/blog-writer')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create your first content
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => {
                          if (activity.type === 'blog') {
                            navigate('/my-blogs');
                          } else {
                            navigate('/my-social-posts');
                          }
                        }}
                      >
                        <div className={`p-3 rounded-lg ${
                          activity.type === 'blog'
                            ? 'bg-purple-100 dark:bg-purple-900/30'
                            : 'bg-pink-100 dark:bg-pink-900/30'
                        }`}>
                          {activity.type === 'blog' ? (
                            <FileText size={20} className="text-purple-600 dark:text-purple-400" />
                          ) : (
                            <Share2 size={20} className="text-pink-600 dark:text-pink-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {activity.title}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="capitalize">{activity.type}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(activity.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features Overview */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                  <Sparkles size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2">AI-Powered Writing</h4>
                <p className="text-blue-100 text-sm">
                  Generate high-quality content with advanced AI technology
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                  <ImageIcon size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2">Smart Images</h4>
                <p className="text-blue-100 text-sm">
                  Automatic image suggestions for every piece of content
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                  <BarChart3 size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2">Multi-Platform</h4>
                <p className="text-blue-100 text-sm">
                  Create content optimized for blogs and social media
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
