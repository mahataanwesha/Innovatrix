import express from 'express';
import { verifyRecruiter, getVerifiedRecruiters } from '../controllers/verificationController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.post('/verify-recruiter', protect, admin, verifyRecruiter);
router.get('/verified-recruiters', getVerifiedRecruiters);

export default router;
