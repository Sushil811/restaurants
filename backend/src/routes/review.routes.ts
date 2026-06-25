import { Router, Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Order from '../models/Order';
import MenuItem from '../models/MenuItem';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

const router = Router();

// ─── GET / (Public: List Reviews) ───────────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { menuItem, page = '1', limit = '10' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const query: any = { isApproved: true };
    if (menuItem) {
      if (!mongoose.Types.ObjectId.isValid(menuItem)) {
        res.status(400).json({ success: false, message: 'Invalid menuItem ID' });
        return;
      }
      query.menuItem = menuItem;
    }

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'name avatar')
        .lean(),
      Review.countDocuments(query),
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
    res.status(500).json({
      success: false,
      message: 'Server error retrieving reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── POST / (Auth: Create Review) ────────────────────────────────────────────
router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { menuItem, order, rating, title, body, images } = req.body;

    if (!rating || !body) {
      res.status(400).json({ success: false, message: 'Rating and review body are required' });
      return;
    }

    if (menuItem && !mongoose.Types.ObjectId.isValid(menuItem)) {
      res.status(400).json({ success: false, message: 'Invalid menuItem ID' });
      return;
    }

    if (order && !mongoose.Types.ObjectId.isValid(order)) {
      res.status(400).json({ success: false, message: 'Invalid order ID' });
      return;
    }

    // Check if user has already reviewed this item
    if (menuItem) {
      const existingReview = await Review.findOne({ user: req.user!._id, menuItem });
      if (existingReview) {
        res.status(400).json({ success: false, message: 'You have already reviewed this menu item.' });
        return;
      }
    }

    // Determine if review is verified (user actually bought the item)
    let isVerified = false;
    if (order && menuItem) {
      const verifiedOrder = await Order.findOne({
        _id: order,
        user: req.user!._id,
        paymentStatus: 'paid',
        'items.menuItem': menuItem,
      });
      if (verifiedOrder) {
        isVerified = true;
      }
    }

    const review = await Review.create({
      user: req.user!._id,
      menuItem,
      order,
      rating,
      title,
      body,
      images: images || [],
      isVerified,
      isApproved: true, // Auto-approve by default
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error: any) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── PUT /:id (Auth: Update Review) ───────────────────────────────────────────
router.put('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { rating, title, body, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid review ID' });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    if (review.user.toString() !== req.user!._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
      return;
    }

    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (body !== undefined) review.body = body;
    if (images !== undefined) review.images = images;

    await review.save(); // Pre-save hook recalculates ratings

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error updating review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── DELETE /:id (Auth: Delete Review) ────────────────────────────────────────
router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid review ID' });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    const isOwner = review.user.toString() === req.user!._id.toString();
    const isAdmin = ['admin', 'owner'].includes(req.user!.role);

    if (!isOwner && !isAdmin) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
      return;
    }

    await review.deleteOne(); // Post-delete hook updates ratings

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── POST /:id/helpful (Auth: Upvote helpful) ───────────────────────────────
router.post('/:id/helpful', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid review ID' });
      return;
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    );

    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error upvoting review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── POST /:id/reply (Admin/Owner: Reply to review) ─────────────────────────
router.post('/:id/reply', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ success: false, message: 'Reply text is required' });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid review ID' });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    review.adminReply = {
      text,
      repliedAt: new Date(),
    };

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error replying to review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── GET /admin (Admin: Get all reviews) ─────────────────────────────────────
router.get('/admin', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '50' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', 'name email avatar')
        .populate('menuItem', 'name')
        .lean(),
      Review.countDocuments(),
    ]);

    const reviewsWithItemName = reviews.map((r: any) => ({
      ...r,
      id: r._id.toString(),
      menuItemName: r.menuItem ? (r.menuItem.name || '') : 'General',
      status: r.isApproved ? 'approved' : 'pending',
    }));

    res.status(200).json({
      success: true,
      reviews: reviewsWithItemName,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving admin reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── PATCH /:id/approve (Admin: Approve review) ──────────────────────────────
router.patch('/:id/approve', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid review ID' });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    review.isApproved = true;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error approving review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── PATCH /:id/verify (Admin: Mark review as verified purchase) ─────────────
router.patch('/:id/verify', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid review ID' });
      return;
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }

    review.isVerified = true;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review marked as verified successfully',
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error verifying review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
