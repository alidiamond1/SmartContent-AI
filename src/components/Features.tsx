import { PenTool, Users, Megaphone, TrendingUp } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <PenTool className="w-7 h-7" />,
      title: 'AI Blog Writer',
      id: 'feature-ai-blog-writer'
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Social Assistant',
      id: 'feature-social-assistant'
    },
    {
      icon: <Megaphone className="w-7 h-7" />,
      title: 'Brand Voice',
      id: 'feature-brand-voice'
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: 'Analytics',
      id: 'feature-analytics'
    }
  ];

  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Key Features
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to create amazing content.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              id={feature.id}
              className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
