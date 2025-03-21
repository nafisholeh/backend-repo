/**
 * User entity interface
 * Defines the structure of user data stored in Firestore
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
} 