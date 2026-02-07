/**
 * lib/supabaseClient.js
 * Helper to initialize the Supabase client.
 */

import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/settings';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)