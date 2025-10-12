import express from 'express';
import {
  generatePost,
  optimizePost,
  savePost,
  getUserPosts,
  getPost,
  deletePost,
  askAI
} from '../controllers/socialPostController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Generate and optimize routes
router.post('/generate', generatePost);
router.post('/optimize', optimizePost);

// CRUD routes
router.post('/save', savePost);
router.get('/my-posts', getUserPosts);
router.get('/:id', getPost);
router.delete('/:id', deletePost);

// AI assistant
router.post('/ask-ai', askAI);

export default router;

