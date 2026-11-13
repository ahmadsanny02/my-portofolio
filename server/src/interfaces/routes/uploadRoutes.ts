import { Router } from 'express';
import multer from 'multer';
import { ALLOWED_IMAGE_MIME_TYPES, MAX_UPLOAD_BYTES } from 'types';
import { supabase } from '../../infrastructure/database/supabase/SupabaseClient';
import { authMiddleware } from '../middlewares/authMiddleware';
import { BadRequestError } from '../../shared/errors/AppError';
import { mapDbError } from '../../shared/errors/mapDbError';
import { detectImageType } from '../../shared/utils/detectImageType';

const router = Router();

const ALLOWED_BUCKETS = ['portfolio', 'certificates'];
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if ((ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new BadRequestError('Only image files (JPG, PNG, WebP) are allowed'));
    }
  },
});

router.post('/', authMiddleware, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) throw new BadRequestError('No file uploaded');

    const file = req.file;
    // Verify the actual content, not just the client-declared MIME type
    const detectedType = detectImageType(file.buffer);
    if (!detectedType) {
      throw new BadRequestError('File content is not a valid JPG, PNG or WebP image');
    }

    const requestedBucket = req.body.bucket || 'portfolio';
    const bucket = ALLOWED_BUCKETS.includes(requestedBucket) ? requestedBucket : 'portfolio';
    const baseName = file.originalname
      .replace(/\.[^.]*$/, '')
      .replace(/[^a-zA-Z0-9-]/g, '_')
      .slice(0, 80);
    const fileName = `${Date.now()}-${baseName}.${EXTENSIONS[detectedType]}`;

    const { error } = await supabase.storage.from(bucket).upload(fileName, file.buffer, {
      contentType: detectedType,
      upsert: false,
    });

    if (error) throw mapDbError({ message: error.message });

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    res.json({ success: true, url: publicUrl });
  } catch (error) {
    next(error);
  }
});

export default router;
