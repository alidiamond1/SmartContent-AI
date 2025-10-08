import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../config/api';
import { 
  Home, 
  FileEdit, 
  Share2, 
  Mail, 
  TrendingUp, 
  Settings, 
  Search,
  LogOut,
  User,
  CreditCard,
  Send,
  Sparkles,
  Save,
  Download,
  Eye,
  Edit3,
  FileText
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function BlogWriter() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [credits, setCredits] = useState(user?.credits || 0);
  
  // Blog content state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [structure, setStructure] = useState('Standard');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Image state
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  
  // AI Assistant state
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'How can I help you improve this blog post?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const response = await api.get('/payment/credits');
      setCredits(response.data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const handleGenerateOutline = async () => {
    if (!title.trim()) {
      alert('Please enter a blog post title first');
      return;
    }

    if (credits < 1) {
      alert('Insufficient credits. Please purchase more credits.');
      navigate('/pricing');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post('/blog/generate-outline', {
        title,
        structure,
        keywords,
        tone
      });

      setContent(response.data.outline);
      setCredits(response.data.remainingCredits);
      
      // Set image data if available
      if (response.data.imageData) {
        setImageUrl(response.data.imageData.imageUrl);
        setImageAlt(response.data.imageData.imageAlt);
        setImageCredit(response.data.imageData.imageCredit);
      }
      
      await refreshUser();
    } catch (error: any) {
      console.error('Error generating outline:', error);
      alert(error.response?.data?.message || 'Failed to generate outline');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWriteWithAI = async () => {
    if (!title.trim()) {
      alert('Please enter a blog post title first');
      return;
    }

    if (credits < 3) {
      alert('Insufficient credits. You need at least 3 credits to generate a full blog post.');
      navigate('/pricing');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post('/blog/generate-full', {
        title,
        outline: content,
        structure,
        keywords,
        tone
      });

      setContent(response.data.content);
      setCredits(response.data.remainingCredits);
      
      // Set image data if available
      if (response.data.imageData) {
        setImageUrl(response.data.imageData.imageUrl);
        setImageAlt(response.data.imageData.imageAlt);
        setImageCredit(response.data.imageData.imageCredit);
      }
      
      await refreshUser();
    } catch (error: any) {
      console.error('Error generating blog:', error);
      alert(error.response?.data?.message || 'Failed to generate blog post');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveBlog = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please add both title and content before saving');
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.post('/blog/save', {
        title,
        content,
        structure,
        keywords,
        tone,
        imageUrl,
        imageAlt,
        imageCredit
      });

      alert('Blog post saved successfully!');
    } catch (error: any) {
      console.error('Error saving blog:', error);
      alert(error.response?.data?.message || 'Failed to save blog post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAskAI = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: 'user', content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage('');

    try {
      const response = await api.post('/blog/ask-ai', {
        message: inputMessage,
        context: { title, content }
      });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.data.response 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error asking AI:', error);
    }
  };

  // Simple markdown to HTML converter
  const formatContent = (text: string) => {
    if (!text) return '';
    
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      // Line breaks
      .replace(/\n/gim, '<br />')
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>');
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', active: false },
    { name: 'Blog Writer', icon: FileEdit, href: '/blog-writer', active: true },
    { name: 'My Blogs', icon: FileText, href: '/my-blogs', active: false },
    { name: 'Social Posts', icon: Share2, href: '#' },
    { name: 'Email Creator', icon: Mail, href: '#' },
    { name: 'Analytics', icon: TrendingUp, href: '#' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_319)">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect fill="white" height="48" width="48"></rect>
                </clipPath>
              </defs>
            </svg>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">SmartContent</h1>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 font-semibold'
                      : 'hover:bg-blue-600/10 dark:hover:bg-blue-600/20 hover:text-blue-600'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-2">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-600/10 dark:hover:bg-blue-600/20 hover:text-blue-600 transition-colors"
          >
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-10 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Search documents, templates, and more..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              title="Click to buy more credits"
            >
              <CreditCard size={18} />
              {credits} Credits
            </button>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Logout"
              >
                <LogOut size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Blog Writer Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Writer</h2>
            <p className="text-gray-500 dark:text-gray-400">Generate high-quality blog posts with our AI-powered tool.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Editor */}
            <div className="col-span-1 flex flex-col gap-6 lg:col-span-2">
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                {/* Featured Image */}
                {imageUrl && (
                  <div className="relative">
                    <img 
                      src={imageUrl} 
                      alt={imageAlt || title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    {imageCredit && (
                      <p className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                        {imageCredit}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="p-4">
                  <input
                    className="w-full border-0 bg-transparent p-0 text-xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
                    placeholder="Enter your blog post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 p-4 relative">
                  <div className="absolute top-2 right-2 z-10">
                    <button
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {isPreviewMode ? (
                        <>
                          <Edit3 size={14} />
                          Edit
                        </>
                      ) : (
                        <>
                          <Eye size={14} />
                          Preview
                        </>
                      )}
                    </button>
                  </div>
                  {isPreviewMode ? (
                    <div 
                      className="w-full min-h-[360px] text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatContent(content) }}
                    />
                  ) : (
                    <textarea
                      className="w-full resize-none border-0 bg-transparent p-0 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0"
                      placeholder="Start writing or let the AI assist you..."
                      rows={15}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveBlog}
                      disabled={isSaving}
                      className="rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerateOutline}
                      disabled={isGenerating}
                      className="rounded-lg bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-600/20 dark:bg-blue-600/20 dark:hover:bg-blue-600/30 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles size={16} />
                      {isGenerating ? 'Generating...' : 'Generate Outline'}
                    </button>
                    <button
                      onClick={handleWriteWithAI}
                      disabled={isGenerating}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles size={16} />
                      {isGenerating ? 'Writing...' : 'Write with AI'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Article Structure</label>
                  <select
                    className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                    value={structure}
                    onChange={(e) => setStructure(e.target.value)}
                  >
                    <option>Standard</option>
                    <option>Listicle</option>
                    <option>How-to Guide</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Keywords</label>
                  <input
                    className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                    placeholder="e.g., AI writing, content"
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tone of Voice</label>
                  <select
                    className="w-full rounded-lg border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Witty</option>
                    <option>Persuasive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AI Assistant Sidebar */}
            <aside className="flex flex-col gap-6">
              <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col h-[600px]">
                <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center ${
                        message.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700'
                      }`}>
                        {message.role === 'assistant' ? <Sparkles size={16} /> : <User size={16} />}
                      </div>
                      <div className={`flex-1 rounded-lg px-4 py-2 ${
                        message.role === 'assistant' 
                          ? 'bg-gray-100 dark:bg-gray-800' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                  <div className="relative">
                    <input
                      className="w-full rounded-full border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 py-2 pl-4 pr-12 text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                      placeholder="Ask me anything..."
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                    />
                    <button 
                      onClick={handleAskAI}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <Send className="text-blue-600" size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

