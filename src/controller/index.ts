import express, { Router } from 'express';
import PingRouter from './ping.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const pingRouter = new PingRouter();


// Public route, no authentication needed
router.use('/api', pingRouter.router);


export default router;