import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Environment variables would be better, but for this example we'll use constants
const supabaseUrl = 'https://qdxzjbgpuvsyjxvdhwqh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkeHpqYmdwdXZzeWp4dmRod3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MjUxODIsImV4cCI6MjA2MjQwMTE4Mn0._d2aNG_Fm8fUaFWiGY6QGg4vwECiJ47ZvxujVkkQjdo';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);