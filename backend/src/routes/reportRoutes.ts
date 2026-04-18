import express from 'express';
import { reportScam, getScamDatabase, getScamStats, getReport } from '../controllers/reportController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/report-scam', protect, reportScam);
router.get('/scam-database', getScamDatabase);
router.get('/scam-stats', getScamStats);
router.get('/:id', protect, getReport);

export default router;
