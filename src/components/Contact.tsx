import { MapPin, Phone, Mail, Send, MessageCircle, Clock } from 'lucide-react';
import { FormEvent, useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      detail: 'Mogadishu, Somalia',
      subDetail: 'Mogadishu, Somalia',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      detail: '+252 619 899 733',
      subDetail: 'Mon-Fri, 9AM-6PM EST',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Mail,
      title: 'Email Us',
      detail: 'support@smartcontent.ai',
      subDetail: 'We reply within 24 hours',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-semibold text-sm mb-6">
            <MessageCircle className="w-4 h-4" />
            Contact Us
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
              Let's Start a Conversation
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Contact Info */}
          <div className="flex flex-col justify-center space-y-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="group flex items-start gap-5 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInLeft 0.6s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <div className={`flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${info.color} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {info.title}
                    </h3>
                    <p className="text-gray-700 font-medium">
                      {info.detail}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {info.subDetail}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Additional Info Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Response Time</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Our support team typically responds within 24 hours during business days. For urgent matters, please call us directly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div
            className="rounded-3xl bg-white p-8 sm:p-10 shadow-2xl border border-gray-100"
            style={{
              animation: 'fadeInRight 0.6s ease-out forwards',
              animationDelay: '300ms',
              opacity: 0
            }}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <Send className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">
                  Thank you for contacting us. We'll get back to you soon!
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    Send us a message
                  </h3>
                  <p className="text-gray-600">
                    Fill out the form below and we'll be in touch shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="name">
                      Full Name *
                    </label>
                    <input
                      autoComplete="name"
                      className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900"
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="email">
                      Email Address *
                    </label>
                    <input
                      autoComplete="email"
                      className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2" htmlFor="message">
                      Your Message *
                    </label>
                    <textarea
                      className="block w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 resize-none"
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
