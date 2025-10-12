import { GoogleGenerativeAI } from '@google/generative-ai';
import SocialPost from '../models/SocialPost.js';
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
const fetchPostImage = async (topic, keywords) => {
  try {
    // Extract search query from topic and keywords
    const searchQuery = keywords || topic.split(' ').slice(0, 3).join(' ');
    
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
          imageAlt: photo.alt_description || topic,
          imageCredit: `Photo by ${photo.user.name} on Unsplash`
        };
      }
    }
    
    // Fallback to Picsum (Lorem Picsum) - random beautiful images
    return {
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(topic)}/1200/630`,
      imageAlt: topic,
      imageCredit: 'Image from Picsum Photos'
    };
  } catch (error) {
    console.error('Error fetching image:', error);
    // Return a default placeholder
    return {
      imageUrl: 'https://picsum.photos/1200/630',
      imageAlt: topic,
      imageCredit: 'Image from Picsum Photos'
    };
  }
};

// Platform-specific configurations
const platformConfig = {
  twitter: {
    maxChars: 280,
    name: 'Twitter/X',
    style: 'concise, punchy, and attention-grabbing'
  },
  linkedin: {
    maxChars: 3000,
    name: 'LinkedIn',
    style: 'professional, insightful, and thought-provoking'
  },
  instagram: {
    maxChars: 2200,
    name: 'Instagram',
    style: 'visual storytelling, engaging, and authentic'
  },
  facebook: {
    maxChars: 63206,
    name: 'Facebook',
    style: 'conversational, relatable, and community-focused'
  }
};

// @desc    Generate social media post
// @route   POST /api/social-post/generate
// @access  Private
export const generatePost = async (req, res) => {
  try {
    const { platform, topic, tone, hashtags, includeEmojis, includeHashtags, includeCTA, maxChars } = req.body;

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

    const config = platformConfig[platform];
    
    // Generate post using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    let prompt = `Create an engaging ${config.name} post about: ${topic}

Platform: ${config.name}
Style: ${config.style}
Tone: ${tone}
Max Characters: ${maxChars}
${hashtags ? `Related Keywords/Hashtags: ${hashtags}` : ''}
${includeEmojis ? 'Include relevant emojis to make it more engaging.' : 'Do not use emojis.'}
${includeHashtags ? 'Include 3-5 relevant hashtags at the end.' : 'Do not include hashtags.'}
${includeCTA ? 'Include a clear call-to-action.' : ''}

Requirements:
- Keep it within ${maxChars} characters
- Make it authentic and engaging
- ${platform === 'twitter' ? 'Keep it punchy and concise' : ''}
- ${platform === 'linkedin' ? 'Focus on professional insights and value' : ''}
- ${platform === 'instagram' ? 'Use storytelling and be visually descriptive' : ''}
- ${platform === 'facebook' ? 'Be conversational and community-oriented' : ''}
- Use the ${tone.toLowerCase()} tone throughout

Write the complete post now (just the post content, no explanations):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text().trim();

    // Fetch relevant image
    const imageData = await fetchPostImage(topic, hashtags);

    // Deduct 1 credit
    user.credits -= 1;
    user.totalCreditsUsed += 1;
    await user.save();

    res.status(200).json({
      success: true,
      content,
      imageData,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Generate post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating post',
      error: error.message
    });
  }
};

// @desc    Optimize existing social media post
// @route   POST /api/social-post/optimize
// @access  Private
export const optimizePost = async (req, res) => {
  try {
    const { platform, content, tone, maxChars } = req.body;

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

    const config = platformConfig[platform];
    
    // Optimize post using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `Optimize the following ${config.name} post to make it more engaging and effective:

Current Post:
${content}

Platform: ${config.name}
Style: ${config.style}
Tone: ${tone}
Max Characters: ${maxChars}

Requirements:
- Improve clarity and engagement
- Keep it within ${maxChars} characters
- Maintain the ${tone.toLowerCase()} tone
- Make it more compelling and actionable
- ${platform === 'twitter' ? 'Make it more punchy and shareable' : ''}
- ${platform === 'linkedin' ? 'Add more professional value and insights' : ''}
- ${platform === 'instagram' ? 'Enhance the storytelling and emotional connection' : ''}
- ${platform === 'facebook' ? 'Make it more conversational and relatable' : ''}

Write the optimized post now (just the post content, no explanations):`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const optimizedContent = response.text().trim();

    // Deduct 1 credit
    user.credits -= 1;
    user.totalCreditsUsed += 1;
    await user.save();

    res.status(200).json({
      success: true,
      content: optimizedContent,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Optimize post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error optimizing post',
      error: error.message
    });
  }
};

// @desc    Save social media post
// @route   POST /api/social-post/save
// @access  Private
export const savePost = async (req, res) => {
  try {
    const { platform, topic, content, tone, hashtags, imageUrl, imageAlt, imageCredit } = req.body;

    const socialPost = await SocialPost.create({
      user: req.user.id,
      platform,
      topic,
      content,
      tone,
      hashtags,
      imageUrl,
      imageAlt,
      imageCredit
    });

    res.status(201).json({
      success: true,
      socialPost,
      message: 'Social post saved successfully'
    });
  } catch (error) {
    console.error('Save social post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving social post',
      error: error.message
    });
  }
};

// @desc    Get all user social posts
// @route   GET /api/social-post/my-posts
// @access  Private
export const getUserPosts = async (req, res) => {
  try {
    const { platform } = req.query;
    
    const filter = { user: req.user.id };
    if (platform) {
      filter.platform = platform;
    }

    const posts = await SocialPost.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts'
    });
  }
};

// @desc    Get single social post
// @route   GET /api/social-post/:id
// @access  Private
export const getPost = async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this post'
      });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post'
    });
  }
};

// @desc    Delete social post
// @route   DELETE /api/social-post/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post'
    });
  }
};

// @desc    Ask AI assistant
// @route   POST /api/social-post/ask-ai
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
    
    const prompt = `You are a helpful social media marketing expert. The user is creating a social media post with the following context:
Platform: ${context.platform || 'Not selected'}
Topic: ${context.topic || 'Not set'}
Current Content: ${context.content || 'No content yet'}

User's question: ${message}

Provide a helpful, concise, and actionable response to assist them with their social media content:`;

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

