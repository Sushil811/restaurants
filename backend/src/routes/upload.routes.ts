import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
} from '../config/cloudinary';

const router = Router();

// Create local temp uploads folder in OS temp directory
const tempDir = path.join(os.tmpdir(), 'lumiere-uploads');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Multer Upload Configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (.jpg, .jpeg, .png, .webp) are allowed!'));
  },
});

// ─── POST /image (Admin: Upload Single Image) ────────────────────────────────
router.post(
  '/image',
  requireAuth,
  requireRole('admin', 'owner'),
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }

      const { secure_url, public_id } = await uploadToCloudinary(
        req.file.path,
        'lumiere/general'
      );

      // Async clean up of temp file
      fs.promises.unlink(req.file.path).catch((err) => {
        console.error('⚠️ Failed to delete temporary upload file:', err.message);
      });

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: secure_url,
          publicId: public_id,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Server error during image upload',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// ─── POST /images (Admin: Upload Multiple Images) ─────────────────────────────
router.post(
  '/images',
  requireAuth,
  requireRole('admin', 'owner'),
  upload.array('images', 10),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ success: false, message: 'No files uploaded' });
        return;
      }

      const filePaths = files.map((file) => file.path);
      const uploadResults = await uploadMultipleToCloudinary(
        filePaths,
        'lumiere/general'
      );

      // Async clean up of temp files
      files.forEach((file) => {
        fs.promises.unlink(file.path).catch((err) => {
          console.error('⚠️ Failed to delete temporary upload file:', err.message);
        });
      });

      res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: uploadResults.map((r) => ({
          url: r.secure_url,
          publicId: r.public_id,
        })),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Server error during images upload',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// ─── DELETE /image (Admin: Delete Image) ─────────────────────────────────────
router.delete(
  '/image',
  requireAuth,
  requireRole('admin', 'owner'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { publicId } = req.body;
      if (!publicId) {
        res.status(400).json({ success: false, message: 'publicId is required' });
        return;
      }

      await deleteFromCloudinary(publicId);

      res.status(200).json({
        success: true,
        message: 'Image deleted from Cloudinary successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Server error during image deletion',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

export default router;
