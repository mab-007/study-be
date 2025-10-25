import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';
import { User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase.config';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            logger.warn(`Authentication failed: ${error?.message}`, { token });
            return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error?.message });
        }

        req.user = user as User; // Attach user to the request object
        next();
    } catch (error) {
        logger.error('Internal Server Error during authentication', { error });
        return res.status(500).json({ message: 'Internal Server Error during authentication' });
    }
};
