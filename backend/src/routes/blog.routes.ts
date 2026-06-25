import { Router, Request, Response, NextFunction } from 'express';
import Blog from '../models/Blog';
import User from '../models/User';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = Router();

// ─── GET / (Public/Admin: Get Blogs) ──────────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, tag, search, page = '1', limit = '10' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Optional admin check for viewing draft blogs
    let isAdmin = false;
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
        const user = await User.findById(decoded.id);
        if (user && ['admin', 'owner'].includes(user.role)) {
          isAdmin = true;
        }
      } catch (err) {
        // Ignore JWT verification errors
      }
    }

    const query: any = {};
    if (!isAdmin) {
      query.isPublished = true;
    }
    if (category) {
      query.category = category;
    }
    if (tag) {
      query.tags = tag;
    }
    if (search) {
      query.$text = { $search: search };
    }

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('author', 'name avatar')
        .lean(),
      Blog.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: blogs,
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
      message: 'Server error retrieving blog posts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── GET /categories (Public: Get Categories with Counts) ────────────────────
router.get('/categories', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = ['recipes', 'food-stories', 'restaurant-news', 'travel', 'health'];
    const counts = await Blog.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const result = categories.map((cat) => {
      const match = counts.find((c) => c._id === cat);
      return {
        name: cat,
        count: match ? match.count : 0,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving blog categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── GET /:slug (Public/Admin: Get Single Blog & Increment Views) ─────────────
router.get('/:slug', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar');

    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    // Only allow viewing drafts if authorized
    if (!blog.isPublished) {
      let isAdmin = false;
      let token: string | undefined;

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      }

      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
          const user = await User.findById(decoded.id);
          if (user && ['admin', 'owner'].includes(user.role)) {
            isAdmin = true;
          }
        } catch (err) {
          // Ignore token parsing error
        }
      }

      if (!isAdmin) {
        res.status(404).json({ success: false, message: 'Blog post not found' });
        return;
      }
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── POST / (Admin/Owner: Create Blog) ───────────────────────────────────────
router.post('/', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      title,
      excerpt,
      content,
      coverImage,
      images,
      category,
      tags,
      isPublished,
      seoTitle,
      seoDescription,
    } = req.body;

    if (!title || !excerpt || !content || !category) {
      res.status(400).json({
        success: false,
        message: 'Title, excerpt, content, and category are required',
      });
      return;
    }

    const blog = await Blog.create({
      title,
      excerpt,
      content,
      author: req.user!._id,
      coverImage: coverImage || '',
      images: images || [],
      category,
      tags: tags || [],
      isPublished: isPublished !== undefined ? isPublished : false,
      seoTitle,
      seoDescription,
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error creating blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── PUT /:id (Admin/Owner: Update Blog) ───────────────────────────────────────
router.put('/:id', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid blog ID' });
      return;
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    // Update using assign and save to trigger Mongoose pre-save hook for slug/readTime recalculations
    Object.assign(blog, updateData);
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error updating blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── DELETE /:id (Admin/Owner: Delete Blog) ───────────────────────────────────
router.delete('/:id', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid blog ID' });
      return;
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── PATCH /:id/toggle-publish (Admin/Owner: Toggle Publish Status) ───────────
router.patch('/:id/toggle-publish', requireAuth, requireRole('admin', 'owner'), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid blog ID' });
      return;
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog post not found' });
      return;
    }

    blog.isPublished = !blog.isPublished;
    if (blog.isPublished && !blog.publishedAt) {
      blog.publishedAt = new Date();
    }
    await blog.save();

    res.status(200).json({
      success: true,
      message: `Blog post successfully ${blog.isPublished ? 'published' : 'unpublished'}`,
      data: blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error toggling blog publish status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
