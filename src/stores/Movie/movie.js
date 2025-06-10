import { defineStore } from 'pinia';
import { supabase } from '../../supabaseClient'; // Đảm bảo đường dẫn này đúng với vị trí của file supabaseClient.js của bạn

export const useMovieStore = defineStore('movie', {
  state: () => ({
    movies: [], // Mảng chứa kết quả phim tìm được
    loading: false, // Trạng thái loading
    error: null,    // Thông báo lỗi
  }),
  actions: {
    /**
     * Thực hiện tìm kiếm phim trong Supabase dựa trên từ khóa.
     * Tìm kiếm trong cả 'title' và 'original_title' (không phân biệt chữ hoa/thường).
     * @param {string} query - Từ khóa tìm kiếm của người dùng.
     */
    async searchMovies(query) {
      // Nếu từ khóa rỗng, xóa kết quả cũ và thoát
      if (!query.trim()) {
        this.movies = [];
        this.error = null; // Xóa lỗi nếu không có từ khóa
        return;
      }

      this.loading = true; // Bắt đầu loading
      this.error = null;   // Reset lỗi

      try {
        // Truy vấn Supabase:
        // - Chọn các cột cần thiết: title, original_title, poster_path, slug
        // - Sử dụng .or() để kết hợp điều kiện tìm kiếm trong hai cột:
        //   - title.ilike.%${query}%: Tìm kiếm 'query' trong cột 'title' (không phân biệt chữ hoa/thường, với wildcard %)
        //   - original_title.ilike.%${query}%: Tìm kiếm 'query' trong cột 'original_title'
        const { data, error } = await supabase
          .from('movies')
          .select('title, original_title, poster_path, slug')
          .or(`title.ilike.%${query}%,original_title.ilike.%${query}%`);

        // Xử lý lỗi từ Supabase
        if (error) {
          throw error;
        }

        // Ánh xạ dữ liệu từ Supabase sang cấu trúc mà frontend của bạn mong đợi
        // Ví dụ: cột 'title' từ Supabase sẽ thành 'name' cho frontend
        this.movies = data.map(item => ({
          name: item.title || item.original_title || 'Unknown', // Dùng title làm tên chính, original_title làm fallback
          slug: item.slug || '',
          thumb_url: item.poster_path || 'https://placehold.co/40x40/ccc/fff?text=No+Img', // Dùng poster_path cho ảnh thumbnail
        }));

        console.log('SEARCH MOVIES (Pinia - Supabase):', {
          query,
          supabaseResponseData: data, // Dữ liệu thô từ Supabase
          mappedMovies: this.movies,  // Dữ liệu đã được ánh xạ cho frontend
        });

      } catch (err) {
        console.error('Error searching movies from Supabase:', err.message);
        this.error = err.message; // Cập nhật lỗi
        this.movies = [];         // Xóa kết quả phim khi có lỗi
      } finally {
        this.loading = false; // Luôn tắt loading khi hoàn tất (dù thành công hay lỗi)
      }
    },
  },
  getters: {
    getMovies: (state) => state.movies,     // Getter để lấy danh sách phim
    getLoading: (state) => state.loading,   // Getter để lấy trạng thái loading
    getError: (state) => state.error,       // Getter để lấy thông báo lỗi
  },
});
