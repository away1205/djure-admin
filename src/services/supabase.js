import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://voojywgrhkegqwwbywaa.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvb2p5d2dyaGtlZ3F3d2J5d2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjA5NTgsImV4cCI6MjA3MjIzNjk1OH0.rr7u9Q5rLe5zWJkNlSrnLq5Ya3FnkhMyEoe6rK_6uX8';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
