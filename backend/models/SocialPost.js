import mongoose from 'mongoose';

const socialPostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    platform: {
      type: String,
      required: true,
      enum: ['twitter', 'linkedin', 'instagram', 'facebook']
    },
    topic: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    tone: {
      type: String,
      default: 'Professional'
    },
    hashtags: {
      type: String
    },
    imageUrl: {
      type: String
    },
    imageAlt: {
      type: String
    },
    imageCredit: {
      type: String
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'draft'
    },
    scheduledAt: {
      type: Date
    },
    publishedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const SocialPost = mongoose.model('SocialPost', socialPostSchema);

export default SocialPost;

