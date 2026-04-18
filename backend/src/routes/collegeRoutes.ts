import express from 'express';
import {
  loginCollege,
  getDashboardStats,
  getVerifiedRecruiters,
  verifyRecruiter,
  removeRecruiter,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getScamReports,
  flagHighRisk,
  getHeatmapData
} from '../controllers/collegeController';

const router = express.Router();

router.post('/login', loginCollege);
router.get('/dashboard', getDashboardStats);

router.get('/verified-recruiters', getVerifiedRecruiters);
router.post('/verify-recruiter', verifyRecruiter);
router.delete('/remove-recruiter/:id', removeRecruiter);

router.get('/pending-requests', getPendingRequests);
router.post('/approve/:id', approveRequest);
router.post('/reject/:id', rejectRequest);

router.get('/scam-reports', getScamReports);
router.post('/flag-high-risk/:id', flagHighRisk);

router.get('/heatmap', getHeatmapData);

export default router;
