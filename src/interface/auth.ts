// ================================
// AUTHENTICATION & IDENTITY
// ================================

export interface AuthUser {
  id: string; // UUID
  email: string;
  username: string;
  password_hash: string;
  email_verified: boolean;
  two_factor_enabled: boolean;
  last_login_at?: Date;
  login_attempts: number;
  locked_until?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AuthSession {
  id: string;
  user_id: string; // Foreign key to AuthUser
  session_token: string;
  refresh_token: string;
  ip_address: string;
  user_agent: string;
  expires_at: Date;
  created_at: Date;
}

export interface PasswordReset {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}