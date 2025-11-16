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
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Moon,
  Sun,
  Zap,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface OverviewResponse {
  success: boolean;
  totals: {
    blogs: number;
    socialPosts: number;
    emails: number;
    totalContent: number;
  };
  credits: {
    remaining: number;
    used: number;
  };
  lastActivityDate: string | null;
}

interface ActivityPoint {
  date: string;
  blogs: number;
  socialPosts: number;
  emails: number;
}

interface ActivityResponse {
  success: boolean;
  range: {
    from: string;
    to: string;
    days: number;
  };
  daily: ActivityPoint[];
}

export default function Analytics() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [credits, setCredits] = useState(user?.credits || 0);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [activity, setActivity] = useState<ActivityPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [rangeDays, setRangeDays] = useState(30);

  useEffect(() => {
    fetchAnalytics(rangeDays);
  }, [rangeDays]);

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

  const fetchAnalytics = async (days: number) => {
    try {
      setLoading(true);
      setError(null);

      const [overviewRes, activityRes, creditsRes] = await Promise.all([
        api.get<OverviewResponse>('/analytics/overview'),
        api.get<ActivityResponse>(`/analytics/activity?days=${days}`),
        api.get('/payment/credits'),
      ]);

      setOverview(overviewRes.data);
      setActivity(activityRes.data.daily);
      setCredits(creditsRes.data.credits);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', active: false },
    { name: 'Blog Writer', icon: FileEdit, href: '/blog-writer', active: false },
    { name: 'My Blogs', icon: FileText, href: '/my-blogs', active: false },
    { name: 'Social Posts', icon: Share2, href: '/social-posts', active: false },
    { name: 'My Posts', icon: Share2, href: '/my-social-posts', active: false },
    { name: 'Email Creator', icon: Mail, href: '/email-creator', active: false },
    { name: 'Analytics', icon: TrendingUp, href: '/analytics', active: true },
  ];

  const contentMixData = overview
    ? [
        { name: 'Emails', value: overview.totals.emails, color: '#0ea5e9' },
        { name: 'Blogs', value: overview.totals.blogs, color: '#a855f7' },
        { name: 'Social Posts', value: overview.totals.socialPosts, color: '#f97316' },
      ]
    : [];

  const totalContent = overview?.totals.totalContent || 0;

  const formatDateLabel = (value: string) => {
    const d = new Date(value);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

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
              placeholder="Search reports and metrics..."
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

        {/* Analytics Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/10 dark:to-purple-950/10">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-blue-600" />
                Analytics
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Understand how you are using SmartContent across blogs, social posts, and email campaigns.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Range</label>
              <select
                value={rangeDays}
                onChange={(e) => setRangeDays(Number(e.target.value))}
                className="rounded-lg border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 text-red-800 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Activity size={26} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{totalContent}</p>
                  <p className="text-blue-100 text-sm">Total Pieces</p>
                </div>
              </div>
              <p className="text-xs text-blue-100/90 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Combined blogs, social posts, and emails
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                  <Mail size={22} className="text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview?.totals.emails ?? 0}</p>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Emails Created</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI-powered campaigns and drafts.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                  <FileText size={22} className="text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview?.totals.blogs ?? 0}</p>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Blogs Written</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Long-form content generated with AI.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                  <BarChart3 size={22} className="text-amber-600" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview?.credits.used ?? 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">used</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Credits Usage</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {overview?.credits.remaining ?? 0} credits remaining in your account.
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Activity Chart */}
            <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="text-blue-600" size={22} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content over time</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Daily volume of content generated with AI.
                </p>
              </div>

              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
              ) : activity.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-sm text-gray-500 dark:text-gray-400 py-10">
                  No activity yet. Generate your first blog, social post, or email to see analytics here.
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activity} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDateLabel}
                        tick={{ fontSize: 11, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                      />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                      <Tooltip
                        labelFormatter={(label: string | number) => formatDateLabel(String(label))}
                        contentStyle={{ fontSize: 12 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area
                        type="monotone"
                        dataKey="blogs"
                        name="Blogs"
                        stroke="#a855f7"
                        fill="url(#colorBlogs)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="socialPosts"
                        name="Social Posts"
                        stroke="#f97316"
                        fill="url(#colorSocial)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="emails"
                        name="Emails"
                        stroke="#0ea5e9"
                        fill="url(#colorEmails)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Content Mix Pie */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="text-blue-600" size={22} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content mix</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Distribution by content type.</p>
              </div>

              {totalContent === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  No content yet. Once you create blogs, posts, or emails, your content mix will appear here.
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="h-52 w-full">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={contentMixData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={4}
                        >
                          {contentMixData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-xs w-full">
                    {contentMixData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-auto">
                          {totalContent ? Math.round((item.value / totalContent) * 100) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Credits insight */}
          {overview && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/30">
                  <Zap className="text-amber-600" size={22} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Credit efficiency</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {overview.credits.used > 0
                      ? `${(overview.totals.totalContent / overview.credits.used).toFixed(1)} pieces of content per credit on average.`
                      : 'Start generating blogs, posts, or emails to see efficiency stats.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{overview.credits.used}</span> credits used
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{overview.credits.remaining}</span> remaining
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
