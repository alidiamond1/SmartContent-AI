import { ArrowRight, Sparkles, Zap, CheckCircle2, Shield, Award, Users, TrendingUp, Star, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}

const Marquee = ({
  children,
  direction = "left",
  speed = 50,
  pauseOnHover = true,
  className = "",
}: MarqueeProps) => {
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth);
    }
  }, [children]);

  return (
    <div
      className={`overflow-hidden relative ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <div
        className={`flex min-w-full gap-4`}
        style={{
          transform: `translateX(${direction === "left" ? "-" : ""}${isPaused ? contentWidth / 4 : 0}px)`,
          animation: `scroll-${direction} ${contentWidth / speed}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        <div ref={contentRef} className="flex gap-4 shrink-0">
          {children}
        </div>
        <div className="flex gap-4 shrink-0">{children}</div>
      </div>

      <style>
        {`
          @keyframes scroll-left {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            from { transform: translateX(-50%); }
            to { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

export default function CTA() {
  const benefits = [
    'No credit card required',
    '14-day free trial',
    'Cancel anytime'
  ];

  const trustBadges = [
    { icon: Shield, text: 'Bank-level Security', color: 'from-blue-400 to-cyan-400' },
    { icon: Award, text: '4.9/5 Rating', color: 'from-yellow-400 to-orange-400' },
    { icon: Users, text: '10,000+ Users', color: 'from-purple-400 to-pink-400' },
    { icon: TrendingUp, text: '99.9% Uptime', color: 'from-green-400 to-emerald-400' },
    { icon: Star, text: 'Top Rated 2024', color: 'from-amber-400 to-yellow-400' },
    { icon: Heart, text: 'Loved by Creators', color: 'from-rose-400 to-pink-400' }
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjctNS4zNzMtMTItMTItMTJzLTEyIDUuMzczLTEyIDEyIDUuMzczIDEyIDEyIDEyIDEyLTUuMzczIDEyLTEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-12 sm:p-16 shadow-2xl">
          {/* Content */}
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-semibold text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Start Creating Amazing Content Today
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
              Ready to Transform Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Content Strategy?
                </span>
                <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 opacity-50"></span>
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Join thousands of content creators who are already using AI to write better, faster, and smarter. Get started in minutes!
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                  <span className="text-sm font-semibold">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#pricing"
                className="group relative w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
              <a
                href="#features"
                className="group w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                See How It Works
              </a>
            </div>

            {/* Trust Badge */}
            <p className="mt-8 text-white/80 text-sm">
              Trusted by <span className="font-bold text-white">10,000+</span> content creators worldwide
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* Scrolling Trust Badges */}
        <div className="mt-16">
          <Marquee direction="left" speed={45} pauseOnHover={true} className="py-4">
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div
                  key={index}
                  className="group relative flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl w-[240px] flex-shrink-0"
                >
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Text */}
                  <span className="text-white font-bold text-sm whitespace-nowrap">
                    {badge.text}
                  </span>

                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
