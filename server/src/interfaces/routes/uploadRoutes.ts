import { Router } from 'express';
import multer from 'multer';
import { supabase } from '../../infrastructure/database/supabase/SupabaseClient';
import { authMiddleware } from '../middlewares/authMiddleware';
import { BadRequestError } from '../../shared/errors/AppError';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  authMiddleware,
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) throw new BadRequestError('No file uploaded');

      const file = req.file;
      const bucket = req.body.bucket || 'portfolio';
      const fileName = `${Date.now()}-${file.originalname}`;

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
