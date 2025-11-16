import express from 'express';
import { protect } from '../middleware/auth.js';
import { getOverview, getActivity } from '../controllers/analyticsController.js';

const router = express.Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/activity', getActivity);

export default router;
