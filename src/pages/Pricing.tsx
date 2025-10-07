import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface PricingPlan {
  name: string;
  price: number;
  credits: number;
  description: string;
  features: string[];
  package: string;
  popular?: boolean;
}

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const plans: PricingPlan[] = [
    {
      name: 'Starter',
      price: 0,
      credits: 5,
      description: 'Perfect for trying out',
      package: 'starter',
      features: [
        '5 free credits',
        '1 user',
        'Basic templates',
        'Email support'
      ]
    },
    {
      name: 'Basic',
      price: 9,
      credits: 100,
      description: 'For individuals',
      package: 'basic',
      features: [
        '100 credits',
        '1 user',
        'All templates',
        'Priority support',
        'No watermark'
      ]
    },
    {
      name: 'Pro',
      price: 29,
      credits: 500,
      description: 'Most Popular',
      package: 'pro',
      popular: true,
      features: [
        '500 credits',
        '5 users',
        'Advanced templates',
        'Priority support',
        'API access',
        'Custom branding'
      ]
    },
    {
      name: 'Unlimited',
      price: 99,
      credits: 9999,
      description: 'For power users',
      package: 'unlimited',
      features: [
        'Unlimited credits',
        'Unlimited users',
        'All templates',
        'Dedicated support',
        'API access',
        'Custom integrations',
        'White label'
      ]
    }
  ];

  const handlePurchase = async (packageType: string, price: number) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (price === 0) {
      alert('You already have free credits!');
      return;
    }

    setLoading(packageType);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/payment/create-checkout-session',
        { package: packageType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log('Checkout response:', response.data);

      if (response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      } else {
        alert('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.response?.data?.message || 'Error creating checkout session');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose the plan that's right for you
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Start free and upgrade as your business grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.package}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${
                plan.popular
                  ? 'border-blue-600 ring-2 ring-blue-600'
                  : 'border-gray-200 dark:border-gray-700'
              } p-6 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-6 -translate-y-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {plan.description}
                </p>
              </div>

              <button
                onClick={() => handlePurchase(plan.package, plan.price)}
                disabled={loading === plan.package}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-6 ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : plan.price === 0
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.package
                  ? 'Processing...'
                  : plan.price === 0
                  ? 'Get Started'
                  : user
                  ? 'Purchase Now'
                  : 'Sign Up'}
              </button>

              <ul className="space-y-3 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 SmartContent AI. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Terms</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</a>
            <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}
