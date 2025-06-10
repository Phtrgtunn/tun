<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen relative overflow-hidden">
    <!-- Hiệu ứng nền động -->
    <div class="absolute inset-0 z-0">
      <div class="absolute w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Phần Phim Đề Cử -->
    <section class="mb-16 relative z-10">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center relative inline-block">
        <span class="bg-white/80 px-6 py-2 rounded-lg shadow-md backdrop-blur-sm">Phim Đề Cử</span>
        <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
      </h2>
      <div class="relative overflow-hidden rounded-2xl shadow-xl bg-white/90 backdrop-blur-md border border-gray-200 transform hover:scale-[1.01] transition-all duration-500">
        <!-- Container cho carousel -->
        <div
          class="flex transition-transform duration-700 ease-out-quart"
          :style="carouselStyle"
          ref="carousel"
          @wheel="handleWheel"
        >
          <template v-if="recommendedMoviesStore.getRecommended?.length > 0">
            <div
              v-for="(item, i) in recommendedMoviesStore.getRecommended"
              :key="`movie-${i}`"
              class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 flex-shrink-0 px-2 py-4 transform hover:-translate-y-3 hover:shadow-xl transition-all duration-300"
            >
              <MovieCardRecommended :movie="item" :trending="true" class="rounded-xl overflow-hidden" />
            </div>
          </template>
          <p v-else class="text-center text-gray-500 py-12 text-lg font-medium animate-pulse bg-gray-100/50 rounded-lg w-full">
            {{ error ? error : 'Đang tải hoặc không có phim đề cử...' }}
          </p>
        </div>

        <!-- Nút điều hướng carousel -->
        <button
          v-if="recommendedMoviesStore.getRecommended?.length > slidesPerView"
          @click="prevSlide"
          class="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-indigo-600/80 hover:bg-indigo-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 animate-pulse-slow"
          aria-label="Slide trước"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>
        <button
          v-if="recommendedMoviesStore.getRecommended?.length > slidesPerView"
          @click="nextSlide"
          class="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-indigo-600/80 hover:bg-indigo-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 animate-pulse-slow"
          aria-label="Slide tiếp theo"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>

    <!-- Phần Quảng Cáo -->
    <Advertiserment class="mb-16" />

    <!-- Phần Phim Mới Cập Nhật -->
    <NewMovieUpdate
      :update="updateNew"
      :series="series"
      :movie="movie"
      :recommended="recommendedMoviesStore.getRecommended"
      class="mb-16"
    >
      <template #title>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center relative inline-block">
          <span class="bg-white/80 px-6 py-2 rounded-lg shadow-md backdrop-blur-sm">Phim Mới Cập Nhật</span>
          <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></span>
        </h2>
      </template>
    </NewMovieUpdate>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import MovieCardRecommended from '@/shared/MovieCardRecommended.vue';
import Advertiserment from '@/shared/Advertiserment.vue';
import NewMovieUpdate from '@/shared/NewMovieUpdate.vue';
import { useRecommendedMoviesStore } from '../stores/RecommendedMovies/recommendedMovies';

// State quản lý danh sách phim
const updateNew = ref([]);
const series = ref([]);
const movie = ref([]);
const currentSlide = ref(0);
const error = ref(null);

// Khởi tạo Pinia store
const recommendedMoviesStore = useRecommendedMoviesStore();

// Tính số slide hiển thị dựa trên breakpoint
const slidesPerView = computed(() => {
  const width = window.innerWidth;
  if (width >= 1280) return 5; // xl:w-1/5
  if (width >= 1024) return 4; // lg:w-1/4
  if (width >= 768) return 3; // md:w-1/3
  if (width >= 640) return 2; // sm:w-1/2
  return 1; // w-full
});

// Tính toán style cho carousel
const carouselStyle = computed(() => ({
  transform: `translateX(-${(currentSlide.value * 100) / slidesPerView.value}%)`,
}));

// Hàm điều hướng carousel
const nextSlide = () => {
  if (recommendedMoviesStore.getRecommended?.length > 0) {
    const maxSlides = Math.ceil(recommendedMoviesStore.getRecommended.length / slidesPerView.value) - 1;
    if (currentSlide.value < maxSlides) {
      currentSlide.value++;
    }
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

// Xử lý lăn chuột
const handleWheel = (event) => {
  event.preventDefault();
  if (event.deltaY > 0) {
    nextSlide();
  } else {
    prevSlide();
  }
};

// Fetch dữ liệu khi component được mount
onMounted(async () => {
  try {
    // Lấy danh sách phim đề cử từ Pinia store
    if (!recommendedMoviesStore.getRecommended?.length) {
      await recommendedMoviesStore.getRecommendedMovies();
    }
    if (!recommendedMoviesStore.getRecommended?.length) {
      error.value = 'Không có phim đề cử nào!';
      toast.error(error.value);
    }

    // Fetch dữ liệu phim mới, phim bộ, phim lẻ
    const [resUpdateNew, resSeries, resMovie] = await Promise.all([
      axios.get('https://phimapi.com/v1/api/danh-sach/phim-bo?page=2&sort_field=_id&sort_type=asc&year=2025&limit=15'),
      axios.get('https://phimapi.com/v1/api/danh-sach/phim-bo?page=3&sort_field=_id&sort_type=asc&year=2025&limit=8'),
      axios.get('https://phimapi.com/v1/api/danh-sach/phim-le?page=1&sort_field=_id&sort_type=asc&year=2025&limit=8'),
    ]);

    updateNew.value = resUpdateNew.data.data?.items || [];
    series.value = resSeries.data.data?.items || [];
    movie.value = resMovie.data.data?.items || [];

    if (!updateNew.value.length && !series.value.length && !movie.value.length) {
      error.value = 'Không thể tải dữ liệu phim!';
      toast.error(error.value);
    }
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu:', err);
    error.value = 'Không thể tải dữ liệu phim. Vui lòng thử lại sau!';
    toast.error(error.value);
  }
});
</script>

<style scoped>
/* Tùy chỉnh nút điều hướng */
button {
  transition: background-color 0.3s ease, transform 0.3s ease;
}

/* Hiệu ứng nền động */
.animate-blob {
  animation: move 15s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes move {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(20%, -20%); }
  50% { transform: translate(-20%, 20%); }
  75% { transform: translate(10%, 10%); }
}

/* Hiệu ứng pulse chậm cho nút */
.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Responsive layout */
@media (max-width: 640px) {
  .container { padding-left: 1rem; padding-right: 1rem; }
}

@media (max-width: 768px) {
  .w-1 { width: 50% !important; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

/* Hiệu ứng loading */
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Đảm bảo carousel hiển thị */
.flex { display: flex; flex-wrap: nowrap; }
</style>