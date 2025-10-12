import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      description: 'Perfect for individuals getting started',
      price: '$29',
      period: '/month',
      buttonText: 'Get Started',
      popular: false,
      features: [
        '50,000 AI-generated words',
        'Basic AI writing tools',
        '10 blog posts per month',
        '20 social posts per month',
        'Email support',
        'Basic templates'
      ]
    },
    {
      name: 'Pro',
      icon: Sparkles,
      description: 'Best for professionals and teams',
      price: '$99',
      period: '/month',
      buttonText: 'Start Free Trial',
      popular: true,
      features: [
        'Unlimited AI-generated words',
        'Advanced AI tools & models',
        'Unlimited blog posts',
        'Unlimited social posts',
        'Priority support',
        'Premium templates',
        'SEO optimization',
        'Content analytics'
      ]
    },
    {
      name: 'Enterprise',
      icon: Crown,
      description: 'Custom solutions for large organizations',
      price: 'Custom',
      period: '',
      buttonText: 'Contact Sales',
      popular: false,
      features: [
        'Everything in Pro',
        'Custom AI model training',
        'Dedicated account manager',
        'Custom integrations',
        'SLA & uptime guarantee',
        'Advanced security',
        'Team collaboration tools',
        'White-label options'
      ]
    }
  ];

  return (
    <section id="pricing" className="relative py-24 sm:py-32 bg-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-semibold text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            Pricing Plans
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your content creation needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl p-8 transition-all duration-500 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white shadow-2xl scale-105 lg:scale-110 z-10'
                    : 'bg-white text-gray-900 shadow-xl hover:shadow-2xl border-2 border-gray-100 hover:border-blue-200'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-black uppercase shadow-lg">
                      <Crown className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl ${
                  plan.popular 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600'
                }`}>
                  <Icon className="w-7 h-7" />
                </div>

                {/* Plan Name & Description */}
                <h3 className={`text-2xl font-black mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-black ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-lg font-semibold ${plan.popular ? 'text-blue-200' : 'text-gray-600'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={plan.popular ? '#' : plan.name === 'Enterprise' ? '#contact' : '#'}
                  className={`group flex items-center justify-center gap-2 w-full py-4 rounded-xl text-base font-bold transition-all duration-300 mb-8 ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Features List */}
                <div className={`pt-6 border-t ${plan.popular ? 'border-white/20' : 'border-gray-200'}`}>
                  <div className={`text-sm font-bold mb-4 ${plan.popular ? 'text-blue-100' : 'text-gray-900'}`}>
                    What's included:
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.popular 
                            ? 'bg-white/20' 
                            : 'bg-blue-100'
                        }`}>
                          <Check className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-blue-600'}`} strokeWidth={3} />
                        </div>
                        <span className={`text-sm ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Glow Effect for Popular Plan */}
                {plan.popular && (
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-50 blur-2xl -z-10"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-2">
            All plans include a <span className="font-bold text-blue-600">14-day free trial</span>. No credit card required.
          </p>
          <p className="text-sm text-gray-500">
            Need a custom plan? <a href="#contact" className="text-blue-600 hover:text-blue-700 font-semibold underline">Contact our sales team</a>
          </p>
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

        .bg-grid-slate-100 {
          background-image: linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </section>
  );
}
