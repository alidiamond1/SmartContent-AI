import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  FileText, 
  Share2, 
  BarChart3,
  Check,
  ArrowRight,
  Users,
  Globe,
  Clock
} from 'lucide-react';

export default function Hero() {
  const features = [
    { icon: FileText, title: 'AI Blog Writer', color: 'text-blue-600' },
    { icon: Share2, title: 'Social Posts', color: 'text-pink-600' },
    { icon: BarChart3, title: 'Analytics', color: 'text-purple-600' },
    { icon: Zap, title: 'Fast Generation', color: 'text-amber-600' }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: FileText, value: '500K+', label: 'Content Created' },
    { icon: Globe, value: '50+', label: 'Countries' },
    { icon: Clock, value: '24/7', label: 'AI Support' }
  ];

  const benefits = [
    'Generate blog posts in minutes',
    'Create viral social media content',
    'Maintain consistent brand voice',
    'AI-powered image suggestions',
    'Multi-platform optimization',
    'Real-time analytics'
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column - Text Content */}
          <div className="text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              <Sparkles size={16} />
              <span>AI-Powered Content Creation</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-gray-900">
              Create Amazing
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Content in Seconds
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              Transform your content creation with AI. Generate blogs, social posts, and more with SmartContent - the ultimate AI writing assistant.
            </p>

            {/* Benefits List */}
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Free Trial
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link 
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 pt-8 border-t border-gray-200">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon size={24} className="text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            {/* Dashboard Mock */}
            <div className="relative rounded-2xl shadow-2xl overflow-hidden border-8 border-white transform hover:scale-105 transition-transform duration-300">
              {/* Dashboard Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap size={16} className="text-amber-500" />
                  <span className="font-semibold">Dashboard</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <FileText size={20} className="text-purple-600" />
                      <TrendingUp size={16} className="text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">24</div>
                    <div className="text-sm text-gray-600">Blog Posts</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Share2 size={20} className="text-pink-600" />
                      <TrendingUp size={16} className="text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">156</div>
                    <div className="text-sm text-gray-600">Social Posts</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                  <div className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Generate Blog Post</div>
                        <div className="text-xs text-gray-600">AI-powered writing</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center">
                        <Share2 size={16} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Create Social Post</div>
                        <div className="text-xs text-gray-600">Multi-platform content</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Preview */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-semibold text-gray-900 mb-3">Performance</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Content Quality</span>
                      <span className="font-semibold text-gray-900">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Engagement Rate</span>
                      <span className="font-semibold text-gray-900">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-8 -left-8 bg-white rounded-lg shadow-lg p-3 animate-float">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Check size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Post Created!</div>
                  <div className="text-xs text-gray-600">Ready to publish</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-3 animate-float animation-delay-2000">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">+284% Reach</div>
                  <div className="text-xs text-gray-600">This week</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100 text-center group hover:-translate-y-1 transition-transform">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} className={feature.color} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
