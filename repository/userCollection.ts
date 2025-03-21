import { db, timestampToDate, dateToTimestamp } from '../config/firebaseConfig';
import { User, UserUpdateData } from '../entities/user';

const USERS_COLLECTION = 'USERS';

/**
 * User repository for handling Firestore operations on the USERS collection
 */
export const userRepository = {
  /**
   * Fetch a user by ID
   * @param userId - The user's unique identifier
   * @returns The user data or null if not found
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await db.collection(USERS_COLLECTION).doc(userId).get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      const userData = userDoc.data();
      return {
        id: userDoc.id,
        name: userData?.name,
        email: userData?.email,
        createdAt: userData?.createdAt ? timestampToDate(userData.createdAt) : new Date(),
        updatedAt: userData?.updatedAt ? timestampToDate(userData.updatedAt) : new Date(),
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  
  /**
   * Update a user's data
   * @param userId - The user's unique identifier
   * @param updateData - The data to update
   * @returns The updated user data
   */
  async updateUser(userId: string, updateData: UserUpdateData): Promise<User> {
    try {
      const userRef = db.collection(USERS_COLLECTION).doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        throw new Error(`User with ID ${userId} not found`);
      }
      
      const updatedData = {
        ...updateData,
        updatedAt: dateToTimestamp(new Date())
      };
      
      await userRef.update(updatedData);
      
      // Get the updated user
      const updatedUserDoc = await userRef.get();
      const userData = updatedUserDoc.data();
      
      return {
        id: updatedUserDoc.id,
        name: userData?.name,
        email: userData?.email,
        createdAt: userData?.createdAt ? timestampToDate(userData.createdAt) : new Date(),
        updatedAt: userData?.updatedAt ? timestampToDate(userData.updatedAt) : new Date(),
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}; 