import { Router, Request, Response, NextFunction } from 'express';
import User from '../models/User';
import MenuItem from '../models/MenuItem';
import LoyaltyPoints from '../models/LoyaltyPoints';
import { requireAuth } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

const router = Router();

// Apply requireAuth middleware to all endpoints in this router
router.use(requireAuth);

// ─── GET /profile (Get User Profile) ──────────────────────────────────────────
router.get('/profile', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id)
      .select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken')
      .populate('favoriteItems', 'name price images slug')
      .lean();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── PUT /profile (Update Profile Details) ────────────────────────────────────
router.put('/profile', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── PUT /change-password (Change Account Password) ──────────────────────────
router.put('/change-password', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: 'Old password and new password are required',
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long',
      });
      return;
    }

    const user = await User.findById(req.user!._id).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Incorrect current password' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error changing password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── GET /favorites (Get Favorites List) ─────────────────────────────────────
router.get('/favorites', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id)
      .populate('favoriteItems', 'name price discountPrice images slug isAvailable rating')
      .lean();

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: user.favoriteItems,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving favorites',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── POST /favorites/:itemId (Add Favorite Item) ─────────────────────────────
router.post('/favorites/:itemId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId as string)) {
      res.status(400).json({ success: false, message: 'Invalid item ID' });
      return;
    }

    const itemExists = await MenuItem.findById(itemId).lean();
    if (!itemExists) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }

    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isAlreadyFav = user.favoriteItems.some(
      (id) => id.toString() === itemId
    );

    if (!isAlreadyFav) {
      user.favoriteItems.push(new mongoose.Types.ObjectId(itemId as string) as any);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Item added to favorites successfully',
      data: user.favoriteItems,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error adding item to favorites',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── DELETE /favorites/:itemId (Remove Favorite Item) ──────────────────────────
router.delete('/favorites/:itemId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId as string)) {
      res.status(400).json({ success: false, message: 'Invalid item ID' });
      return;
    }

    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.favoriteItems = user.favoriteItems.filter(
      (id) => id.toString() !== itemId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from favorites successfully',
      data: user.favoriteItems,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error removing item from favorites',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── GET /addresses (Get Address Book) ────────────────────────────────────────
router.get('/addresses', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).select('addresses').lean();
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: user.addresses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving addresses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── POST /addresses (Add New Address) ────────────────────────────────────────
router.post('/addresses', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { street, city, state, pincode, isDefault } = req.body;

    if (!street || !city || !state || !pincode) {
      res.status(400).json({
        success: false,
        message: 'Street, city, state, and pincode are required',
      });
      return;
    }

    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const setAsDefault = isDefault !== undefined ? isDefault : user.addresses.length === 0;

    if (setAsDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({
      street,
      city,
      state,
      pincode,
      isDefault: setAsDefault,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: user.addresses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error saving address',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── PUT /addresses/:id (Update Address Details) ──────────────────────────────
router.put('/addresses/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { street, city, state, pincode, isDefault } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid address ID' });
      return;
    }

    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const address = user.addresses.find((addr) => addr._id?.toString() === id);
    if (!address) {
      res.status(404).json({ success: false, message: 'Address not found' });
      return;
    }

    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;

    if (isDefault !== undefined) {
      if (isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
      }
      address.isDefault = isDefault;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: user.addresses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error updating address',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── DELETE /addresses/:id (Remove Address) ───────────────────────────────────
router.delete('/addresses/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      res.status(400).json({ success: false, message: 'Invalid address ID' });
      return;
    }

    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id?.toString() === id
    );

    if (addressIndex === -1) {
      res.status(404).json({ success: false, message: 'Address not found' });
      return;
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If default address is deleted, make the first remaining address the default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address removed successfully',
      data: user.addresses,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting address',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// ─── GET /loyalty (Get Loyalty Status & Transactions) ─────────────────────────
router.get('/loyalty', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const loyalty = await LoyaltyPoints.findOne({ user: req.user!._id }).lean();

    res.status(200).json({
      success: true,
      data: loyalty || {
        user: req.user!._id,
        points: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        transactions: [],
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving loyalty points status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
