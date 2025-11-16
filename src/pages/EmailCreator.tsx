import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';
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
  Sparkles,
  Save,
  Eye,
  Send,
  LayoutTemplate,
  FileText,
  Moon,
  Sun,
  Zap,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function EmailCreator() {
  const { user, logout, refreshUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [credits, setCredits] = useState(user?.credits || 0);

  // Email form state
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [body, setBody] = useState('');
  const [goal, setGoal] = useState('Product Launch');
  const [audience, setAudience] = useState('Existing customers');
  const [productName, setProductName] = useState('SmartContent AI');
  const [tone, setTone] = useState('Professional');
  const [callToAction, setCallToAction] = useState('Start your free trial today');
  const [segment, setSegment] = useState('All users');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // AI Assistant state
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi! I can help you craft high-converting campaign emails. Tell me your goal or paste a rough draft, and I will optimize it.',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    fetchCredits();
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

  const handleGenerateEmail = async () => {
    if (!goal.trim() && !productName.trim()) {
      alert('Please set at least a goal or product name for the email.');
      return;
    }

    if (credits < 1) {
      alert('Insufficient credits. Please purchase more credits.');
      navigate('/pricing');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post('/email/generate', {
        goal,
        productName,
        audience,
        tone,
        callToAction,
        additionalDetails,
      });

      setSubject(response.data.subject);
      setPreviewText(response.data.previewText);
      setBody(response.data.body);
      setCredits(response.data.remainingCredits);

      await refreshUser();
    } catch (error: any) {
      console.error('Error generating email:', error);
      alert(error.response?.data?.message || 'Failed to generate email');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!subject.trim() || !body.trim()) {
      alert('Please add both subject and email body before saving.');
      return;
    }

    setIsSaving(true);
    try {
      await api.post('/email/save', {
        subject,
        previewText,
        body,
        goal,
        audience,
        productName,
        tone,
        segment,
      });

      alert('Email saved successfully!');
    } catch (error: any) {
      console.error('Error saving email:', error);
      alert(error.response?.data?.message || 'Failed to save email');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAskAI = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await api.post('/email/ask-ai', {
        message: userMessage.content,
        context: { subject, goal, audience, tone, body },
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error asking AI about email:', error);
    }
  };

  // Simple markdown to HTML converter for email preview
  const formatEmailBody = (text: string) => {
    if (!text) return '';

    let formatted = text;

    // Headings
    formatted = formatted.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-900">$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900">$1</h1>');

    // Bold & italic
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/_(.+?)_/g, '<em>$1</em>');

    // Links
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>');

    // Lists
    formatted = formatted.replace(/^\* (.*$)/gim, '<li class="ml-6 mb-1">• $1</li>');
    formatted = formatted.replace(/^- (.*$)/gim, '<li class="ml-6 mb-1">• $1</li>');

    // Line breaks
    formatted = formatted.replace(/\n/g, '<br />');

    return formatted;
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', active: false },
    { name: 'Blog Writer', icon: FileEdit, href: '/blog-writer', active: false },
    { name: 'My Blogs', icon: FileText, href: '/my-blogs', active: false },
    { name: 'Social Posts', icon: Share2, href: '/social-posts', active: false },
    { name: 'My Posts', icon: Share2, href: '/my-social-posts', active: false },
    { name: 'Email Creator', icon: Mail, href: '/email-creator', active: true },
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
              placeholder="Search campaigns, templates, and more..."
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

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-5 duration-200">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap size={16} className="text-amber-600" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{credits} Credits</span>
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
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Email Creator Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/10 dark:to-purple-950/10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Mail className="text-blue-600" />
                Email Campaign Creator
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Design beautiful, conversion-focused emails powered by Gemini.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Editor */}
            <div className="col-span-1 flex flex-col gap-6 lg:col-span-2">
              {/* Campaign Setup */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <LayoutTemplate className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Setup</h3>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    Gemini-powered
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Goal</label>
                    <select
                      className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    >
                      <option>Product Launch</option>
                      <option>Feature Announcement</option>
                      <option>Newsletter</option>
                      <option>Onboarding</option>
                      <option>Win-back / Re-activation</option>
                      <option>Upgrade / Upsell</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Audience</label>
                    <input
                      className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                      placeholder="e.g., Trial users, Paying customers"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product / Offer</label>
                    <input
                      className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                      placeholder="SmartContent AI"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tone of Voice</label>
                    <select
                      className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                    >
                      <option>Professional</option>
                      <option>Friendly</option>
                      <option>Bold & Direct</option>
                      <option>Inspirational</option>
                      <option>Playful</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Call-to-Action</label>
                    <input
                      className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                      placeholder="e.g., Start your free trial"
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Segment / Audience Tag</label>
                    <input
                      className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                      placeholder="e.g., Inactive > 30 days"
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Sparkles size={14} className="text-blue-600" />
                    Extra context for Gemini (optional)
                  </label>
                  <textarea
                    className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 min-h-[80px]"
                    placeholder="Share any important details: promo code, pricing, deadlines, links, etc."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Generating an email uses 1 credit.</p>
                  <button
                    onClick={handleGenerateEmail}
                    disabled={isGenerating}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Sparkles size={16} />
                    {isGenerating ? 'Generating with Gemini...' : 'Generate Email with Gemini'}
                  </button>
                </div>
              </div>

              {/* Email Editor */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">From</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name} • {user?.email}</p>
                  </div>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Eye size={14} />
                    Full Preview
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs w-16 text-gray-500 dark:text-gray-400">Subject</span>
                    <input
                      className="flex-1 rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-blue-600 px-3 py-2"
                      placeholder="Catchy subject that drives opens"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs w-16 text-gray-500 dark:text-gray-400">Preview</span>
                    <input
                      className="flex-1 rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-blue-600 px-3 py-2"
                      placeholder="Short preview text shown in inbox"
                      value={previewText}
                      onChange={(e) => setPreviewText(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                  <textarea
                    className="w-full min-h-[260px] resize-none border-0 bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
                    placeholder="Write or refine your email body here..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 p-4">
                  <button
                    onClick={handleSaveEmail}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Save size={14} />
                    {isSaving ? 'Saving...' : 'Save as Draft'}
                  </button>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Optimized for modern marketing emails
                  </div>
                </div>
              </div>

              {/* Inline Preview */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Eye size={18} className="text-blue-600" />
                  Inbox-style Preview
                </h3>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3 bg-white dark:bg-gray-800">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'SmartContent'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <span className="text-xs text-gray-400">Now</span>
                  </div>

                  <div className="px-4 py-3 space-y-1 bg-white dark:bg-gray-900">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {subject || 'Your subject line will appear here'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {previewText || 'Preview text appears here and should tease the main value of your email.'}
                    </p>
                  </div>

                  <div className="px-4 py-4 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-200 dark:border-gray-700">
                    <div
                      className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatEmailBody(body || 'Your email body preview will appear here once you start writing or generate with Gemini.') }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant / Design Tips */}
            <aside className="flex flex-col gap-6">
              {/* AI Assistant */}
              <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-[640px]">
                <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Strategy Assistant</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Ask about subject lines, segmentation ideas, or copy tweaks.
                  </p>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center ${
                          message.role === 'assistant'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        {message.role === 'assistant' ? <Sparkles size={16} /> : <User size={16} />}
                      </div>
                      <div
                        className={`flex-1 rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                          message.role === 'assistant'
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                  <div className="relative">
                    <input
                      className="w-full rounded-full border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 py-2 pl-4 pr-12 text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                      placeholder="Ask for ideas or feedback..."
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

              {/* Design / Best Practices Card */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-rose-500 text-white p-5 shadow-xl">
                <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Sparkles size={18} />
                  Design & Copy Tips
                </h4>
                <p className="text-sm text-blue-50 mb-3">
                  Create emails that look like they were crafted by a senior brand designer and copywriter.
                </p>
                <ul className="text-xs space-y-1 text-blue-50/90">
                  <li>• Keep one clear primary CTA above the fold.</li>
                  <li>• Use short paragraphs and plenty of white space.</li>
                  <li>• Highlight value, not features—especially in the first lines.</li>
                  <li>• Mirror the language your audience already uses.</li>
                  <li>• Always end with a confident, specific next step.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>

        {/* Full-screen Preview Modal */}
        {showPreview && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Email Preview</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">How your email will appear to subscribers.</p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Eye size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)] bg-gray-50 dark:bg-gray-900">
                <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                      {user?.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>

                  <div className="px-6 py-5 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Subject</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {subject || 'Your subject line goes here'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Preview text</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {previewText || 'This short line appears next to the subject in most inboxes.'}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                      <div
                        className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: formatEmailBody(
                            body ||
                              'Start writing your email body in the editor to see a full preview here. Use headings, bullet points, and short paragraphs for the best readability.',
                          ),
                        }}
                      />
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 flex items-center justify-center">
                    <button className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700">
                      {callToAction || 'Primary Call-to-Action'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
