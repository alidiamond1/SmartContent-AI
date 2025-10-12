import { Link, useNavigate, useParams } from 'react-router-dom';
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
  ArrowLeft,
  Calendar,
  Edit,
  Download,
  FileText,
  Copy,
  Check,
  Moon,
  Sun
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

export default function BlogDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [credits, setCredits] = useState(user?.credits || 0);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCredits();
    fetchBlog();
  }, [id]);

  const fetchCredits = async () => {
    try {
      const response = await api.get('/payment/credits');
      setCredits(response.data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blog/${id}`);
      setBlog(response.data.blog);
    } catch (error: any) {
      console.error('Error fetching blog:', error);
      alert(error.response?.data?.message || 'Failed to load blog');
      navigate('/my-blogs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Simple markdown to HTML converter
  const formatContent = (text: string) => {
    if (!text) return '';
    
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-10 mb-5 text-gray-900 dark:text-white">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      // Line breaks
      .replace(/\n/gim, '<br />')
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2">• $1</li>');
  };

  const handleCopyContent = () => {
    if (blog) {
      navigator.clipboard.writeText(blog.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (blog) {
      const element = document.createElement('a');
      const file = new Blob([blog.content], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `${blog.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
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
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Logout"
              >
                <LogOut size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Blog Detail Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : blog ? (
            <>
              {/* Featured Image */}
              {blog.imageUrl && (
                <div className="relative h-96 overflow-hidden">
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.imageAlt || blog.title}
                    className="w-full h-full object-cover"
                  />
                  {blog.imageCredit && (
                    <p className="absolute bottom-4 right-4 text-sm text-white bg-black/60 px-3 py-2 rounded-lg backdrop-blur-sm">
                      {blog.imageCredit}
                    </p>
                  )}
                </div>
              )}
              
              {/* Blog Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 lg:px-8 py-6">
                <button
                  onClick={() => navigate('/my-blogs')}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Back to My Blogs</span>
                </button>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {blog.title}
                </h1>

                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {blog.structure}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    {blog.tone}
                  </span>
                  {blog.keywords && (
                    <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      {blog.keywords}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopyContent}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={18} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        Copy Content
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Download size={18} />
                    Download
                  </button>
                  <button
                    onClick={() => navigate('/blog-writer')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    <Edit size={18} />
                    Create New Blog
                  </button>
                </div>
              </div>

              {/* Blog Content */}
              <div className="px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                  <article 
                    className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Blog not found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

