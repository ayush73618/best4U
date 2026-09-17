// Mirrors the backend User entity's public shape (AuthResponse).
export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string | null;
  roles: string[];
}