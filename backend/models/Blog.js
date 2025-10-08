import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content']
  },
  structure: {
    type: String,
    enum: ['Standard', 'Listicle', 'How-to Guide'],
    default: 'Standard'
  },
  keywords: {
    type: String,
    trim: true
  },
  tone: {
    type: String,
    enum: ['Professional', 'Casual', 'Witty', 'Persuasive'],
    default: 'Professional'
  },
  imageUrl: {
    type: String,
    trim: true
  },
  imageAlt: {
    type: String,
    trim: true
  },
  imageCredit: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  wordCount: {
    type: Number,
    default: 0
  },
  creditsUsed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate word count before saving
blogSchema.pre('save', function(next) {
  if (this.content) {
    this.wordCount = this.content.split(/\s+/).length;
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

