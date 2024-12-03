import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cindeyvlqtoutxffhwmj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbmRleXZscXRvdXR4ZmZod21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxODQ0NDksImV4cCI6MjA0ODc2MDQ0OX0.W4CUUJtrH1zfhQgRvcvM0wy2z26zGnE08l_zxJ1gHUQ";

export const supabase = createClient(supabaseUrl, supabaseKey);
