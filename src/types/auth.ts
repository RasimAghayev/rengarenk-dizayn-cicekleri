
export type UserRole = 'admin' | 'staff' | 'client' | 'company';

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
