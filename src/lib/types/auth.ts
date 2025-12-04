/**
 * Authentication types for Ceigall AI Platform
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  employee_id: string;
  mobile_number: string;
  designation: string;
  department: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  employee_id: string;
  mobile_number: string;
  designation: string;
  department: string;
  role: string;
  account_status: string;
  is_active: boolean;
}
