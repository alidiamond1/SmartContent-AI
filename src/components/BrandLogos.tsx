import { Award, TrendingUp, Users, Zap } from 'lucide-react';
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

export default function BrandLogos() {
  const brands = [
    { name: 'TechCorp', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=TechCorp&backgroundColor=3B82F6' },
    { name: 'InnovateHub', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=InnovateHub&backgroundColor=8B5CF6' },
    { name: 'CreativeFlow', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CreativeFlow&backgroundColor=10B981' },
    { name: 'DataDrive', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DataDrive&backgroundColor=F59E0B' },
    { name: 'CloudSync', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CloudSync&backgroundColor=EF4444' },
    { name: 'DigitalPro', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DigitalPro&backgroundColor=EC4899' },
    { name: 'NexusLabs', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=NexusLabs&backgroundColor=0EA5E9' },
    { name: 'QuantumAI', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=QuantumAI&backgroundColor=6366F1' },
    { name: 'SparkMedia', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=SparkMedia&backgroundColor=F97316' },
    { name: 'BrightPath', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=BrightPath&backgroundColor=14B8A6' },
    { name: 'VelocityLabs', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=VelocityLabs&backgroundColor=8B5CF6' },
    { name: 'FusionWorks', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=FusionWorks&backgroundColor=06B6D4' },
    { name: 'ApexSystems', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ApexSystems&backgroundColor=2563EB' },
    { name: 'EchoNet', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=EchoNet&backgroundColor=7C3AED' },
    { name: 'PrimeLogic', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=PrimeLogic&backgroundColor=DC2626' },
    { name: 'ZenithTech', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ZenithTech&backgroundColor=059669' },
    { name: 'CoreVision', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CoreVision&backgroundColor=DB2777' },
    { name: 'Luminary', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Luminary&backgroundColor=D97706' }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users' },
    { icon: TrendingUp, value: '99.9%', label: 'Uptime' },
    { icon: Zap, value: '50M+', label: 'Words Generated' },
    { icon: Award, value: '4.9/5', label: 'User Rating' }
  ];

  return (
    <section className="relative py-20 sm:py-28 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Trusted by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Leading Brands</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of companies already creating amazing content with SmartContent AI
          </p>
        </div>

        {/* Brand Logos Marquee */}
        <div className="relative mb-20">
          <Marquee direction="left" speed={35} pauseOnHover={true} className="py-4">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="group relative w-[180px] h-24 flex items-center justify-center rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110"
                />
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                style={{
                  animationDelay: `${(index + 6) * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 mb-4 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>

                {/* Value */}
                <div className="text-3xl font-black text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm font-semibold text-gray-600">
                  {stat.label}
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-100">
            <Award className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              Rated <span className="text-blue-600">Excellent</span> by over 10,000 users
            </span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
