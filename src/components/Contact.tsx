import { MapPin, Phone, Mail } from 'lucide-react';
import { FormEvent, useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Have questions or need support? Our team is here to help you on your content creation journey.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  <MapPin className="h-6 w-6" />
                </div>
                <p className="text-base text-slate-600">
                  123 Content Ave, Suite 500, New York, NY 10001
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  <Phone className="h-6 w-6" />
                </div>
                <p className="text-base text-slate-600">
                  (123) 456-7890
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                  <Mail className="h-6 w-6" />
                </div>
                <p className="text-base text-slate-600">
                  support@smartcontent.ai
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-gray-50 p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="name">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    autoComplete="name"
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    autoComplete="email"
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700" htmlFor="message">
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <button
                  className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-600/90 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:ring-offset-2"
                  type="submit"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
