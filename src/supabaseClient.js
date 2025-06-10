// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// --- SỬ DỤNG import.meta.env để truy cập biến môi trường trong Vite ---
// Đảm bảo tên biến trong file .env của bạn có tiền tố VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Kiểm tra để đảm bảo các biến đã được tải đúng cách
if (!supabaseUrl || !supabaseKey) {
  console.error("Lỗi: Supabase URL hoặc Key (với tiền tố VITE_) không được định nghĩa trong biến môi trường.");
  // Ném lỗi để ứng dụng không chạy với cấu hình sai
  throw new Error("Missing Supabase environment variables. Please check your .env file and Vite config.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);