import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any; 
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    //Extraer el token (quitando la palabra "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        const secretKey = process.env.JWT_SECRET || 'fallback_development_secret_key';
        const decoded = jwt.verify(token, secretKey);

        req.user = decoded;

        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
        return;
    }
};