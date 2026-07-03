import { createClient } from "@supabase/supabase-js";

const fallbackSupabaseUrl = "https://dytncztivagnpxgelqxm.supabase.co";
const fallbackSupabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dG5jenRpdmFnbnB4Z2VscXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDA3MTUsImV4cCI6MjA5ODM3NjcxNX0.pxs9purMF9UvpWg7yNFFs1S5mdRFmBzOrGAckox_rpw";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackSupabaseUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackSupabaseAnonKey;

export const supabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn("Supabase 환경변수 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 설정해주세요.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

export const supabaseWritesEnabled = supabaseEnabled && import.meta.env.VITE_SUPABASE_WRITE_ENABLED !== "false";
