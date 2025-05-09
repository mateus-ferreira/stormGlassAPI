import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/auth';

export function authMiddleware(
    req: Partial<Request>,
    res: Partial<Response>,
    next: NextFunction
): void {
    const token = req.headers?.['x-access-token'];
    try {
        req.decoded = AuthService.decodeToken(token as string);
    } catch (err: any) {
        res.status?.(401).send({
            code: 401,
            error: err.message,
        });
    }
    next();
}
