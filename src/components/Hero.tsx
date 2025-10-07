import { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  isHtml?: boolean;
}

export default function Hero() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I\'m your SmartContent AI Assistant. How can I help you today?',
      isHtml: false
    }
  ]);
  const [userInput, setUserInput] = useState('');

  const presetQuestions = [
    'What can SmartContent AI do?',
    'What are your pricing plans?',
    'How can it help my marketing team?'
  ];

  const handleQuery = (query: string) => {
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setUserInput('');

    let response = '';
    let isResponseHtml = false;

    if (query.toLowerCase().includes('what can smartcontent ai do')) {
      response = `SmartContent AI offers a suite of powerful tools designed to streamline your content creation process. Key features include:
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li><strong>AI Blog Writer:</strong> Generate long-form blog posts quickly.</li>
          <li><strong>Social Assistant:</strong> Create engaging social media content.</li>
          <li><strong>Brand Voice:</strong> Maintain a consistent tone and style across all content.</li>
          <li><strong>Analytics:</strong> Track content performance and insights.</li>
        </ul>`;
      isResponseHtml = true;
    } else if (query.toLowerCase().includes('pricing plans')) {
      response = `SmartContent AI offers three flexible pricing plans:
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li><strong>Starter:</strong> Perfect for individuals or small teams, starting at $29/month.</li>
          <li><strong>Pro:</strong> Our most popular plan, offering unlimited words and advanced tools for $99/month.</li>
          <li><strong>Enterprise:</strong> Custom solutions for large organizations.</li>
        </ul>`;
      isResponseHtml = true;
    } else if (query.toLowerCase().includes('help my marketing team')) {
      response = `SmartContent AI can significantly boost your marketing team's productivity and content quality by:
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li><strong>Accelerating Content Production:</strong> Generate drafts and ideas in minutes.</li>
          <li><strong>Ensuring Brand Consistency:</strong> Maintain a unified brand voice.</li>
          <li><strong>Optimizing for Engagement:</strong> Craft compelling social media posts.</li>
          <li><strong>Providing Data-Driven Insights:</strong> Use analytics to refine your strategy.</li>
        </ul>`;
      isResponseHtml = true;
    } else {
      response = "I'm sorry, I couldn't find specific information for that query. Please try asking about features, pricing, or how SmartContent AI helps marketing teams.";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'ai', text: response, isHtml: isResponseHtml }]);
    }, 800);
  };

  const handleSend = () => {
    if (userInput.trim()) {
      handleQuery(userInput);
    }
  };

  return (
    <section className="relative py-24 sm:py-32 md:py-40 bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900 sm:text-5xl lg:text-6xl">
          Your AI Assistant for Content Creation
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-700">
          Ask SmartContent AI anything about its capabilities, pricing, or how it can help you write smarter and grow faster.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link 
            to="/register"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
          >
            Start Free Trial
          </Link>
          <Link 
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3 border border-blue-600 text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-blue-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
        <div className="mt-12 mx-auto max-w-3xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="h-[400px] overflow-y-auto p-6 space-y-4 text-left">
            {messages.map((message, index) => (
              <div key={index} className={message.sender === 'user' ? 'flex justify-end' : 'flex items-start gap-3'}>
                {message.sender === 'ai' && (
                  <div className="flex-shrink-0">
                    <Bot className="text-blue-600 w-8 h-8" />
                  </div>
                )}
                <div className={`p-4 rounded-b-xl shadow-sm max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tl-xl'
                    : 'bg-gray-100 text-slate-800 rounded-tr-xl'
                }`}>
                  {message.isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: message.text }} />
                  ) : (
                    <p className="font-medium">{message.text}</p>
                  )}
                  {message.sender === 'ai' && index === 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                      {presetQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuery(question)}
                          className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <input
                className="flex-grow rounded-lg border border-slate-300 bg-white py-2 px-4 text-slate-800 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Ask me anything..."
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                className="flex-shrink-0 bg-blue-600 text-white rounded-lg px-5 py-2 font-medium hover:bg-blue-600/90 transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
