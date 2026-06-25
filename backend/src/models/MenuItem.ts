import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICustomizationOption {
  name: string;
  additionalPrice: number;
}

export interface ICustomization {
  name: string;
  options: ICustomizationOption[];
}

export interface IMenuItem extends Document {
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  price: number;
  discountPrice?: number;
  images: string[];
  isVeg: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  customizations: ICustomization[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isFeatured: boolean;
  isChefSpecial: boolean;
  preparationTime: number;
  calories?: number;
  tags: string[];
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomizationOptionSchema = new Schema<ICustomizationOption>(
  {
    name: { type: String, required: true, trim: true },
    additionalPrice: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const CustomizationSchema = new Schema<ICustomization>(
  {
    name: { type: String, required: true, trim: true },
    options: { type: [CustomizationOptionSchema], default: [] },
  },
  { _id: false }
);

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
    },
    images: {
      type: [String],
      default: [],
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    allergens: {
      type: [String],
      default: [],
    },
    customizations: {
      type: [CustomizationSchema],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isChefSpecial: {
      type: Boolean,
      default: false,
    },
    preparationTime: {
      type: Number,
      required: [true, 'Preparation time is required'],
      min: [1, 'Preparation time must be at least 1 minute'],
    },
    calories: {
      type: Number,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: effective price
MenuItemSchema.virtual('effectivePrice').get(function (this: IMenuItem) {
  return this.discountPrice && this.discountPrice < this.price
    ? this.discountPrice
    : this.price;
});

// Auto-generate slug from name
MenuItemSchema.pre('save', function (this: IMenuItem, next: any) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ isAvailable: 1 });
MenuItemSchema.index({ isFeatured: 1 });
MenuItemSchema.index({ isChefSpecial: 1 });
MenuItemSchema.index({ rating: -1 });
MenuItemSchema.index({ name: 'text', description: 'text', tags: 'text' });

const MenuItem: Model<IMenuItem> = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;
