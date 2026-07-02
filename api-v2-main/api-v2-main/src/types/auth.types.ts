import { Request } from 'express';

export interface UserToken {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  email: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    role?: string;
    avatar_url: string;
    custom_claims: {
      global_name: string;
    };
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    picture: string;
    provider_id: string;
    sub: string;
  };
  role: string;
  aal: string;
  amr: {
    method: string;
    timestamp: number;
  }[];
  session_id: string;
}

export interface ApiRequest extends Request {
  userId?: string;
  userEmail?: string;
  role?: string;
  roleId?: string;
  adminRole?: string;
  adminRoleId?: string;
}
