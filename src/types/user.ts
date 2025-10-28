export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}
