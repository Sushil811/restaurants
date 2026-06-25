import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAdminReply {
  text: string;
  repliedAt: Date;
}

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  menuItem?: mongoose.Types.ObjectId;
  order?: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  body: string;
  images: string[];
  isVerified: boolean;
  isApproved: boolean;
  adminReply?: IAdminReply;
  helpfulVotes: number;
  createdAt: Date;
  updatedAt: Date;
}

const AdminReplySchema = new Schema<IAdminReply>(
  {
    text: { type: String, required: true, trim: true },
    repliedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ReviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    body: {
      type: String,
      required: [true, 'Review body is required'],
      trim: true,
      maxlength: [2000, 'Review body cannot exceed 2000 characters'],
    },
    images: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    adminReply: {
      type: AdminReplySchema,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// One review per item per user
ReviewSchema.index({ user: 1, menuItem: 1 }, { unique: true, sparse: true });
ReviewSchema.index({ menuItem: 1, isApproved: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ createdAt: -1 });

// Update MenuItem rating after save/remove
ReviewSchema.post('save', async function () {
  await updateMenuItemRating(this.menuItem);
});

ReviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  await updateMenuItemRating(this.menuItem);
});

async function updateMenuItemRating(menuItemId?: mongoose.Types.ObjectId): Promise<void> {
  if (!menuItemId) return;

  const MenuItem = mongoose.model('MenuItem');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { menuItem: menuItemId, isApproved: true } },
    {
      $group: {
        _id: '$menuItem',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await MenuItem.findByIdAndUpdate(menuItemId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  } else {
    await MenuItem.findByIdAndUpdate(menuItemId, {
      rating: 0,
      reviewCount: 0,
    });
  }
}

const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
