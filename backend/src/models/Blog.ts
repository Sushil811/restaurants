import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: mongoose.Types.ObjectId;
  coverImage?: string;
  images: string[];
  category: 'recipes' | 'food-stories' | 'restaurant-news' | 'travel' | 'health';
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['recipes', 'food-stories', 'restaurant-news', 'travel', 'health'],
      required: [true, 'Category is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [70, 'SEO title cannot exceed 70 characters'],
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: [160, 'SEO description cannot exceed 160 characters'],
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    readTime: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Auto-generate slug from title
BlogSchema.pre('save', function (this: IBlog) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Auto-calculate read time (avg 200 words/min)
  if (this.isModified('content')) {
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  // Set publishedAt when publishing
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

BlogSchema.index({ isPublished: 1, publishedAt: -1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

const Blog: Model<IBlog> = mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
