<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm pt-10 pb-10"
        @click.self="closeModal"
      >
        <div class="relative w-full max-w-5xl bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-900/80 hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Video Trailer Background -->
          <div class="relative w-full h-[500px] bg-black">
            <iframe
              v-if="movieData?.trailer_url"
              :src="getYoutubeEmbedUrl(movieData.trailer_url)"
              class="w-full h-full"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            ></iframe>
            <img
              v-else
              :src="movieData?.poster_url || movieData?.thumb_url"
              class="w-full h-full object-cover"
              alt="Movie poster"
            />
            
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
            
            <!-- Movie Title & Actions -->
            <div class="absolute bottom-0 left-0 right-0 p-8">
              <h2 class="text-4xl font-bold text-white mb-4">{{ movieData?.name }}</h2>
              <div class="flex gap-3">
                <button class="px-8 py-3 bg-white text-black font-bold rounded flex items-center gap-2 hover:bg-gray-200 transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                  </svg>
                  Phát
                </button>
                <button class="w-12 h-12 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
                <button class="w-12 h-12 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8">
            <!-- Movie Info Grid -->
            <div class="grid grid-cols-3 gap-6 mb-8">
              <!-- Left Column - Main Info -->
              <div class="col-span-2 space-y-4">
                <div class="flex items-center gap-3 text-sm">
                  <span class="text-green-400 font-semibold">{{ movieData?.year }}</span>
                  <span class="text-white">{{ movieData?.episode_current || 'Full' }}</span>
                  <span class="px-2 py-1 bg-gray-800 text-white text-xs rounded">{{ movieData?.quality || 'HD' }}</span>
                  <span class="px-2 py-1 border border-gray-600 text-gray-400 text-xs rounded">{{ movieData?.lang || 'Vietsub' }}</span>
                </div>
                
                <p class="text-gray-300 leading-relaxed">
                  {{ movieData?.content || movieData?.description }}
                </p>
              </div>

              <!-- Right Column - Details -->
              <div class="space-y-3 text-sm">
                <div v-if="movieData?.actor && movieData.actor.length">
                  <span class="text-gray-400">Diễn viên:</span>
                  <span class="text-white ml-2">{{ movieData.actor.join(', ') }}</span>
                </div>
                <div v-if="movieData?.category">
                  <span class="text-gray-400">Thể loại:</span>
                  <span class="text-white ml-2">{{ getCategoryNames(movieData.category) }}</span>
                </div>
                <div v-if="movieData?.country">
                  <span class="text-gray-400">Quốc gia:</span>
                  <span class="text-white ml-2">{{ getCountryNames(movieData.country) }}</span>
                </div>
                <div v-if="movieData?.director && movieData.director.length">
                  <span class="text-gray-400">Đạo diễn:</span>
                  <span class="text-white ml-2">{{ movieData.director.join(', ') }}</span>
                </div>
              </div>
            </div>

            <!-- Episodes Section -->
            <div v-if="episodes && episodes.length > 0" class="mb-8">
              <h3 class="text-2xl font-bold text-white mb-4">Tập</h3>
              <div class="grid grid-cols-10 gap-2">
                <button
                  v-for="(episode, index) in episodes"
                  :key="index"
                  class="aspect-square bg-gray-800 hover:bg-yellow-400 hover:text-black text-white rounded flex items-center justify-center font-semibold transition-all duration-300 hover:scale-110"
                >
                  {{ episode.name || (index + 1) }}
                </button>
              </div>
            </div>

            <!-- Similar Content -->
            <div class="mb-8">
              <h3 class="text-2xl font-bold text-white mb-4">Nội dung tương tự</h3>
              <div class="grid grid-cols-3 gap-4">
                <div
                  v-for="(movie, index) in displayedSimilarMovies"
                  :key="movie._id || index"
                  class="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  <div class="relative aspect-video">
                    <img
                      :src="movie.thumb_url || movie.poster_url"
                      :alt="movie.name"
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute top-2 right-2 flex gap-2">
                      <span class="px-2 py-1 bg-black/80 text-white text-xs rounded">{{ movie.quality || 'HD' }}</span>
                      <span v-if="movie.episode_current" class="px-2 py-1 bg-yellow-400 text-black text-xs rounded font-semibold">
                        {{ movie.episode_current }}
                      </span>
                    </div>
                  </div>
                  <div class="p-3">
                    <h4 class="text-white font-semibold text-sm line-clamp-1 mb-1">{{ movie.name }}</h4>
                    <p class="text-gray-400 text-xs line-clamp-2">{{ movie.content || movie.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Show More Button -->
              <button
                v-if="similarMovies.length > 6"
                @click="toggleShowMore"
                class="mt-4 w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>{{ showAllSimilar ? 'Thu gọn' : 'Xem thêm' }}</span>
                <svg
                  class="w-5 h-5 transition-transform duration-300"
                  :class="{ 'rotate-180': showAllSimilar }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            <!-- About Section -->
            <div>
              <h3 class="text-2xl font-bold text-white mb-4">Giới thiệu về {{ movieData?.name }}</h3>
              <div class="space-y-3 text-sm">
                <div v-if="movieData?.actor && movieData.actor.length">
                  <span class="text-gray-400">Diễn viên:</span>
                  <span class="text-white ml-2">{{ movieData.actor.join(', ') }}</span>
                </div>
                <div v-if="movieData?.category">
                  <span class="text-gray-400">Thể loại:</span>
                  <span class="text-white ml-2">{{ getCategoryNames(movieData.category) }}</span>
                </div>
                <div v-if="movieData?.country">
                  <span class="text-gray-400">Series này:</span>
                  <span class="text-white ml-2">{{ getCountryNames(movieData.country) }}</span>
                </div>
                <div v-if="movieData?.chieurap">
                  <span class="text-gray-400">Xếp hạng độ tuổi:</span>
                  <span class="px-2 py-1 border border-gray-600 text-white text-xs rounded ml-2">{{ movieData.chieurap ? 'T18' : 'T13' }}</span>
                  <span class="text-gray-400 ml-2">{{ movieData.type === 'hoathinh' ? 'khoa thần, tự hại, bạo hành tình dục, bạo lực' : 'Phim được phổ biến đến người xem từ đủ 18 tuổi trở lên' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  movieSlug: String
});

const emit = defineEmits(['close']);

const movieData = ref(null);
const episodes = ref([]);
const similarMovies = ref([]);
const showAllSimilar = ref(false);
const loading = ref(false);

const displayedSimilarMovies = computed(() => {
  return showAllSimilar.value ? similarMovies.value : similarMovies.value.slice(0, 6);
});

const closeModal = () => {
  emit('close');
};

const toggleShowMore = () => {
  showAllSimilar.value = !showAllSimilar.value;
};

const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0` : url;
};

const getCategoryNames = (categories) => {
  if (!categories) return '';
  return categories.map(cat => cat.name).join(', ');
};

const getCountryNames = (countries) => {
  if (!countries) return '';
  return countries.map(country => country.name).join(', ');
};

const fetchMovieDetails = async () => {
  if (!props.movieSlug) return;
  
  loading.value = true;
  try {
    const response = await fetch(`https://phimapi.com/phim/${props.movieSlug}`);
    const data = await response.json();
    
    if (data.status === 'success' && data.movie) {
      movieData.value = data.movie;
      episodes.value = data.episodes?.[0]?.server_data || [];
    }
    
    // Fetch similar movies
    await fetchSimilarMovies();
  } catch (error) {
    console.error('Error fetching movie details:', error);
  } finally {
    loading.value = false;
  }
};

const fetchSimilarMovies = async () => {
  try {
    const response = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1');
    const data = await response.json();
    
    if (data.status === 'success' && data.items) {
      // Get 12 random movies
      const shuffled = data.items.sort(() => 0.5 - Math.random());
      similarMovies.value = shuffled.slice(0, 12);
    }
  } catch (error) {
    console.error('Error fetching similar movies:', error);
  }
};

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.movieSlug) {
    fetchMovieDetails();
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.9);
}
</style>
