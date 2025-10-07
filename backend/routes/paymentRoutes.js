import express from 'express';
import { 
  getUserCredits, 
  createCheckoutSession, 
  handleWebhook,
  useCredits 
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/credits', protect, getUserCredits);
router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/use-credits', protect, useCredits);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
