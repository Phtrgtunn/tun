// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Lỗi: Supabase URL hoặc Key không được định nghĩa trong biến môi trường.");
  throw new Error("Missing Supabase environment variables. Please check your .env file and Vite config.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
