import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseEnabled =
  Boolean(supabaseUrl && supabaseAnonKey) && import.meta.env.VITE_SUPABASE_ENABLED !== "false";

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn("Supabase 환경변수 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 설정해주세요.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

export const supabaseWritesEnabled = supabaseEnabled && import.meta.env.VITE_SUPABASE_WRITE_ENABLED === "true";
