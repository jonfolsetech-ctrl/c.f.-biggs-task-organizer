import { Request, Response, NextFunction } from 'express';

export function requireRole(roles: Array<'MANAGER' | 'ADMIN'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as any)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    return next();
  };
}
