
import { createClient } from '@supabase/supabase-js';

// These environment variables are expected to be set in the execution environment.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided in environment variables.");
}

// Initialize and export the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
