import express from 'express';
import { analyzeData } from '../controllers/analysisController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/', upload.single('file'), analyzeData);

export default router;
