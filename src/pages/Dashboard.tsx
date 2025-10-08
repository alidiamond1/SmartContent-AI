import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  X
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [credits, setCredits] = useState(user?.credits || 0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

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

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', active: true },
    { name: 'Blog Writer', icon: FileEdit, href: '/blog-writer' },
    { name: 'Social Posts', icon: Share2, href: '#' },
    { name: 'Email Creator', icon: Mail, href: '#' },
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

        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
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
        <div className="p-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Welcome back, {user?.name}! Let's create something amazing today!
          </p>

          {/* Overview Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h3>
            <div 
              className="w-full bg-center bg-no-repeat aspect-[2/1] bg-cover rounded-xl shadow-lg"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCCy3c1dotaK8y8U16myHGji-udpH2cHXX4xi0fwRNRjDbMn5D62ooNT7m_KoGtdqthCac6DJV0StfdYhBSgVkVoI-tR_-JHmNdi88yWcy5CVG_F4vDytvtaILrajRfDd4Q3oiTsn8Hu4Ze4W7UBkNnwF4ixlTIWHBLmMLiU2VAd_jxY0Z1wW8Qnan4c0l3rGF102M1pKgqIHxF6AvCtoI_5zAogWK1NHl_TLuWcCthfKfAiWni--pAdlsAgbhTL2pcm3A9vf0N-Q')"
              }}
            />
          </div>

          {/* Engagement Metrics */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Engagement Metrics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Social Media Engagement</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">+15%</p>
                  </div>
                  <div className="flex gap-2 items-center text-green-500 font-semibold">
                    <span>+15%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">vs. Last 30 Days</p>
                <div className="mt-8 h-48">
                  <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 472 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" fill="url(#paint0_linear_refactored)"></path>
                    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="url(#paint1_linear_refactored)" strokeLinecap="round" strokeWidth="3"></path>
                    <defs>
                      <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_refactored" x1="236" x2="236" y1="1" y2="149">
                        <stop stopColor="#2563eb" stopOpacity="0.2"></stop>
                        <stop offset="1" stopColor="#2563eb" stopOpacity="0"></stop>
                      </linearGradient>
                      <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_refactored" x1="0" x2="472" y1="75" y2="75">
                        <stop stopColor="#2563eb"></stop>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Coming Soon Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-center items-center text-center">
                <p className="text-gray-600 dark:text-gray-300 font-medium">Coming Soon</p>
                <p className="text-lg font-semibold text-gray-800 dark:text-white mt-2">More analytics are on the way!</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Stay tuned for updates.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
