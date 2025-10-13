import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-20 right-20 w-20 h-20 border-4 border-blue-300 rounded-xl rotate-45 opacity-20 animate-pulse"></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 border-4 border-purple-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-40 w-12 h-12 bg-gradient-to-br from-pink-300 to-purple-300 rounded-lg opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="absolute w-full z-10">
          <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
            <Link to="/" className="group flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SmartContent AI</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors" 
                to="/register"
              >
                Sign Up
              </Link>
              <Link 
                className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all" 
                to="/"
              >
                Home
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Welcome Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border border-gray-100 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">Welcome back!</span>
              </div>
            </div>

            <div className="relative bg-white/90 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/50">
              {/* Gradient Orb Decorations */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl opacity-20"></div>

              <div className="relative text-center">
                <h2 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  Welcome Back
                </h2>
                <p className="text-gray-600 font-medium">
                  Sign in to continue your content journey
                </p>
              </div>

              {(formError || error) && (
                <div className="mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-shake">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <p className="text-sm font-medium">{formError || error}</p>
                </div>
              )}

              <div className="mt-8 space-y-6">
                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="group relative w-full inline-flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:border-blue-300 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 488 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 62.3l-66.5 64.6C305.5 102.2 278.4 88 248 88c-86.5 0-156 70.1-156 156s69.5 156 156 156c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="currentColor"></path>
                    </svg>
                    Google
                  </button>
                  <button className="group relative w-full inline-flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:border-blue-300 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 496 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3.3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.3-6.2-10.1-27.8 2.3-57.5 0 0 21.2-6.8 69.7 26.3 20.9-5.8 43.5-8.7 66.2-8.7 22.7 0 45.3 2.9 66.2 8.7 48.6-33.1 69.7-26.3 69.7-26.3 12.4 29.7 4.6 51.3 2.3 57.5 16 17.6 23.6 31.4 23.6 58.9 0 96.5-58.7 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.6.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" fill="currentColor"></path>
                    </svg>
                    GitHub
                  </button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-semibold">or continue with email</span>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 bg-gray-50 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all sm:text-sm font-medium"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="group">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 bg-gray-50 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all sm:text-sm font-medium"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full flex items-center justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    Sign Up for Free
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
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

        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
