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
  Send,
  Sparkles,
  Save,
  Copy,
  Check,
  FileText,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Hash,
  MessageSquare,
  Moon,
  Sun,
  Eye,
  X,
  Zap
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  maxChars: number;
  placeholder: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const platforms: Platform[] = [
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    maxChars: 280,
    placeholder: 'What\'s happening?'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 dark:bg-blue-800/20',
    maxChars: 3000,
    placeholder: 'Share your professional thoughts...'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    maxChars: 2200,
    placeholder: 'Share your story...'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    maxChars: 63206,
    placeholder: 'What\'s on your mind?'
  }
];

export default function SocialPosts() {
  const { user, logout, refreshUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [credits, setCredits] = useState(user?.credits || 0);
  
  // Social post state
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(platforms[0]);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [tone, setTone] = useState('Professional');
  const [hashtags, setHashtags] = useState('');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeCTA, setIncludeCTA] = useState(false);
  
  // Image state
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // AI Assistant state
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I can help you create engaging social media posts. What would you like to post about?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    fetchCredits();
  }, []);

  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

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

  const handleGeneratePost = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic for your social post');
      return;
    }

    if (credits < 1) {
      alert('Insufficient credits. Please purchase more credits.');
      navigate('/pricing');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post('/social-post/generate', {
        platform: selectedPlatform.id,
        topic,
        tone,
        hashtags,
        includeEmojis,
        includeHashtags,
        includeCTA,
        maxChars: selectedPlatform.maxChars
      });

      setContent(response.data.content);
      setCredits(response.data.remainingCredits);
      
      // Set image data if available
      if (response.data.imageData) {
        setImageUrl(response.data.imageData.imageUrl);
        setImageAlt(response.data.imageData.imageAlt);
        setImageCredit(response.data.imageData.imageCredit);
      }
      
      await refreshUser();
    } catch (error: any) {
      console.error('Error generating post:', error);
      alert(error.response?.data?.message || 'Failed to generate post');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimizePost = async () => {
    if (!content.trim()) {
      alert('Please add some content to optimize');
      return;
    }

    if (credits < 1) {
      alert('Insufficient credits. Please purchase more credits.');
      navigate('/pricing');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post('/social-post/optimize', {
        platform: selectedPlatform.id,
        content,
        tone,
        maxChars: selectedPlatform.maxChars
      });

      setContent(response.data.content);
      setCredits(response.data.remainingCredits);
      await refreshUser();
    } catch (error: any) {
      console.error('Error optimizing post:', error);
      alert(error.response?.data?.message || 'Failed to optimize post');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePost = async () => {
    if (!content.trim()) {
      alert('Please add content before saving');
      return;
    }

    setIsSaving(true);
    try {
      await api.post('/social-post/save', {
        platform: selectedPlatform.id,
        topic,
        content,
        tone,
        hashtags,
        imageUrl,
        imageAlt,
        imageCredit
      });

      alert('Social post saved successfully!');
    } catch (error: any) {
      console.error('Error saving post:', error);
      alert(error.response?.data?.message || 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskAI = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage('');

    try {
      const response = await api.post('/social-post/ask-ai', {
        message: inputMessage,
        context: { topic, content, platform: selectedPlatform.id }
      });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.data.response 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error asking AI:', error);
    }
  };

  const getCharColor = () => {
    const percentage = (charCount / selectedPlatform.maxChars) * 100;
    if (percentage > 90) return 'text-red-600';
    if (percentage > 70) return 'text-yellow-600';
    return 'text-gray-500 dark:text-gray-400';
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
    
    // Convert hashtags to styled text (but not inside markdown)
    formattedText = formattedText.replace(/#(\w+)/g, '<span class="text-blue-500 font-semibold">#$1</span>');
    
    // Convert mentions to styled text
    formattedText = formattedText.replace(/@(\w+)/g, '<span class="text-blue-500 font-semibold">@$1</span>');
    
    // Preserve line breaks (convert \n to <br />)
    formattedText = formattedText.replace(/\n/g, '<br />');
    
    return formattedText;
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', active: false },
    { name: 'Blog Writer', icon: FileEdit, href: '/blog-writer', active: false },
    { name: 'My Blogs', icon: FileText, href: '/my-blogs', active: false },
    { name: 'Social Posts', icon: Share2, href: '/social-posts', active: true },
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

        {/* Social Posts Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Social Posts Creator</h2>
            <p className="text-gray-500 dark:text-gray-400">Create engaging social media posts for all your platforms with AI.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Editor */}
            <div className="col-span-1 flex flex-col gap-6 lg:col-span-2">
              {/* Platform Selector */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Platform
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => setSelectedPlatform(platform)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                          selectedPlatform.id === platform.id
                            ? `border-blue-600 ${platform.bgColor}`
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <Icon className={platform.color} size={24} />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {platform.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Post Editor */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                {/* Featured Image */}
                {imageUrl && (
                  <div className="relative">
                    <img 
                      src={imageUrl} 
                      alt={imageAlt || topic}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    {imageCredit && (
                      <p className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                        {imageCredit}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className={selectedPlatform.color} size={20} />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Create Post for {selectedPlatform.name}
                    </h3>
                  </div>
                  <input
                    className="w-full border-0 bg-transparent p-0 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
                    placeholder="Enter topic or main idea..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                
                <div className="p-4 relative">
                  <textarea
                    className="w-full resize-none border-0 bg-transparent p-0 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
                    placeholder={selectedPlatform.placeholder}
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={selectedPlatform.maxChars}
                  />
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getCharColor()}`}>
                      {charCount} / {selectedPlatform.maxChars}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPreview(true)}
                      disabled={!content.trim()}
                      className="rounded-lg bg-purple-600/10 px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-600/20 dark:bg-purple-600/20 dark:hover:bg-purple-600/30 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Eye size={16} />
                      Preview
                    </button>
                    <button
                      onClick={handleCopyToClipboard}
                      className="rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={handleSavePost}
                      disabled={isSaving}
                      className="rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Options & Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Customization Options
                </h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tone of Voice</label>
                    <select
                      className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                    >
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Witty</option>
                      <option>Inspiring</option>
                      <option>Educational</option>
                      <option>Promotional</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Hash size={14} />
                      Hashtags (optional)
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                      placeholder="marketing, ai, tech"
                      type="text"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeEmojis}
                      onChange={(e) => setIncludeEmojis(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include Emojis 😊</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeHashtags}
                      onChange={(e) => setIncludeHashtags(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include Hashtags</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCTA}
                      onChange={(e) => setIncludeCTA(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include Call-to-Action</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGeneratePost}
                    disabled={isGenerating}
                    className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles size={18} />
                    {isGenerating ? 'Generating...' : 'Generate Post'}
                  </button>
                  
                  <button
                    onClick={handleOptimizePost}
                    disabled={isGenerating}
                    className="flex-1 rounded-lg bg-blue-600/10 px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-600/20 dark:bg-blue-600/20 dark:hover:bg-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles size={18} />
                    {isGenerating ? 'Optimizing...' : 'Optimize Existing'}
                  </button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                  Generate: 1 credit • Optimize: 1 credit
                </p>
              </div>
            </div>

            {/* AI Assistant Sidebar */}
            <aside className="flex flex-col gap-6">
              <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-[700px]">
                <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Get help with your social media strategy
                  </p>
                </div>
                
                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center ${
                        message.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'
                      }`}>
                        {message.role === 'assistant' ? <Sparkles size={16} /> : <User size={16} />}
                      </div>
                      <div className={`flex-1 rounded-lg px-4 py-2 ${
                        message.role === 'assistant' 
                          ? 'bg-gray-100 dark:bg-gray-800' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                  <div className="relative">
                    <input
                      className="w-full rounded-full border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 py-2 pl-4 pr-12 text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                      placeholder="Ask me anything..."
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                    />
                    <button 
                      onClick={handleAskAI}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <Send className="text-blue-600" size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-600" />
                  Pro Tips
                </h4>
                <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Keep Twitter posts concise and punchy</li>
                  <li>• LinkedIn favors professional insights</li>
                  <li>• Instagram loves visual storytelling</li>
                  <li>• Use relevant hashtags to increase reach</li>
                  <li>• Include a clear call-to-action</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Preview Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = selectedPlatform.icon;
                  return <Icon className={selectedPlatform.color} size={24} />;
                })()}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedPlatform.name} Preview</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">How your post will appear</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Mock Social Media Post */}
              <div className={`rounded-xl border ${selectedPlatform.bgColor} border-gray-200 dark:border-gray-700 overflow-hidden`}>
                {/* Featured Image */}
                {imageUrl && (
                  <div className="relative w-full">
                    <img 
                      src={imageUrl} 
                      alt={imageAlt || topic}
                      className="w-full h-64 object-cover"
                    />
                    {imageCredit && (
                      <p className="absolute bottom-2 right-2 text-xs text-white bg-black/60 px-2 py-1 rounded">
                        {imageCredit}
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
                      {selectedPlatform.id === 'twitter' && (
                        <span className="text-blue-500">
                          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedPlatform.id === 'linkedin' && user?.email}
                      {selectedPlatform.id === 'twitter' && `@${user?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}`}
                      {selectedPlatform.id === 'instagram' && user?.name}
                      {selectedPlatform.id === 'facebook' && 'Just now'}
                    </p>
                  </div>
                </div>

                {/* Post Topic */}
                {topic && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      {topic}
                    </span>
                  </div>
                )}

                {/* Post Content */}
                <div 
                  className="text-gray-900 dark:text-white whitespace-pre-wrap break-words leading-relaxed"
                  style={{ fontSize: selectedPlatform.id === 'twitter' ? '15px' : '14px' }}
                  dangerouslySetInnerHTML={{ __html: formatPreviewContent(content) }}
                />

                {/* Engagement Stats */}
                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                    {selectedPlatform.id === 'twitter' && (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm">Reply</span>
                      </>
                    )}
                    {selectedPlatform.id === 'linkedin' && (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 8.5L12 12.5L17 8.5V7L12 11L7 7V8.5Z M5 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3Z"/>
                        </svg>
                        <span className="text-sm">Like</span>
                      </>
                    )}
                    {(selectedPlatform.id === 'instagram' || selectedPlatform.id === 'facebook') && (
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

              {/* Character Count */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {selectedPlatform.id === 'twitter' && content.length > 280 && (
                    <span className="text-red-600 font-semibold">⚠️ Exceeds Twitter character limit</span>
                  )}
                  {selectedPlatform.id === 'twitter' && content.length <= 280 && (
                    <span className="text-green-600 font-semibold">✓ Within character limit</span>
                  )}
                  {selectedPlatform.id !== 'twitter' && (
                    <span className="text-gray-600 dark:text-gray-400">Preview is approximate</span>
                  )}
                </span>
                <span className={`font-medium ${getCharColor()}`}>
                  {charCount} / {selectedPlatform.maxChars} characters
                </span>
              </div>
            </div>

            {/* Preview Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleCopyToClipboard();
                  setShowPreview(false);
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

