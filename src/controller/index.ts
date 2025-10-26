import express, { Router } from 'express';
import PingRouter from './ping.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import ExamController from './exam.controller';

const router = Router();
const pingRouter = new PingRouter();


// Public route, no authentication needed
router.use('/public', pingRouter.router);

// Protected routes
router.use('/api', authMiddleware, ExamController);

export default router;