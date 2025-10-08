import express from 'express';
import {
  generateOutline,
  generateFullBlog,
  saveBlog,
  getUserBlogs,
  getBlog,
  deleteBlog,
  askAI
} from '../controllers/blogController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-outline', protect, generateOutline);
router.post('/generate-full', protect, generateFullBlog);
router.post('/save', protect, saveBlog);
router.get('/my-blogs', protect, getUserBlogs);
router.get('/:id', protect, getBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/ask-ai', protect, askAI);

export default router;

