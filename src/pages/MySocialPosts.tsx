import { Link, useNavigate } from 'react-router-dom';
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
  FileText,
  Calendar,
  Trash2,
  Eye,
  Plus,
  Moon,
  Sun,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Copy,
  Check,
  Filter,
  X,
  Zap
} from 'lucide-react';

interface SocialPost {
  _id: string;
  platform: string;
  topic: string;
  content: string;
  tone: string;
  hashtags?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCredit?: string;
  createdAt: string;
}

const platformIcons: { [key: string]: any } = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook
};

const platformColors: { [key: string]: string } = {
  twitter: 'text-blue-500',
  linkedin: 'text-blue-700',
  instagram: 'text-pink-600',
  facebook: 'text-blue-600'
};

const platformBgColors: { [key: string]: string } = {
  twitter: 'bg-blue-50 dark:bg-blue-900/20',
  linkedin: 'bg-blue-100 dark:bg-blue-800/20',
  instagram: 'bg-pink-50 dark:bg-pink-900/20',
  facebook: 'bg-blue-50 dark:bg-blue-900/20'
};

export default function MySocialPosts() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [credits, setCredits] = useState(user?.credits || 0);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewPost, setPreviewPost] = useState<SocialPost | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    fetchCredits();
    fetchPosts();
  }, [filterPlatform]);

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

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = filterPlatform === 'all' 
        ? '/social-post/my-posts' 
        : `/social-post/my-posts?platform=${filterPlatform}`;
      const response = await api.get(url);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching social posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social post?')) {
      return;
    }

    try {
      await api.delete(`/social-post/${id}`);
      setPosts(posts.filter(post => post._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatPreviewContent = (text: string) => {
    if (!text) return '';
    
    let formattedText = text;
    
    // Convert markdown bold (**text** or __text__) to HTML
    formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
    formattedText = formattedText.replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>');
    
    // Convert markdown italic (*text* or _text_) to HTML
    formattedText = formattedText.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    formattedText = formattedText.replace(/_(.+?)_/g, '<em class="italic">$1</em>');
    
    // Convert URLs to links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    formattedText = formattedText.replace(urlRegex, '<a href="$1" class="text-blue-500 hover:underline" target="_blank">$1</a>');
    
    // Convert hashtags to styled text
    formattedText = formattedText.replace(/#(\w+)/g, '<span class="text-blue-500 font-semibold">#$1</span>');
    
    // Convert mentions to styled text
    formattedText = formattedText.replace(/@(\w+)/g, '<span class="text-blue-500 font-semibold">@$1</span>');
    
    // Preserve line breaks (convert \n to <br />)
    formattedText = formattedText.replace(/\n/g, '<br />');
    
    return formattedText;
  };

  const getPlatformName = (id: string) => {
    const names: { [key: string]: string } = {
      twitter: 'Twitter/X',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      facebook: 'Facebook'
    };
    return names[id] || id;
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', active: false },
    { name: 'Blog Writer', icon: FileEdit, href: '/blog-writer', active: false },
    { name: 'My Blogs', icon: FileText, href: '/my-blogs', active: false },
    { name: 'Social Posts', icon: Share2, href: '/social-posts', active: false },
    { name: 'My Posts', icon: Share2, href: '/my-social-posts', active: true },
    { name: 'Email Creator', icon: Mail, href: '/email-creator', active: false },
    { name: 'Analytics', icon: TrendingUp, href: '/analytics', active: false },
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
              placeholder="Search social posts..."
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

        {/* My Social Posts Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Social Posts</h2>
              <p className="text-gray-500 dark:text-gray-400">Manage your saved social media posts</p>
            </div>
            <button
              onClick={() => navigate('/social-posts')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Create New Post
            </button>
          </div>

          {/* Filter */}
          <div className="mb-6 flex items-center gap-3">
            <Filter size={18} className="text-gray-600 dark:text-gray-400" />
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
            >
              <option value="all">All Platforms</option>
              <option value="twitter">Twitter/X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
            </select>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <Share2 size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No social posts yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first social media post to get started</p>
              <button
                onClick={() => navigate('/social-posts')}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Create Post
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const Icon = platformIcons[post.platform];
                return (
                  <div
                    key={post._id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {/* Featured Image */}
                    {post.imageUrl && (
                      <div className="relative w-full">
                        <img 
                          src={post.imageUrl} 
                          alt={post.imageAlt || post.topic}
                          className="w-full h-48 object-cover"
                        />
                        {post.imageCredit && (
                          <p className="absolute bottom-2 right-2 text-xs text-white bg-black/60 px-2 py-1 rounded">
                            {post.imageCredit}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Post Header */}
                    <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${platformBgColors[post.platform]}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={platformColors[post.platform]} size={20} />
                          <span className="font-semibold text-gray-900 dark:text-white capitalize">
                            {post.platform}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-white dark:bg-gray-700 rounded-full">
                          {post.tone}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {post.topic}
                      </h3>
                    </div>

                    {/* Post Content */}
                    <div className="p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap line-clamp-4">
                        {truncateContent(post.content, 200)}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <Calendar size={14} />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewPost(post)}
                          className="px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                          title="Preview post"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleCopy(post.content, post._id)}
                          className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          {copiedId === post._id ? (
                            <>
                              <Check size={16} />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={16} />
                              Copy
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewPost(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Preview Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = platformIcons[previewPost.platform];
                  return <Icon className={platformColors[previewPost.platform]} size={24} />;
                })()}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{getPlatformName(previewPost.platform)} Preview</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">How your post appears</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewPost(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Mock Social Media Post */}
              <div className={`rounded-xl border ${platformBgColors[previewPost.platform]} border-gray-200 dark:border-gray-700 overflow-hidden`}>
                {/* Featured Image */}
                {previewPost.imageUrl && (
                  <div className="relative w-full">
                    <img 
                      src={previewPost.imageUrl} 
                      alt={previewPost.imageAlt || previewPost.topic}
                      className="w-full h-64 object-cover"
                    />
                    {previewPost.imageCredit && (
                      <p className="absolute bottom-2 right-2 text-xs text-white bg-black/60 px-2 py-1 rounded">
                        {previewPost.imageCredit}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="p-6">
                  {/* User Info */}
                  <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                      {previewPost.platform === 'twitter' && (
                        <span className="text-blue-500">
                          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {previewPost.platform === 'linkedin' && user?.email}
                      {previewPost.platform === 'twitter' && `@${user?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}`}
                      {previewPost.platform === 'instagram' && user?.name}
                      {previewPost.platform === 'facebook' && formatDate(previewPost.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Post Topic */}
                {previewPost.topic && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      {previewPost.topic}
                    </span>
                  </div>
                )}

                {/* Tone Badge */}
                <div className="mb-3">
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {previewPost.tone}
                  </span>
                </div>

                {/* Post Content */}
                <div 
                  className="text-gray-900 dark:text-white whitespace-pre-wrap break-words leading-relaxed"
                  style={{ fontSize: previewPost.platform === 'twitter' ? '15px' : '14px' }}
                  dangerouslySetInnerHTML={{ __html: formatPreviewContent(previewPost.content) }}
                />

                {/* Engagement Stats */}
                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                    {previewPost.platform === 'twitter' && (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm">Reply</span>
                      </>
                    )}
                    {previewPost.platform === 'linkedin' && (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 8.5L12 12.5L17 8.5V7L12 11L7 7V8.5Z M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3Z"/>
                        </svg>
                        <span className="text-sm">Like</span>
                      </>
                    )}
                    {(previewPost.platform === 'instagram' || previewPost.platform === 'facebook') && (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-sm">Like</span>
                      </>
                    )}
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm">Comment</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-sm">Share</span>
                  </button>
                </div>
                </div>
              </div>

              {/* Post Info */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar size={16} />
                    <span>Created: {formatDate(previewPost.createdAt)}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {previewPost.content.length} characters
                  </span>
                </div>
              </div>
            </div>

            {/* Preview Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setPreviewPost(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCopy(previewPost.content, previewPost._id);
                  setPreviewPost(null);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Copy size={16} />
                Copy & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

