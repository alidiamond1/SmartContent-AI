import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import api from '../config/api';
import { 
  Home, 
  FileEdit, 
  Share2, 
  TrendingUp, 
  Settings, 
  Search,
  LogOut,
  User,
  CreditCard,
  FileText,
  Calendar,
  Trash2,
  Eye,
  Plus,
  Moon,
  Sun,
  Zap
} from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  content: string;
  structure: string;
  keywords: string;
  tone: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  createdAt: string;
}

export default function MyBlogs() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [credits, setCredits] = useState(user?.credits || 0);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    fetchCredits();
    fetchBlogs();
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

  const fetchCredits = async () => {
    try {
      const response = await api.get('/payment/credits');
      setCredits(response.data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog/my-blogs');
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await api.delete(`/blog/${blogId}`);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      alert('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    const plainText = content.replace(/[#*\n]/g, ' ').trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', active: false },
    { name: 'Blog Writer', icon: FileEdit, href: '/blog-writer', active: false },
    { name: 'My Blogs', icon: FileText, href: '/my-blogs', active: true },
    { name: 'Social Posts', icon: Share2, href: '/social-posts' },
    { name: 'My Posts', icon: Share2, href: '/my-social-posts' },
    { name: 'Analytics', icon: TrendingUp, href: '#' },
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
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/10 dark:hover:bg-blue-600/20 hover:text-blue-600 transition-colors"
          >
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Search your blogs..."
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

        {/* My Blogs Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Blogs</h2>
              <p className="text-gray-500 dark:text-gray-400">View and manage all your saved blog posts</p>
            </div>
            <button
              onClick={() => navigate('/blog-writer')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              New Blog Post
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No blogs yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Start creating amazing content with AI assistance</p>
              <button
                onClick={() => navigate('/blog-writer')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Create Your First Blog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  {/* Blog Image */}
                  {blog.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.imageAlt || blog.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={16} />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/blog/${blog._id}`)}
                          className="p-2 rounded-lg hover:bg-blue-600/10 text-blue-600 transition-colors"
                          title="View blog"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlog(blog._id);
                          }}
                          className="p-2 rounded-lg hover:bg-red-600/10 text-red-600 transition-colors"
                          title="Delete blog"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {getExcerpt(blog.content)}
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {blog.structure}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                        {blog.tone}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

