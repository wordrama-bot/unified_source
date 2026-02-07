import { createClient } from "@/utils/supabase/server";

export function canInitSupabaseClient() {
  try {
    createClient();
    return true;
  } catch (e) {
    return false;
  }
};
