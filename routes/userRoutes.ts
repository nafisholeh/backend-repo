import { Router } from 'express';
import { userController } from '../controller/api';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

/**
 * User routes
 * All routes are protected by authMiddleware
 */

// Fetch user data
router.get('/:userId', authMiddleware, userController.fetchUserData);

// Update user data
router.put('/:userId', authMiddleware, userController.updateUserData);

export default router; 