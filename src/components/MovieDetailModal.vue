<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/95 pt-10 pb-10"
        @click.self="closeModal"
      >
        <div class="relative w-full max-w-4xl bg-[#181818] rounded-lg shadow-2xl overflow-hidden">
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 z-50 w-10 h-10 bg-[#181818] hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center h-96">
            <div class="text-center">
              <svg class="animate-spin h-12 w-12 text-yellow-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-white">Đang tải thông tin phim...</p>
            </div>
          </div>

          <!-- Video Trailer Background -->
          <div v-else class="relative w-full aspect-video bg-black">
            <iframe
              v-if="movieData?.trailer_url"
              :src="getYoutubeEmbedUrl(movieData.trailer_url)"
              class="w-full h-full"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            ></iframe>
            <img
              v-else-if="movieData?.poster_url || movieData?.thumb_url"
              :src="getImageUrl(movieData?.poster_url || movieData?.thumb_url)"
              class="w-full h-full object-cover"
              alt="Movie poster"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-800">
              <p class="text-gray-400">Không có ảnh</p>
            </div>
            
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
            
            <!-- Movie Title & Actions -->
            <div class="absolute bottom-0 left-0 right-0 p-8">
              <h2 class="text-3xl font-bold text-white mb-4">{{ movieData?.name || 'Đang tải...' }}</h2>
              <div class="flex gap-3">
                <button class="px-6 py-2 bg-white text-black font-bold rounded flex items-center gap-2 hover:bg-gray-200 transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
                  </svg>
                  Phát
                </button>
                <button class="w-10 h-10 bg-[#2a2a2a] hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors border-2 border-gray-500">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
                <button class="w-10 h-10 bg-[#2a2a2a] hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors border-2 border-gray-500">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                  </svg>
                </button>
                <button class="ml-auto w-10 h-10 bg-[#2a2a2a] hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors border-2 border-gray-500">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8 bg-[#181818]">
            <!-- Movie Info -->
            <div class="mb-6">
              <div class="flex items-center gap-3 text-sm mb-4">
                <span class="text-green-400 font-semibold">{{ movieData?.year }}</span>
                <span class="text-white">{{ movieData?.episode_current || 'Full' }}</span>
                <span class="px-2 py-0.5 border border-gray-500 text-gray-300 text-xs">{{ movieData?.quality || 'HD' }}</span>
              </div>
              
              <div class="flex gap-2 mb-4">
                <span class="px-3 py-1 bg-gray-700 text-white text-xs rounded">Full</span>
                <span class="px-3 py-1 bg-gray-700 text-white text-xs rounded">HD</span>
                <span class="px-3 py-1 bg-gray-700 text-white text-xs rounded">Vietsub</span>
              </div>
              
              <p class="text-white text-sm leading-relaxed mb-4">
                {{ movieData?.content || movieData?.description }}
              </p>
            </div>

            <!-- Episodes Section -->
            <div v-if="episodes && episodes.length > 0" class="mb-8 border-t border-gray-700 pt-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-white">Tập</h3>
                <span class="text-gray-400 text-sm">{{ movieData?.name }}</span>
              </div>
              <div class="space-y-2 max-h-96 overflow-y-auto">
                <div
                  v-for="(episode, index) in episodes"
                  :key="index"
                  class="flex items-center gap-4 p-3 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded cursor-pointer transition-colors group"
                >
                  <span class="text-2xl font-bold text-gray-400 w-8">{{ index + 1 }}</span>
                  <img
                    :src="movieData?.thumb_url || movieData?.poster_url"
                    class="w-32 h-18 object-cover rounded"
                    :alt="`Episode ${index + 1}`"
                  />
                  <div class="flex-1">
                    <h4 class="text-white font-semibold mb-1">{{ episode.name || `Tập ${index + 1}` }}</h4>
                    <p class="text-gray-400 text-sm line-clamp-2">{{ movieData?.content?.substring(0, 100) || 'Nội dung đang cập nhật...' }}</p>
                  </div>
                  <span class="text-gray-400 text-sm">{{ movieData?.time || '23ph' }}</span>
                </div>
              </div>
            </div>

            <!-- Similar Content -->
            <div class="mb-8 border-t border-gray-700 pt-6">
              <h3 class="text-xl font-bold text-white mb-4">Nội dung tương tự</h3>
              <div class="grid grid-cols-3 gap-3">
                <div
                  v-for="(movie, index) in displayedSimilarMovies"
                  :key="movie._id || index"
                  class="bg-[#2a2a2a] rounded overflow-hidden hover:bg-[#3a3a3a] transition-colors cursor-pointer group"
                >
                  <div class="relative aspect-video">
                    <img
                      :src="getImageUrl(movie.thumb_url || movie.poster_url)"
                      :alt="movie.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                    <div class="absolute top-2 left-2 flex gap-1">
                      <span class="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">{{ movie.episode_current || '7 tập' }}</span>
                    </div>
                    <div class="absolute top-2 right-2 flex gap-1">
                      <span class="px-2 py-0.5 bg-black/80 text-white text-[10px] rounded">{{ movie.quality || 'HD' }}</span>
                      <span class="px-2 py-0.5 bg-black/80 text-white text-[10px] rounded">{{ movie.year || '2025' }}</span>
                    </div>
                    <button class="absolute bottom-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>
                  <div class="p-3">
                    <p class="text-gray-400 text-xs mb-1">{{ movie.year || '2025' }}</p>
                    <p class="text-white text-xs line-clamp-2 leading-relaxed">{{ movie.content?.substring(0, 80) || movie.name }}</p>
                  </div>
                </div>
              </div>

              <!-- Show More Button -->
              <button
                v-if="similarMovies.length > 6"
                @click="toggleShowMore"
                class="mt-4 w-full py-2 text-white text-sm flex items-center justify-center gap-2 hover:text-gray-300 transition-colors"
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
            <div class="border-t border-gray-700 pt-6">
              <h3 class="text-xl font-bold text-white mb-4">Giới thiệu về {{ movieData?.name }}</h3>
              <div class="space-y-2 text-sm">
                <div v-if="movieData?.actor && movieData.actor.length">
                  <span class="text-gray-400">Diễn viên: </span>
                  <span class="text-white">{{ movieData.actor.join(', ') }}</span>
                </div>
                <div v-if="movieData?.category">
                  <span class="text-gray-400">Thể loại: </span>
                  <span class="text-white">{{ getCategoryNames(movieData.category) }}</span>
                </div>
                <div v-if="movieData?.country">
                  <span class="text-gray-400">Series này: </span>
                  <span class="text-white">{{ getCountryNames(movieData.country) }}</span>
                </div>
                <div>
                  <span class="text-gray-400">Xếp hạng độ tuổi: </span>
                  <span class="px-2 py-0.5 border border-gray-500 text-white text-xs rounded">T18</span>
                  <span class="text-gray-400"> khoa thần, tự hại, bạo hành tình dục, bạo lực</span>
                </div>
                <div v-if="movieData?.director && movieData.director.length">
                  <span class="text-gray-400">Đạo diễn: </span>
                  <span class="text-white">{{ movieData.director.join(', ') }}</span>
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

const getImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://img.phimapi.com/${url}`;
};

const handleImageError = (e) => {
  console.error('Image load error:', e.target.src);
  e.target.src = 'https://placehold.co/800x450/1a1a1a/fff?text=No+Image';
};

const fetchMovieDetails = async () => {
  if (!props.movieSlug) {
    console.error('No movie slug provided');
    return;
  }
  
  console.log('🎬 Fetching movie details for:', props.movieSlug);
  
  loading.value = true;
  try {
    const response = await fetch(`https://phimapi.com/phim/${props.movieSlug}`);
    const data = await response.json();
    
    console.log('📦 API Response:', data);
    
    if (data.status === 'success' && data.movie) {
      movieData.value = data.movie;
      episodes.value = data.episodes?.[0]?.server_data || [];
      console.log('✅ Movie data loaded:', movieData.value.name);
      console.log('📺 Episodes:', episodes.value.length);
    } else {
      console.error('❌ Invalid API response:', data);
    }
    
    // Fetch similar movies
    await fetchSimilarMovies();
  } catch (error) {
    console.error('❌ Error fetching movie details:', error);
  } finally {
    loading.value = false;
  }
};

const fetchSimilarMovies = async () => {
  try {
    const response = await fetch('https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1');
    const data = await response.json();
    
    console.log('🎞️ Similar movies response:', data);
    
    if (data.status === 'success' && data.items) {
      // Get 12 random movies
      const shuffled = data.items.sort(() => 0.5 - Math.random());
      similarMovies.value = shuffled.slice(0, 12);
      console.log('✅ Similar movies loaded:', similarMovies.value.length);
    } else if (data.data?.items) {
      // Alternative API structure
      const shuffled = data.data.items.sort(() => 0.5 - Math.random());
      similarMovies.value = shuffled.slice(0, 12);
      console.log('✅ Similar movies loaded (alt):', similarMovies.value.length);
    }
  } catch (error) {
    console.error('❌ Error fetching similar movies:', error);
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
