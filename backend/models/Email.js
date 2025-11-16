import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide an email subject'],
      trim: true,
      maxlength: [200, 'Subject cannot be more than 200 characters'],
    },
    previewText: {
      type: String,
      trim: true,
      maxlength: [200, 'Preview text cannot be more than 200 characters'],
    },
    body: {
      // Stored as markdown / plain text; frontend is responsible for rendering
      type: String,
      required: [true, 'Please provide email body content'],
    },
    goal: {
      type: String,
      trim: true,
    },
    audience: {
      type: String,
      trim: true,
    },
    productName: {
      type: String,
      trim: true,
    },
    tone: {
      type: String,
      default: 'Professional',
    },
    segment: {
      // e.g. "New customers", "Inactive users"
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'sent'],
      default: 'draft',
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model('Email', emailSchema);

export default Email;
