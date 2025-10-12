import { PenTool, Users, Megaphone, TrendingUp, Sparkles, Zap, Globe, Shield, Clock, Target, BarChart3, Lightbulb } from 'lucide-react';

export default function Features() {
  const mainFeatures = [
    {
      icon: PenTool,
      title: 'AI Blog Writer',
      description: 'Create engaging, SEO-optimized blog posts in minutes with our advanced AI technology.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      id: 'feature-ai-blog-writer'
    },
    {
      icon: Megaphone,
      title: 'Social Media Posts',
      description: 'Generate platform-optimized social content for Twitter, LinkedIn, Facebook, and Instagram.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      id: 'feature-social-assistant'
    },
    {
      icon: Target,
      title: 'Content Optimization',
      description: 'AI-powered suggestions to improve readability, engagement, and SEO performance.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      id: 'feature-brand-voice'
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Insights',
      description: 'Track performance metrics and gain insights to improve your content strategy.',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      id: 'feature-analytics'
    }
  ];

  const additionalFeatures = [
    { icon: Zap, text: 'Lightning-fast generation' },
    { icon: Globe, text: 'Multi-language support' },
    { icon: Shield, text: 'Plagiarism-free content' },
    { icon: Clock, text: 'Save hours of work' },
    { icon: Users, text: 'Team collaboration' },
    { icon: BarChart3, text: 'Performance tracking' }
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-semibold text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
              Everything You Need to Create
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Amazing Content
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Powerful AI-driven tools designed to help you create, optimize, and manage your content effortlessly.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-20">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                id={feature.id}
                className="group relative rounded-3xl bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Arrow Effect */}
                <div className="mt-6 flex items-center gap-2 text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Learn more
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="relative">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-black text-gray-900 mb-3">
              And Much More...
            </h3>
            <p className="text-gray-600">
              Packed with features to supercharge your content creation
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-blue-200"
                  style={{
                    animationDelay: `${(index + 4) * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 text-center group-hover:text-blue-600 transition-colors">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
            <Lightbulb className="w-5 h-5" />
            <a href="#pricing">Explore All Features</a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
