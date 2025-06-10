<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Error State -->
      <div v-if="error" class="flex justify-center items-center h-screen text-red-400">
        <p class="text-xl font-semibold">{{ error }}</p>
      </div>

      <!-- Loading State -->
      <div v-else-if="!movieData || !episodeLink" class="flex justify-center items-center h-screen">
        <div class="text-center">
          <svg
            class="animate-spin h-12 w-12 text-indigo-500 mx-auto mb-4"
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
          <p class="text-xl font-semibold text-gray-300">Đang tải phim...</p>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-8">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-center text-indigo-200 tracking-tight">
          {{ movieData.name }} - {{ movieData.type === 'single' ? 'Full' : `Tập ${tap}` }}
        </h1>

        <!-- Video Player -->
        <div class="aspect-video w-full max-w-6xl mx-auto mb-8 rounded-xl overflow-hidden shadow-2xl">
          <iframe
            :src="episodeLink"
            :title="`Xem ${movieData.name} ${movieData.type === 'single' ? 'Full' : `Tập ${tap}`}`"
            class="w-full h-full"
            frameborder="0"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>

        <!-- Episode Selection (for series) -->
        <div v-if="movieData.type !== 'single'" class="max-w-6xl mx-auto">
          <h2 class="text-2xl font-semibold text-orange-300 mb-4">Chọn tập</h2>
          <div class="flex flex-wrap gap-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-700 p-4 bg-gray-900/50 rounded-xl">
            <button
              v-for="(ep, index) in episodes"
              :key="index"
              @click="navigateToEpisode(ep.name)"
              :class="{
                'bg-indigo-600 text-white': getEpisodeNumber(ep.name) === tap,
                'bg-gray-700 hover:bg-gray-600 text-gray-200': getEpisodeNumber(ep.name) !== tap,
              }"
              class="px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
              :aria-label="`Xem tập ${ep.name}`"
            >
              {{ ep.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// Khởi tạo router và route
const route = useRoute();
const router = useRouter();

// State reactive
const movieData = ref(null);
const episodeLink = ref(null);
const episodes = ref([]);
const error = ref(null);
const filmName = ref(route.params.filmName);
const tap = ref(route.params.tap);

// Lấy số tập từ tên tập (ví dụ: "Tập 1" -> "1")
const getEpisodeNumber = (episodeName) => {
  return episodeName.startsWith('Tập ') ? episodeName.substring(4).trim() : episodeName;
};

// Điều hướng đến tập phim khác
const navigateToEpisode = (episodeName) => {
  const epNum = getEpisodeNumber(episodeName);
  // Sử dụng encodeURIComponent để đảm bảo slug và tập được mã hóa đúng trong URL
  router.push(`/film/${filmName.value}/tap/${encodeURIComponent(epNum)}`);
};

// Fetch dữ liệu phim từ API phimapi.com
const fetchMovieData = async () => {
  // Đặt lại trạng thái lỗi và dữ liệu khi bắt đầu tải
  error.value = null;
  movieData.value = null;
  episodeLink.value = null;
  episodes.value = [];

  try {
    // Gọi API để lấy chi tiết phim (bao gồm cả danh sách tập)
    const res = await axios.get(`https://phimapi.com/phim/${filmName.value}`);
    const movie = res.data.movie;
    // Lấy dữ liệu tập phim từ server đầu tiên (thường là server chính)
    const serverEpisodes = res.data.episodes?.[0]?.server_data || [];

    movieData.value = movie;
    episodes.value = serverEpisodes;

    // Logic để tìm link embed của tập phim hiện tại
    if (movie.type === 'single') {
      // Đối với phim lẻ, tìm tập có tên 'Full' hoặc tương tự
      const full = serverEpisodes.find(ep => ep.name.toLowerCase().includes('full'));
      episodeLink.value = full?.link_embed || null;
    } else {
      // Đối với phim bộ, tìm tập có số khớp với tham số 'tap' từ URL
      const ep = serverEpisodes.find(e => parseInt(getEpisodeNumber(e.name)) === parseInt(tap.value));
      episodeLink.value = ep?.link_embed || null;
    }

    // Xử lý nếu không tìm thấy link tập phim
    if (!episodeLink.value) {
      error.value = 'Không tìm thấy link tập phim hoặc tập phim không tồn tại.';
    }
  } catch (err) {
    console.error('Lỗi khi fetch dữ liệu phim để xem:', err);
    error.value = 'Không tải được dữ liệu phim hoặc tập phim. Vui lòng thử lại sau.';
    // Đảm bảo các biến về null để hiển thị trạng thái lỗi
    movieData.value = null;
    episodeLink.value = null;
    episodes.value = [];
  }
};

// Theo dõi thay đổi của các tham số route (filmName và tap)
// Khi bất kỳ tham số nào thay đổi, hàm fetchMovieData sẽ được gọi lại
watch(
  () => route.params,
  (newParams) => {
    filmName.value = newParams.filmName;
    tap.value = newParams.tap;
    fetchMovieData(); // Gọi lại hàm fetch
  },
  { immediate: true } // Đảm bảo fetch được gọi ngay khi component được mount lần đầu
);
</script>

<style scoped>
/* Scrollbar tùy chỉnh */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #374151; /* Tailwind indigo-500 và gray-700 */
}

.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #4f46e5; /* Màu tối hơn của indigo */
}

/* Responsive */
@media (max-width: 1024px) {
  .max-w-7xl, .max-w-6xl {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .text-4xl {
    font-size: 2rem;
  }
  .text-2xl {
    font-size: 1.5rem;
  }
}
</style>
