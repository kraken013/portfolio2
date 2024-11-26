import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rhnyfmkhrputpxwxqfrb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJobnlmbWtocnB1dHB4d3hxZnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MTgzMTMsImV4cCI6MjA0ODE5NDMxM30.Xn_rW9eD7kSTzGYGIbaW3_eT9whFn84CYAjZQNCJdjE";

export const supabase = createClient(supabaseUrl, supabaseKey);
