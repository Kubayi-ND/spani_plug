import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  req.userId = token;
  next();
};

export default authMiddleware;
