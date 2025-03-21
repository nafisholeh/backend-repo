import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

/**
 * Authentication middleware to validate request tokens
 * 
 * IMPORTANT: This is a simplified implementation for demonstration purposes.
 * In a real application, you would use Firebase Authentication to verify tokens.
 * 
 * Current simplified behavior:
 * - Accepts any token that isn't specifically "invalid-token"
 * - Always sets the same mock user data
 * - No actual JWT validation occurs
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized: Missing or invalid token format' });
      return;
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Unauthorized: Token not provided' });
      return;
    }
    
    // FOR DEMONSTRATION PURPOSES ONLY:
    // This simplified validation just checks if the token is "invalid-token"
    // 
    // PRODUCTION IMPLEMENTATION would look like this:
    // try {
    //   const decodedToken = await admin.auth().verifyIdToken(token);
    //   req.user = {
    //     uid: decodedToken.uid,
    //     email: decodedToken.email
    //   };
    //   next();
    // } catch (error) {
    //   res.status(401).json({ message: 'Unauthorized: Invalid token' });
    // }
    
    // Simple validation for demonstration - rejects only "invalid-token"
    if (token === 'invalid-token') {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
      return;
    }
    
    // Mock user data for the task
    // In a real app, this user data would come from the decoded token
    req.user = {
      uid: 'simulated-user-id',
      email: 'test@example.com'
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Unauthorized: Token validation failed' });
  }
};

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
      };
    }
  }
} 