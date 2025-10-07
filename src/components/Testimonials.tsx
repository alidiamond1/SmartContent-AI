export default function Testimonials() {
  const testimonials = [
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCRcSB3RXxXERt8kmgJitZ_rWUR7B9Z2LKjFcAfk60l4Ug57GZcykIaPq7xeZCg7buXyea9cVd2ShLhgu-6dymTGB_xmTLzIGsElBLT9G4GJl-zF4l0g0RBHX4hd639Xq_I_CH3Wl3APWPLzDvR24VgudAHNVvvdFxONivvzzdGqu5ry5RSZHmKv-6CBJPhcvBCO_Q77MYiSKNJZs1P2xZ7CfUMynxn7a2hg6u6sLIJjPcl8dyU0_gR2Qe3HIKbVNQ8DH-DbH-qA',
      quote: 'SmartContent AI has revolutionized our content strategy. We\'re seeing a 30% increase in engagement!',
      author: 'Sarah, Marketing Manager at Tech Innovators Inc.'
    },
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgxtNXbcGEaTV5np69g5c_iEosdh3fEdBbCwWvIgkV_SHV5WxfVmXDJzIfGFY0zlcD-WIHlS7lLL0zxzTwIRBD1xWGfW3iI9wMLvAmxs-9kneFegz6woK91o7Ga7NaKHSdVEp8oREFlvdbPNMfILSA-M18co0-Su7J7MIKWAon_ArU16hQhBXY131t6Bml89ZHbtrkycyNrOnamj96MadMLnhmbxGf7EFrsQcmfT4mRDJ4ML_fOz5yXJt4F2q7Kqg4F67FwUk8uA',
      quote: 'The AI-powered tools are incredibly intuitive and save us hours of work each week.',
      author: 'David, Content Strategist at Creative Solutions Co.'
    },
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQD9KObCsy2uWXf7_rjXKFL0Q02rVMmqpc6G79TMsEnhELVyZ6iKAVsK0JH7BD-AAaZvjdbcsNPBIhGNsv5k0zqxChg6ioYp8fdNey55nQ7bFMd0mx8QnEJ6JONYqNy0kUOO_1GSleq84dY7S47qj0-iKzsoiCrzGG_91WwzHIA0aEclEtWeBqLgbz31qQQ2fqBFNoGg9XlGnarwVCWaQtHtzDqfA2n480m3z1ezbzqaghomPsW3ZbG1JcDDS7ZSzsUC7ULbE2IA',
      quote: 'I love how SmartContent AI helps me maintain a consistent brand voice across all platforms.',
      author: 'Emily, Social Media Specialist at Style Hub'
    }
  ];

  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Real stories from real people.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col gap-6 rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div
                className="aspect-square w-full rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url("${testimonial.image}")` }}
              />
              <blockquote className="flex-grow">
                <p className="text-base font-medium">
                  "{testimonial.quote}"
                </p>
                <footer className="mt-4 text-sm text-slate-500">
                  {testimonial.author}
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
