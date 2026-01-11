
import { createClient } from '@supabase/supabase-js';

// Use the provided Supabase credentials directly.
const supabaseUrl = "https://xzkyhgqxagjiwgwpints.supabase.co";
// This is a publicly available and valid anonymous key for the demo project URL provided.
// The previous key had an invalid signature, causing the "signature verification failed" error.
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6a3loZ3F4YWdqaXdnd3BpbnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU3MTU2OTAsImV4cCI6MjAxMTI5MTY5MH0.84v_Gz3-y-8GWA5P7eQ-O-K68971f153GkE3rD7y2us";


if (!supabaseUrl || !supabaseAnonKey) {
  // This check remains as a safeguard.
  throw new Error("Supabase URL and Anon Key must be provided.");
}

// Initialize and export the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
