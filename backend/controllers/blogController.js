import { GoogleGenerativeAI } from '@google/generative-ai';
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

if (!genAI) {
  console.error('⚠️  WARNING: GEMINI_API_KEY is not set. AI features will not work.');
}

// Unsplash Access Key
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || null;

// Helper function to fetch relevant image from Unsplash
const fetchBlogImage = async (title, keywords) => {
  try {
    // Extract search query from title and keywords
    const searchQuery = keywords || title.split(' ').slice(0, 3).join(' ');
    
    if (UNSPLASH_ACCESS_KEY) {
      // Use Unsplash API
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const photo = data.results[0];
        return {
          imageUrl: photo.urls.regular,
          imageAlt: photo.alt_description || title,
          imageCredit: `Photo by ${photo.user.name} on Unsplash`
        };
      }
    }
    
    // Fallback to Picsum (Lorem Picsum) - random beautiful images
    const randomId = Math.floor(Math.random() * 1000);
    return {
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(title)}/1200/630`,
      imageAlt: title,
      imageCredit: 'Image from Picsum Photos'
    };
  } catch (error) {
    console.error('Error fetching image:', error);
    // Return a default placeholder
    return {
      imageUrl: 'https://picsum.photos/1200/630',
      imageAlt: title,
      imageCredit: 'Image from Picsum Photos'
    };
  }
};

// @desc    Generate blog outline
// @route   POST /api/blog/generate-outline
// @access  Private
export const generateOutline = async (req, res) => {
  try {
    const { title, structure, keywords, tone } = req.body;

    if (!genAI) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured. Please contact support.'
      });
    }

    // Check user credits
    const user = await User.findById(req.user.id);
    if (user.credits < 1) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits. Please purchase more credits.'
      });
    }

    // Generate outline using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `Create a detailed blog post outline for the following:
Title: ${title}
Structure: ${structure}
Keywords: ${keywords || 'N/A'}
Tone: ${tone}

Please provide a structured outline with main sections and bullet points. Make it comprehensive and well-organized.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const outline = response.text();

    // Fetch relevant image
    const imageData = await fetchBlogImage(title, keywords);

    // Deduct 1 credit
    user.credits -= 1;
    user.totalCreditsUsed += 1;
    await user.save();

    res.status(200).json({
      success: true,
      outline,
      imageData,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Generate outline error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating outline',
      error: error.message
    });
  }
};

// @desc    Generate full blog post
// @route   POST /api/blog/generate-full
// @access  Private
export const generateFullBlog = async (req, res) => {
  try {
    const { title, outline, structure, keywords, tone } = req.body;

    if (!genAI) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured. Please contact support.'
      });
    }

    // Check user credits (full blog costs 3 credits)
    const user = await User.findById(req.user.id);
    if (user.credits < 3) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits. You need at least 3 credits to generate a full blog post.'
      });
    }

    // Generate full blog using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `Write a complete, high-quality blog post based on the following:
Title: ${title}
Structure: ${structure}
Outline: ${outline || 'Create your own structure'}
Keywords: ${keywords || 'N/A'}
Tone: ${tone}

Requirements:
- Write a comprehensive blog post (800-1500 words)
- Use the ${tone.toLowerCase()} tone throughout
- Include an engaging introduction
- Develop each section with detailed content
- Include relevant examples and insights
- Add a strong conclusion with a call-to-action
- Use proper markdown formatting with headings, bold text, and bullet points where appropriate
- Incorporate the keywords naturally if provided

Write the complete blog post now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    // Fetch relevant image
    const imageData = await fetchBlogImage(title, keywords);

    // Deduct 3 credits
    user.credits -= 3;
    user.totalCreditsUsed += 3;
    await user.save();

    res.status(200).json({
      success: true,
      content,
      imageData,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Generate full blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating blog post',
      error: error.message
    });
  }
};

// @desc    Save blog post
// @route   POST /api/blog/save
// @access  Private
export const saveBlog = async (req, res) => {
  try {
    const { title, content, structure, keywords, tone, imageUrl, imageAlt, imageCredit } = req.body;

    const blog = await Blog.create({
      user: req.user.id,
      title,
      content,
      structure,
      keywords,
      tone,
      imageUrl,
      imageAlt,
      imageCredit
    });

    res.status(201).json({
      success: true,
      blog,
      message: 'Blog post saved successfully'
    });
  } catch (error) {
    console.error('Save blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving blog post',
      error: error.message
    });
  }
};

// @desc    Get all user blogs
// @route   GET /api/blog/my-blogs
// @access  Private
export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs'
    });
  }
};

// @desc    Get single blog
// @route   GET /api/blog/:id
// @access  Private
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user owns the blog
    if (blog.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this blog'
      });
    }

    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog'
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blog/:id
// @access  Private
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check if user owns the blog
    if (blog.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog'
    });
  }
};

// @desc    Ask AI assistant
// @route   POST /api/blog/ask-ai
// @access  Private
export const askAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!genAI) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured. Please contact support.'
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `You are a helpful AI writing assistant. The user is working on a blog post with the following context:
Title: ${context.title || 'Not set'}
Current Content: ${context.content ? context.content.substring(0, 500) + '...' : 'No content yet'}

User's question: ${message}

Provide a helpful, concise response to assist them with their blog writing:`;

    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;

    res.status(200).json({
      success: true,
      response: aiResponse.text()
    });
  } catch (error) {
    console.error('Ask AI error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing AI request',
      error: error.message
    });
  }
};

