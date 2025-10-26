import { Request, Response, NextFunction } from 'express';
import TenantFactory from '../factory/tenant.factory';
import logger from '../utils/logger.utils';

declare global {
  namespace Express {
    export interface Request {
      service?: any;
    }
  }
}

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const tenant = req.headers['x-tenant'] as string;

  if (!tenant) {
    return res.status(400).json({ message: 'x-tenant header is missing.' });
  }

  try {
    req.service = TenantFactory.getFactoryInstance(tenant);
    next();
  } catch (error: any) {
    logger.error(`Failed to get factory instance for tenant: ${tenant}`, { error });
    return res.status(400).json({ message: error.message });
  }
};