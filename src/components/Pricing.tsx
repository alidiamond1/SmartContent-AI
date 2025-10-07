import { Check } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      buttonText: 'Get Started',
      buttonStyle: 'bg-blue-600/20 text-blue-600 hover:bg-blue-600/30',
      popular: false,
      features: [
        '50,000 words',
        'Basic AI tools',
        'Community support'
      ]
    },
    {
      name: 'Pro',
      price: '$99',
      period: '/month',
      buttonText: 'Upgrade Now',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-600/90',
      popular: true,
      features: [
        'Unlimited words',
        'Advanced AI tools',
        'Priority support'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      period: '',
      buttonText: 'Get a Quote',
      buttonStyle: 'bg-blue-600/20 text-blue-600 hover:bg-blue-600/30',
      popular: false,
      features: [
        'Custom word limits',
        'All features',
        'Dedicated account manager'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pricing Plans
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Choose the plan that's right for you.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-xl border p-8 shadow-sm ${
                plan.popular
                  ? 'relative border-blue-600 bg-white shadow-2xl shadow-blue-600/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase text-white">
                  Most Popular
                </div>
              )}
              <h3 className={`text-lg font-bold ${plan.popular ? 'text-blue-600' : ''}`}>
                {plan.name}
              </h3>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                {plan.period && <span className="text-base font-bold">{plan.period}</span>}
              </p>
              <a
                className={`mt-6 flex h-10 w-full items-center justify-center rounded-lg text-sm font-bold transition-colors ${plan.buttonStyle}`}
                href="#"
              >
                {plan.buttonText}
              </a>
              <ul className="mt-8 flex-grow space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-6 w-6 flex-shrink-0 text-blue-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
