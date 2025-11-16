import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  generateEmail,
  saveEmail,
  getUserEmails,
  deleteEmail,
  askAI,
} from '../controllers/emailController.js';

const router = express.Router();

// All email routes are protected
router.use(protect);

router.post('/generate', generateEmail);
router.post('/save', saveEmail);
router.get('/my-emails', getUserEmails);
router.delete('/:id', deleteEmail);
router.post('/ask-ai', askAI);

export default router;
