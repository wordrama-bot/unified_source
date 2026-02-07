import { Request } from 'express';
import { User } from '@supabase/supabase-js';

interface ApiRequest extends Request {
  userId?: string;
  role?: string;
  roleId?: string;
}
