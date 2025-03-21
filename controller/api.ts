import { Request, Response } from 'express';
import { userRepository } from '../repository/userCollection';
import { UserUpdateData } from '../entities/user';

/**
 * Controller for user-related API endpoints
 */
export const userController = {
  /**
   * Fetch user data from Firestore
   * @route GET /api/user/:userId
   */
  async fetchUserData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      
      const user = await userRepository.getUserById(userId);
      
      if (!user) {
        res.status(404).json({ message: `User with ID ${userId} not found` });
        return;
      }
      
      res.status(200).json({ user });
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  
  /**
   * Update user data in Firestore
   * @route PUT /api/user/:userId
   */
  async updateUserData(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const updateData: UserUpdateData = req.body;
      
      if (!userId) {
        res.status(400).json({ message: 'User ID is required' });
        return;
      }
      
      // Validate required fields
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: 'No update data provided' });
        return;
      }
      
      // Validate data types
      if (updateData.name && typeof updateData.name !== 'string') {
        res.status(400).json({ message: 'Name must be a string' });
        return;
      }
      
      if (updateData.email && typeof updateData.email !== 'string') {
        res.status(400).json({ message: 'Email must be a string' });
        return;
      }
      
      const updatedUser = await userRepository.updateUser(userId, updateData);
      
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error('Error in updateUserData:', error);
      
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
        return;
      }
      
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}; 