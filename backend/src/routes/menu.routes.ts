import { Router } from 'express';
import {
  getMenuItems,
  getFeaturedItems,
  getChefSpecials,
  getCategories,
  getMenuItemBySlug,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  addReview,
  getItemReviews,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/menu.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// @route  GET /api/v1/menu
// @desc   Get all menu items with filtering, search, pagination
// @query  category, search, isVeg, isVegan, isGlutenFree, sort, page, limit, minPrice, maxPrice
router.get('/', getMenuItems);

// @route  GET /api/v1/menu/featured
// @desc   Get featured menu items
router.get('/featured', getFeaturedItems);

// @route  GET /api/v1/menu/chef-specials
// @desc   Get chef's special items
router.get('/chef-specials', getChefSpecials);

// @route  GET /api/v1/menu/categories
// @desc   Get all active categories
router.get('/categories', getCategories);

// @route  GET /api/v1/menu/:slug
// @desc   Get a single menu item by slug
router.get('/:slug', getMenuItemBySlug);

// ─── Admin/Owner Routes ───────────────────────────────────────────────────────

// @route  POST /api/v1/menu
// @desc   Create a new menu item
router.post('/', requireAuth, requireRole('admin', 'owner'), createMenuItem);

// @route  PUT /api/v1/menu/:id
// @desc   Update a menu item
router.put('/:id', requireAuth, requireRole('admin', 'owner'), updateMenuItem);

// @route  DELETE /api/v1/menu/:id
// @desc   Delete a menu item
router.delete('/:id', requireAuth, requireRole('admin', 'owner'), deleteMenuItem);

// @route  POST /api/v1/menu/categories
// @desc   Create a new category
router.post('/categories', requireAuth, requireRole('admin', 'owner'), createCategory);

// @route  PUT /api/v1/menu/categories/:id
// @desc   Update a category
router.put('/categories/:id', requireAuth, requireRole('admin', 'owner'), updateCategory);

// @route  DELETE /api/v1/menu/categories/:id
// @desc   Delete a category
router.delete('/categories/:id', requireAuth, requireRole('admin', 'owner'), deleteCategory);

// ─── Review Routes ────────────────────────────────────────────────────────────

// @route  POST /api/v1/menu/:id/reviews
// @desc   Add a review for a menu item
router.post('/:id/reviews', requireAuth, addReview);

// @route  GET /api/v1/menu/:id/reviews
// @desc   Get all approved reviews for a menu item
router.get('/:id/reviews', getItemReviews);

export default router;
