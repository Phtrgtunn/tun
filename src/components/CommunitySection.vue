<template>
  <div class="community-section bg-black py-12 px-4 md:px-12">
    <div class="max-w-[1920px] mx-auto">
      <!-- Comment Form -->
      <div class="mb-10">
        <CommentForm @comment-added="loadCommunityData" />
      </div>
      
      <!-- Top Bình Luận - Horizontal Carousel -->
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center">
            <span class="text-lg">🏆</span>
          </div>
          <h3 class="text-base font-bold text-white uppercase tracking-wide">TOP BÌNH LUẬN</h3>
        </div>
        
        <div class="relative group/scroll">
          <button @click="scrollTopLeft" class="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-gray-900/90 hover:bg-yellow-400 rounded-full flex items-center justify-center transition-all opacity-0 group-hover/scroll:opacity-100">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button @click="scrollTopRight" class="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-gray-900/90 hover:bg-yellow-400 rounded-full flex items-center justify-center transition-all opacity-0 group-hover/scroll:opacity-100">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
          
          <div ref="topScrollRef" class="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2 scroll-smooth">
            <div 
              v-for="(comment, index) in topComments" 
              :key="comment.id" 
              class="flex-none w-[300px] rounded-xl p-4 border border-gray-700/30 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-lg hover:shadow-yellow-400/20 relative overflow-hidden group"
            >
              <!-- Background Poster với blur -->
              <div 
                class="absolute inset-0 bg-cover bg-center transition-all duration-300"
                :style="{ backgroundImage: `url(${comment.moviePoster})` }"
              ></div>
              
              <!-- Overlay mờ đen -->
              <div class="absolute inset-0 bg-black/70 backdrop-blur-sm group-hover:bg-black/60 transition-all duration-300"></div>
              
              <!-- Content -->
              <div class="relative z-10">
                <!-- Avatar & Poster -->
                <div class="flex gap-3 mb-3">
                  <div class="relative flex-shrink-0">
                    <img :src="comment.avatar" :alt="comment.name" class="w-14 h-14 rounded-full border-3 border-gray-700/50 group-hover:border-yellow-400 transition-all shadow-lg" />
                    <div v-if="index === 0" class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">∞</div>
                  </div>
                  <div class="flex-shrink-0">
                    <img 
                      :src="comment.moviePoster" 
                      :alt="comment.movieTitle" 
                      class="w-16 h-24 rounded-md object-cover border border-gray-700/50 group-hover:border-yellow-400/50 transition-all shadow-lg" 
                      @error="(e) => e.target.src = 'https://placehold.co/64x96/1a1a1a/fff?text=No+Image'"
                    />
                  </div>
                </div>
                
                <!-- User Info -->
                <div class="mb-2">
                  <div class="flex items-center gap-1.5">
                    <h4 class="text-white font-bold text-sm drop-shadow-lg">{{ comment.name }}</h4>
                    <span v-if="index === 0" class="text-yellow-400 text-xs">∞</span>
                  </div>
                </div>
                
                <!-- Comment Text -->
                <p class="text-gray-200 text-xs leading-relaxed mb-3 line-clamp-2 drop-shadow-md">{{ comment.text }}</p>
                
                <!-- Stats -->
                <div class="flex items-center gap-4 text-gray-300">
                  <button class="flex items-center gap-1.5 hover:text-green-400 transition-colors">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/></svg>
                    <span class="text-xs font-medium">{{ comment.likes }}</span>
                  </button>
                  <button class="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z"/></svg>
                    <span class="text-xs font-medium">{{ comment.dislikes }}</span>
                  </button>
                  <button class="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/></svg>
                    <span class="text-xs font-medium">{{ comment.replies }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid 3 Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Sôi Nổi Nhất -->
        <div class="bg-gray-900/30 rounded-lg p-4 border border-gray-800">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">🔥</span>
            <h3 class="text-sm font-bold text-white uppercase">SÔI NỔI NHẤT</h3>
          </div>
          <div class="space-y-2">
            <div v-for="(movie, i) in trendingMovies" :key="i" class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-800/50 transition cursor-pointer">
              <span class="text-yellow-400 font-bold text-xs w-5">{{ i + 1 }}</span>
              <img :src="movie.poster" class="w-8 h-11 rounded object-cover" @error="(e) => e.target.src = 'https://placehold.co/32x44/1a1a1a/fff?text=?'" />
              <div class="flex-1 min-w-0">
                <p class="text-white text-xs font-medium truncate">{{ movie.title }}</p>
                <p class="text-gray-400 text-[10px]">{{ movie.year }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Yêu Thích Nhất -->
        <div class="bg-gray-900/30 rounded-lg p-4 border border-gray-800">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">💛</span>
            <h3 class="text-sm font-bold text-white uppercase">YÊU THÍCH NHẤT</h3>
          </div>
          <div class="space-y-2">
            <div v-for="(movie, i) in favoriteMovies" :key="i" class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-800/50 transition cursor-pointer">
              <span class="text-yellow-400 font-bold text-xs w-5">{{ i + 1 }}</span>
              <img :src="movie.poster" class="w-8 h-11 rounded object-cover" @error="(e) => e.target.src = 'https://placehold.co/32x44/1a1a1a/fff?text=?'" />
              <div class="flex-1 min-w-0">
                <p class="text-white text-xs font-medium truncate">{{ movie.title }}</p>
                <p class="text-gray-400 text-[10px]">{{ movie.year }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bình Luận Mới -->
        <div class="bg-gray-900/30 rounded-lg p-4 border border-gray-800">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-base">⚡</span>
            <h3 class="text-sm font-bold text-white uppercase">BÌNH LUẬN MỚI</h3>
          </div>
          <div class="space-y-3">
            <div v-for="comment in recentComments.slice(0, 3)" :key="comment.id" class="p-2 rounded-lg hover:bg-gray-800/50 transition cursor-pointer">
              <div class="flex items-start gap-2 mb-1.5">
                <img :src="comment.avatar" class="w-7 h-7 rounded-full" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5">
                    <p class="text-white text-xs font-medium">{{ comment.name }}</p>
                  </div>
                  <p class="text-gray-400 text-[10px]">{{ comment.time }}</p>
                </div>
              </div>
              <p class="text-gray-300 text-[11px] line-clamp-2 leading-relaxed">{{ comment.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import CommentForm from './CommentForm.vue';

const API_URL = 'http://localhost/HTHREE_film/backend/api';
const topScrollRef = ref(null);

const topComments = ref([]);

const trendingMovies = ref([]);
const favoriteMovies = ref([]);

const recentComments = ref([
  { id: 1, name: 'Hoang Gang', avatar: 'https://ui-avatars.com/api/?name=Hoang&background=f59e0b&color=000', time: 'vừa xong', text: 'luôn là bộ phim tuyệt vời nhất mà tôi từng xem' },
  { id: 2, name: 'Margaret Qualley', avatar: 'https://ui-avatars.com/api/?name=Margaret&background=ef4444&color=fff', time: '2 phút trước', text: 'Tuyệt vời! Diễn xuất quá đỉnh' },
  { id: 3, name: 'Tsukii', avatar: 'https://ui-avatars.com/api/?name=Tsukii&background=3b82f6&color=fff', time: '5 phút trước', text: 'Cảm ơn đã chia sẻ!' }
]);

const scrollTopLeft = () => topScrollRef.value?.scrollBy({ left: -280, behavior: 'smooth' });
const scrollTopRight = () => topScrollRef.value?.scrollBy({ left: 280, behavior: 'smooth' });

const fetchMoviesFromAPI = async () => {
  try {
    // Fetch phim mới từ API
    const response = await axios.get('https://phimapi.com/danh-sach/phim-moi-cap-nhat', {
      params: { page: 1 }
    });
    
    console.log('🎬 API Response:', response.data);
    
    if (response.data?.items?.length) {
      const movies = response.data.items.slice(0, 10);
      
      // Update Top Comments với 4 phim đầu
      const sampleComments = [
        { name: 'N VL', avatar: 'https://ui-avatars.com/api/?name=NVL&background=f59e0b&color=000', text: 'Tập một bức mình nam chính thật sự, trả lời câu hỏi mà cứ ngơ ngơ...', likes: 1, dislikes: 0, replies: 4 },
        { name: 'Khuong Nguyen', avatar: 'https://ui-avatars.com/api/?name=Khuong&background=3b82f6&color=fff', text: 'Cái bé này thật sự là hay quá, mình đã xem 3 lần rồi mà vẫn thấy hay!', likes: 5, dislikes: 0, replies: 2 },
        { name: 'Doss Nguyen', avatar: 'https://ui-avatars.com/api/?name=Doss&background=ef4444&color=fff', text: 'Phim hay lắm, diễn xuất tuyệt vời, cảnh quay đẹp mắt!', likes: 8, dislikes: 1, replies: 6 },
        { name: 'toni_nguyen', avatar: 'https://ui-avatars.com/api/?name=Toni&background=10b981&color=fff', text: 'Anime đỉnh cao! Miku chan kawaii quá đi mất!', likes: 12, dislikes: 0, replies: 8 }
      ];
      
      topComments.value = movies.slice(0, 4).map((movie, index) => {
        const posterUrl = movie.poster_url || movie.thumb_url || '';
        const fullPosterUrl = posterUrl.startsWith('http') ? posterUrl : `https://img.phimapi.com/${posterUrl}`;
        
        return {
          id: index + 1,
          ...sampleComments[index],
          movieTitle: movie.name,
          moviePoster: fullPosterUrl
        };
      });
      
      // Lấy 3 phim tiếp cho Trending
      trendingMovies.value = movies.slice(4, 7).map(movie => {
        const posterUrl = movie.poster_url || movie.thumb_url || '';
        return {
          title: movie.name,
          year: movie.year || 2024,
          poster: posterUrl.startsWith('http') ? posterUrl : `https://img.phimapi.com/${posterUrl}`
        };
      });
      
      // Lấy 3 phim tiếp cho Favorites
      favoriteMovies.value = movies.slice(7, 10).map(movie => {
        const posterUrl = movie.poster_url || movie.thumb_url || '';
        return {
          title: movie.name,
          year: movie.year || 2024,
          poster: posterUrl.startsWith('http') ? posterUrl : `https://img.phimapi.com/${posterUrl}`
        };
      });
      
      console.log('✅ Top Comments:', topComments.value);
      console.log('✅ Trending:', trendingMovies.value);
      console.log('✅ Favorites:', favoriteMovies.value);
    }
  } catch (error) {
    console.log('⚠️ Could not load movies:', error.message);
  }
};

const loadCommunityData = async () => {
  try {
    const response = await axios.get(`${API_URL}/community.php`);
    console.log('📊 Community data:', response.data);
    
    if (response.data.success) {
      const data = response.data.data;
      
      // Update recent comments
      if (data.recent_comments?.length) {
        recentComments.value = data.recent_comments.map(c => ({
          id: c.id,
          name: c.full_name || c.username,
          avatar: c.avatar,
          time: c.time_ago,
          text: c.content
        }));
        console.log('✅ Updated recent comments:', recentComments.value.length);
      }
    }
  } catch (error) {
    console.log('⚠️ Could not load community data:', error.message);
  }
};

onMounted(() => {
  loadCommunityData();
  fetchMoviesFromAPI();
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
