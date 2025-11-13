// supabase-config.js
const SUPABASE_URL = "https://lkwomhjfvrvitvjibdsz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd29taGpmdnJ2aXR2amliZHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzc4MTUsImV4cCI6MjA3NzY1MzgxNX0.ZQNpmFqv0rnlDif4reiQaACe-vZtFH6yjzvqmCQUJKw";

export const supabaseClient = window.supabase = window.supabaseClient = 
  window.supabaseClient || window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true }
  });