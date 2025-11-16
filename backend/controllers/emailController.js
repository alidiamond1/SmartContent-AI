import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import Email from '../models/Email.js';
import User from '../models/User.js';

dotenv.config();

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

if (!genAI) {
  console.error('⚠️  WARNING: GEMINI_API_KEY is not set. Email AI features will not work.');
}

// Helper to parse Gemini response in the format:
// Subject: ...\nPreview: ...\nBody:\n...
const parseEmailResponse = (rawText) => {
  if (!rawText) {
    return {
      subject: '',
      previewText: '',
      body: '',
    };
  }

  const subjectMatch = rawText.match(/Subject:\s*(.*)/i);
  const previewMatch = rawText.match(/Preview:\s*(.*)/i);
  const bodyIndex = rawText.search(/Body:/i);

  const subject = subjectMatch ? subjectMatch[1].trim() : '';
  const previewText = previewMatch ? previewMatch[1].trim() : '';
  const body = bodyIndex !== -1 ? rawText.substring(bodyIndex + 'Body:'.length).trim() : rawText.trim();

  return { subject, previewText, body };
};

// @desc    Generate marketing email with Gemini
// @route   POST /api/email/generate
// @access  Private
export const generateEmail = async (req, res) => {
  try {
    const { goal, productName, audience, tone, callToAction, additionalDetails } = req.body;

    if (!genAI) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured. Please contact support.',
      });
    }

    // Check user credits (1 credit per email)
    const user = await User.findById(req.user.id);
    if (user.credits < 1) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits. Please purchase more credits.',
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are an expert SaaS email copywriter.
Create a single polished marketing email based on the information below.

Format the response EXACTLY like this (no extra commentary):
Subject: <compelling subject line>
Preview: <short preview text shown in inbox>
Body:
<the full email body in markdown, with clear paragraphs and bullet points where helpful>

Details:
- Goal: ${goal || 'general product update'}
- Product or offer: ${productName || 'SmartContent AI'}
- Audience: ${audience || 'email subscribers'}
- Tone of voice: ${tone || 'Professional'}
- Main call to action: ${callToAction || 'Click to learn more'}
- Extra context: ${additionalDetails || 'N/A'}

Constraints:
- Keep subject under 80 characters.
- Keep preview under 130 characters.
- Body should be 200–500 words.
- Use the specified tone.
- Make the email feel modern and conversion-focused.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const { subject, previewText, body } = parseEmailResponse(text);

    // Deduct 1 credit
    user.credits -= 1;
    user.totalCreditsUsed += 1;
    await user.save();

    return res.status(200).json({
      success: true,
      subject,
      previewText,
      body,
      remainingCredits: user.credits,
    });
  } catch (error) {
    console.error('Generate email error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating email',
      error: error.message,
    });
  }
};

// @desc    Save email
// @route   POST /api/email/save
// @access  Private
export const saveEmail = async (req, res) => {
  try {
    const {
      subject,
      previewText,
      body,
      goal,
      audience,
      productName,
      tone,
      segment,
      status,
      scheduledAt,
    } = req.body;

    const email = await Email.create({
      user: req.user.id,
      subject,
      previewText,
      body,
      goal,
      audience,
      productName,
      tone,
      segment,
      status: status || 'draft',
      scheduledAt,
    });

    return res.status(201).json({
      success: true,
      email,
      message: 'Email saved successfully',
    });
  } catch (error) {
    console.error('Save email error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error saving email',
      error: error.message,
    });
  }
};

// @desc    Get all user emails
// @route   GET /api/email/my-emails
// @access  Private
export const getUserEmails = async (req, res) => {
  try {
    const emails = await Email.find({ user: req.user.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: emails.length,
      emails,
    });
  } catch (error) {
    console.error('Get user emails error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching emails',
    });
  }
};

// @desc    Delete email
// @route   DELETE /api/email/:id
// @access  Private
export const deleteEmail = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found',
      });
    }

    if (email.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this email',
      });
    }

    await email.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Email deleted successfully',
    });
  } catch (error) {
    console.error('Delete email error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting email',
    });
  }
};

// @desc    Ask AI assistant about email copy
// @route   POST /api/email/ask-ai
// @access  Private
export const askAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!genAI) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured. Please contact support.',
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are a senior lifecycle marketing strategist.
The user is working on an email campaign with this context:
Subject: ${context.subject || 'Not set'}
Goal: ${context.goal || 'General'}
Audience: ${context.audience || 'Not specified'}
Tone: ${context.tone || 'Professional'}
Current Body (first 400 chars): ${(context.body || '').slice(0, 400)}

User question: ${message}

Give a concise, practical answer focused on improving performance (subject line ideas, structure tweaks, copy suggestions, etc.).`;

    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;

    return res.status(200).json({
      success: true,
      response: aiResponse.text(),
    });
  } catch (error) {
    console.error('Email ask AI error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing AI request',
      error: error.message,
    });
  }
};
