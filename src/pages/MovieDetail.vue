<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <svg
          class="animate-spin h-12 w-12 text-yellow-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" />
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            class="opacity-75"
          />
        </svg>
        <p class="text-xl font-semibold text-gray-300">Đang tải thông tin phim...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex justify-center items-center h-screen text-red-400">
      <p class="text-xl font-semibold">{{ error }}</p>
    </div>

    <!-- No Data State -->
    <div v-else-if="!movieData" class="flex justify-center items-center h-screen text-gray-400">
      <p class="text-xl font-semibold">Không tìm thấy thông tin phim hoặc không tải được dữ liệu.</p>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Movie Poster and Info -->
        <div class="lg:w-2/3">
          <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h1 class="text-3xl font-bold text-yellow-400 mb-2">{{ movieData.title }}</h1>
            <p class="text-gray-400 text-sm mb-2">{{ movieData.original_title }} - {{ movieData.year }}</p>
            <div class="flex items-center gap-4 mb-4">
              <span class="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs">Tập {{ movieData.episode_current || 'N/A' }} {{ movieData.lang }}</span>
              <div class="flex items-center gap-1">
                <template v-for="i in 5" :key="i">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        :class="i <= Math.round(movieData.vote_average / 2) ? 'text-yellow-400' : 'text-gray-500'"
                        class="w-4 h-4 mr-0.5"
                        fill="currentColor"
                    >
                        <path
                            d="M316.9 18.6L225.4 150.3 49.9 171.6c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l129.9 68.3c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L350.6 150.3 259.1 18.6c-10.7-20.9-39.1-20.9-49.8 0z"
                        />
                    </svg>
                </template>
                <span class="text-gray-400 text-sm">({{ movieData.vote_average || 'N/A' }}/10)</span>
              </div>
            </div>
            <img
              :src="movieData.poster_path || 'https://placehold.co/400x600/ccc/fff?text=No+Image'"
              :alt="`Poster phim ${movieData.title}`"
              class="w-full h-auto rounded-lg object-cover mb-4"
              loading="lazy"
              onerror="this.onerror=null;this.src='https://placehold.co/400x600/ccc/fff?text=No+Image';"
            />
            <p class="text-gray-300 mb-4">{{ movieData.overview }}</p>
            <div class="flex flex-wrap gap-2">
              <button
                @click="handleWatch"
                class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                aria-label="Xem phim ngay"
              >
                Xem phim
              </button>
              <button
                @click="isTrailerDialogOpen = true"
                class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                aria-label="Xem trailer phim"
              >
                Trailer
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:w-1/3 space-y-6">
          <!-- Main Info -->
          <div class="bg-gray-800 p-4 rounded-lg shadow-lg text-sm">
            <h3 class="text-lg font-semibold text-yellow-400 mb-2">Thông tin phim</h3>
            <!-- Đã loại bỏ dòng Đạo diễn -->
            <!-- Đã loại bỏ dòng Diễn viên -->
            <p><strong>Thể loại:</strong> {{ movieData.genres && movieData.genres.length > 0 ? movieData.genres.join(', ') : 'N/A' }}</p>
            <p><strong>Thời lượng:</strong> {{ movieData.runtime ? `${movieData.runtime} phút` : 'N/A' }}</p>
            <p><strong>Quốc gia:</strong> {{ movieData.country && movieData.country.length > 0 ? movieData.country.join(', ') : 'N/A' }}</p> 
            <p><strong>Chất lượng:</strong> {{ movieData.quality || 'N/A' }}</p>
            <p><strong>Ngôn ngữ:</strong> {{ movieData.lang || 'N/A' }}</p>
            <p><strong>Tình trạng:</strong> {{ movieData.status || 'N/A' }}</p>
            <p v-if="movieData.chieurap"><strong>Chiếu rạp:</strong> Có</p>
          </div>

          <!-- Related Movies -->
          <div class="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold text-yellow-400 mb-2">PHIM LIÊN QUAN</h3>
            <div v-if="loadingRelated" class="text-center text-gray-400 py-4">Đang tải phim liên quan...</div>
            <div v-else-if="relatedMovies.length > 0" class="grid grid-cols-2 gap-2">
              <MovieCardRecommended
                v-for="relatedMovie in relatedMovies"
                :key="relatedMovie.id"
                :movie="relatedMovie"
                :trending="false"
              />
            </div>
            <div v-else class="text-center text-gray-400 py-4 text-sm">Không tìm thấy phim liên quan.</div>
          </div>
        </div>
      </div>

      <!-- Episode List (Only show if movie is a series) -->
      <div v-if="movieData.type === 'series' && movieData.episode_total && movieData.episode_total > 0" class="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold text-yellow-400 mb-4">DANH SÁCH TẬP PHIM</h2>
        <div class="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-700 pb-2">
          <button
            v-for="(epNum, index) in parseInt(movieData.episode_total)"
            :key="index"
            @click="navigateToEpisode(epNum)"
            :class="{ 'bg-yellow-500 text-black': epNum === parseInt(movieData.episode_current), 'bg-gray-700 hover:bg-gray-600': epNum !== parseInt(movieData.episode_current) }"
            class="px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors"
            aria-label="`Xem tập ${epNum}`"
          >
            Tập {{ epNum }}
          </button>
        </div>
      </div>
      <!-- Footer -->
      <div class="bg-gray-800 p-4 rounded-lg shadow-lg mt-6 flex justify-between items-center">
        <span class="text-sm text-gray-400">Chia sẻ: {{ movieData.view || 0 }}</span>
        <div class="flex gap-2">
          <a href="#" class="text-blue-400 hover:text-blue-300"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="text-blue-400 hover:text-blue-300"><i class="fab fa-twitter"></i></a>
          <a href="#" class="text-gray-400 hover:text-gray-300"><i class="fab fa-instagram"></i></a>
          <a href="#" class="text-green-400 hover:text-green-300"><i class="fab fa-whatsapp"></i></a>
        </div>
      </div>

      <!-- Trailer Dialog -->
      <div
        v-if="isTrailerDialogOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        role="dialog"
        aria-labelledby="trailer-title"
      >
        <div class="bg-gray-900 text-white rounded-xl shadow-2xl p-8 w-full max-w-4xl relative">
          <button
            @click="isTrailerDialogOpen = false"
            class="absolute top-4 right-4 text-white text-3xl hover:text-yellow-400 transition-colors"
            aria-label="Đóng trailer"
          >
            ×
          </button>
          <h2 id="trailer-title" class="text-2xl font-semibold mb-4">Trailer: {{ movieData.title }}</h2>
          <div v-if="embedUrl" class="aspect-video w-full">
            <iframe
              :src="embedUrl"
              :title="`Trailer - ${movieData.title}`"
              class="w-full h-full rounded-lg"
              frameborder="0"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
          <p v-else class="text-gray-400 text-center">Không có trailer.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../supabaseClient'; 
import MovieCardRecommended from '@/shared/MovieCardRecommended.vue'; 

// Khởi tạo router và route
const route = useRoute();
const router = useRouter();

// State reactive
const movieData = ref(null);
const loading = ref(true);
const error = ref(null);
const isTrailerDialogOpen = ref(false);
const filmSlug = ref(route.params.filmName); 
const relatedMovies = ref([]); 
const loadingRelated = ref(false); 

// Chuyển YouTube URL sang embed
const convertYoutubeUrlToEmbed = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

// URL embed cho trailer
const embedUrl = ref(null);

// Fetch chi tiết phim từ Supabase
const fetchMovieDetail = async () => {
  loading.value = true;
  error.value = null;
  movieData.value = null; 
  console.log('moviedetail.vue: Bắt đầu fetchMovieDetail. filmSlug:', filmSlug.value);

  try {
    if (!filmSlug.value) {
      console.warn('moviedetail.vue: filmSlug không có giá trị, không thể fetch.');
      error.value = 'URL phim không hợp lệ.';
      loading.value = false;
      return;
    }

    const { data, error: supabaseError } = await supabase
      .from('movies')
      .select('*')
      .eq('slug', filmSlug.value) 
      .single(); 

    console.log('moviedetail.vue: Supabase response data:', data);
    console.log('moviedetail.vue: Supabase response error:', supabaseError);

    if (supabaseError) {
      if (supabaseError.code === 'PGRST116') { 
        error.value = 'Không tìm thấy thông tin phim với slug này.';
        console.error('moviedetail.vue: Lỗi Supabase - Không tìm thấy phim:', filmSlug.value);
      } else {
        error.value = `Lỗi Supabase: ${supabaseError.message}`;
        console.error('moviedetail.vue: Lỗi Supabase khác:', supabaseError);
      }
    } else if (data) {
      movieData.value = data;
      embedUrl.value = convertYoutubeUrlToEmbed(movieData.value.trailer_url);
      console.log('moviedetail.vue: Đã tải thành công dữ liệu phim:', movieData.value);
      // Gọi hàm fetch phim liên quan sau khi có movieData và genres
      if (movieData.value.genres && movieData.value.genres.length > 0) {
        fetchRelatedMovies(movieData.value.genres, movieData.value.id);
      }
    } else {
      error.value = 'Không tìm thấy thông tin phim.'; 
      console.warn('moviedetail.vue: Không tìm thấy dữ liệu phim, data là null.');
    }
  } catch (err) {
    console.error('moviedetail.vue: Lỗi không xác định khi fetch chi tiết phim:', err);
    error.value = 'Không thể tải thông tin phim. Vui lòng thử lại sau.';
  } finally {
    loading.value = false;
    console.log('moviedetail.vue: Kết thúc fetchMovieDetail. Loading:', loading.value, 'Error:', error.value);
  }
};

// Fetch phim liên quan
const fetchRelatedMovies = async (genres, currentMovieId) => {
  loadingRelated.value = true;
  relatedMovies.value = [];
  try {
    const { data, error: supabaseError } = await supabase
      .from('movies')
      .select('*')
      .overlaps('genres', genres) 
      .not('id', 'eq', currentMovieId) 
      .order('vote_average', { ascending: false }) 
      .limit(4); 

    if (supabaseError) {
      console.error('Lỗi khi fetch phim liên quan:', supabaseError);
    } else {
      relatedMovies.value = data || [];
      console.log('moviedetail.vue: Phim liên quan đã tải:', relatedMovies.value);
    }
  } catch (err) {
    console.error('Lỗi không xác định khi fetch phim liên quan:', err);
  } finally {
    loadingRelated.value = false;
  }
};


// Theo dõi thay đổi của tham số 'filmName' trên route
watch(
  () => route.params.filmName, 
  (newFilmName) => {
    filmSlug.value = newFilmName; 
    console.log('moviedetail.vue: route.params.filmName đã thay đổi thành:', newFilmName);
    if (filmSlug.value) {
      fetchMovieDetail();
    }
  },
  { immediate: true } 
);

// Xử lý nút "Xem phim"
const handleWatch = () => {
  if (!movieData.value) return;
  const defaultEpisode = movieData.value.type === 'single' ? 'full' : (movieData.value.episode_current || '1');
  
  router.push(`/film/${movieData.value.slug}/tap/${encodeURIComponent(defaultEpisode)}`);
};

// Điều hướng đến tập phim cụ thể
const navigateToEpisode = (ep) => {
  router.push(`/film/${movieData.value.slug}/tap/${encodeURIComponent(ep)}`);
};
</script>

<style scoped>
/* Scrollbar tùy chỉnh */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #eab308 #374151;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #eab308;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #f59e0b;
}

/* Responsive */
@media (max-width: 1024px) {
  .max-w-md {
    max-width: 300px;
  }
  .w-64 {
    width: 200px;
  }
}

@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.75rem;
  }
  .text-2xl {
    font-size: 1.5rem;
  }
  .text-lg {
    font-size: 1.25rem;
  }
  .max-w-md {
    max-width: 250px;
  }
  .w-64 {
    width: 150px;
  }
}
</style>
