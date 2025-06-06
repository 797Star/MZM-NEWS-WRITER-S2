import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("Error: Supabase URL is not defined. Make sure VITE_SUPABASE_URL is set in your .env file.");
  // You could throw an error here to halt execution if preferred
}

if (!supabaseAnonKey) {
  console.error("Error: Supabase Anon Key is not defined. Make sure VITE_SUPABASE_ANON_KEY is set in your .env file.");
  // You could throw an error here to halt execution if preferred
}

console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
