import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import MenuItem, { IMenuItem } from '../models/MenuItem';
import Category from '../models/Category';
import Review from '../models/Review';

// ─── Get All Menu Items ───────────────────────────────────────────────────────

export const getMenuItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      category,
      search,
      isVeg,
      isVegan,
      isGlutenFree,
      sort = '-createdAt',
      page = '1',
      limit = '12',
      minPrice,
      maxPrice,
    } = req.query as Record<string, string>;

    const query: Record<string, any> = { isAvailable: true };

    // Category filter
    if (category) {
      const cat = await Category.findOne({ slug: category, isActive: true }).lean();
      if (cat) {
        query.category = cat._id;
      } else {
        // Try by ObjectId
        if (mongoose.Types.ObjectId.isValid(category)) {
          query.category = new mongoose.Types.ObjectId(category);
        }
      }
    }

    // Text search (Optimized)
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Dietary filters
    if (isVeg === 'true') query.isVeg = true;
    if (isVegan === 'true') query.isVegan = true;
    if (isGlutenFree === 'true') query.isGlutenFree = true;

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortMap: Record<string, string> = {
      '-createdAt': '-createdAt',
      'price-asc': 'price',
      'price-desc': '-price',
      '-rating': '-rating',
      '-reviewCount': '-reviewCount',
      name: 'name',
    };
    const sortField = sortMap[sort] || '-createdAt';

    const [items, total] = await Promise.all([
      MenuItem.find(query)
        .populate('category', 'name slug')
        .sort(sortField)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      MenuItem.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.set('Cache-Control', 'public, max-age=60');
    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error: any) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching menu items',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ─── Get Featured Items ───────────────────────────────────────────────────────

export const getFeaturedItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await MenuItem.find({ isFeatured: true, isAvailable: true })
      .populate('category', 'name slug')
      .sort('-rating')
      .limit(8)
      .lean();

    res.set('Cache-Control', 'public, max-age=300');
    res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Get Chef Specials ────────────────────────────────────────────────────────

export const getChefSpecials = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await MenuItem.find({ isChefSpecial: true, isAvailable: true })
      .populate('category', 'name slug')
      .sort('-rating')
      .limit(8)
      .lean();

    res.set('Cache-Control', 'public, max-age=300');
    res.status(200).json({ success: true, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Get Categories ───────────────────────────────────────────────────────────

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { all } = req.query;
    const filter = all === 'true' ? {} : { isActive: true };
    const categories = await Category.find(filter)
      .sort('sortOrder')
      .lean();

    res.set('Cache-Control', 'public, max-age=300');
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Create Category (Admin/Owner Only) ──────────────────────────────────────

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, image, sortOrder, isActive } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required' });
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const category = await Category.create({
      name,
      slug,
      description,
      image: image || '',
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: 'A category with this name already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── Update Category (Admin/Owner Only) ──────────────────────────────────────

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid category ID' });
      return;
    }

    if (req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: 'A category with this name already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ─── Delete Category (Admin/Owner Only) ──────────────────────────────────────

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid category ID' });
      return;
    }

    // Check if there are menu items associated with this category
    const MenuItem = mongoose.model('MenuItem');
    const itemsCount = await MenuItem.countDocuments({ category: id });
    if (itemsCount > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete category as it is linked to menu items. Reassign them first.',
      });
      return;
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


// ─── Get Menu Item By Slug ────────────────────────────────────────────────────

export const getMenuItemBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params;

    const item = await MenuItem.findOne({ slug, isAvailable: true })
      .populate('category', 'name slug')
      .lean();

    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Create Menu Item ─────────────────────────────────────────────────────────

export const createMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      images,
      isVeg,
      isVegan,
      isGlutenFree,
      allergens,
      customizations,
      isFeatured,
      isChefSpecial,
      preparationTime,
      calories,
      tags,
      sortOrder,
    } = req.body;

    // Validate category exists
    const cat = await Category.findById(category);
    if (!cat) {
      res.status(400).json({ success: false, message: 'Category not found' });
      return;
    }

    // Auto-generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const item = await MenuItem.create({
      name,
      slug,
      description,
      category,
      price,
      discountPrice,
      images: images || [],
      isVeg: isVeg || false,
      isVegan: isVegan || false,
      isGlutenFree: isGlutenFree || false,
      allergens: allergens || [],
      customizations: customizations || [],
      isFeatured: isFeatured || false,
      isChefSpecial: isChefSpecial || false,
      preparationTime,
      calories,
      tags: tags || [],
      sortOrder: sortOrder || 0,
    });

    const populated = await item.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: populated,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: 'A menu item with this name already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Update Menu Item ─────────────────────────────────────────────────────────

export const updateMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid menu item ID' });
      return;
    }

    // If name is being updated, regenerate slug
    if (req.body.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const item = await MenuItem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: item,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Delete Menu Item ─────────────────────────────────────────────────────────

export const deleteMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid menu item ID' });
      return;
    }

    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Add Review for Menu Item ─────────────────────────────────────────────────

export const addReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, title, body, images, orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid menu item ID' });
      return;
    }

    const item = await MenuItem.findById(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    // Check for existing review
    const existing = await Review.findOne({ user: req.user!._id, menuItem: id });
    if (existing) {
      res.status(409).json({ success: false, message: 'You have already reviewed this item' });
      return;
    }

    // Check if user ordered this item (for verified badge)
    let isVerified = false;
    if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
      const Order = require('../models/Order').default;
      const order = await Order.findOne({
        _id: orderId,
        user: req.user!._id,
        'items.menuItem': id,
        orderStatus: 'delivered',
      });
      if (order) isVerified = true;
    }

    const review = await Review.create({
      user: req.user!._id,
      menuItem: id as string,
      order: orderId || undefined,
      rating,
      title,
      body,
      images: images || [],
      isVerified,
    });

    const populated = await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: populated,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ success: false, message: 'You have already reviewed this item' });
      return;
    }
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

// ─── Get Item Reviews ─────────────────────────────────────────────────────────

export const getItemReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '10', sort = '-createdAt' } = req.query as Record<string, string>;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid menu item ID' });
      return;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find({ menuItem: id, isApproved: true })
        .populate('user', 'name avatar')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Review.countDocuments({ menuItem: id, isApproved: true }),
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};
