import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pfwvspnyxkrcgvivmfcx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmd3ZzcG55eGtyY2d2aXZtZmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NTQ3MzYsImV4cCI6MjA5NzEzMDczNn0.uSDe-ToZVZr46c_090MXwkkZdbis8tO4KEnhj0zhlPs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
