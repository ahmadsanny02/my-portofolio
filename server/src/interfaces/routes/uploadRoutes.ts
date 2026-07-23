import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../../infrastructure/database/supabase/SupabaseClient';
import { authMiddleware } from '../middlewares/authMiddleware';
import { BadRequestError } from '../../shared/errors/AppError';

const router = Router();

const ALLOWED_BUCKETS = ['portfolio', 'certificates'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size limit
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Only image files (JPG, PNG, WebP, SVG) are allowed'));
    }
  },
});

router.post(
  '/',
  authMiddleware,
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) throw new BadRequestError('No file uploaded');

      const file = req.file;
      const requestedBucket = req.body.bucket || 'portfolio';
      const bucket = ALLOWED_BUCKETS.includes(requestedBucket) ? requestedBucket : 'portfolio';
      const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}-${sanitizedOriginalName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName);

      res.json({ success: true, url: publicUrl });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
