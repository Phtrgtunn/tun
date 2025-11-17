<template>
  <div class="community-section bg-gray-900 py-12 px-4 md:px-12">
    <div class="max-w-[1920px] mx-auto">
      <!-- Comment Form -->
      <div class="mb-8">
        <CommentForm @comment-added="loadCommunityData" />
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Top Bình Luận -->
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <h3 class="text-lg font-bold text-white">💬 TOP BÌNH LUẬN</h3>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="(user, index) in topCommenters" 
              :key="user.id"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <span class="text-yellow-400 font-bold text-sm">{{ index + 1 }}</span>
              <img :src="user.avatar" :alt="user.name" class="w-8 h-8 rounded-full border-2 border-gray-600" />
              <div class="flex-1 min-w-0">
                <p class="text-white text-sm font-medium truncate">{{ user.name }}</p>
                <div class="flex items-center gap-2 text-xs text-gray-400">
                  <span>💬 {{ user.comments }}</span>
                  <span>👍 {{ user.likes }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <button class="w-full mt-4 text-yellow-400 text-sm hover:text-yellow-300 transition-colors">
            Xem thêm →
          </button>
        </div>

        <!-- Sôi Nổi Nhất -->
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xl">🔥</span>
            <h3 class="text-lg font-bold text-white">SÔI NỔI NHẤT</h3>
          </div>
          
          <div class="space-y-3">
            <div 
              v-for="(movie, index) in trendingMovies" 
              :key="movie.id"
              @click="goToMovie(movie)"
              class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <span class="text-yellow-400 font-bold text-sm">{{ index + 1 }}</span>
              <img :src="movie.poster" :alt="movie.title" class="w-10 h-14 rounded object-cover" />
              <div class="flex-1 min-w-0">
                <p class="text-white text-sm font-medium truncate">{{ movie.title }}</p>
                <p class="text-gray-400 text-xs truncate">{{ movie.year }}</p>
              </div>
            </div>
          </div>
          
          <button class="w-full mt-4 text-yellow-400 text-sm hover:text-yellow-300 transition-colors">
            Xem thêm →
          </button>
        </div>

        <!-- Thể Loại Hot -->
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xl">🎬</span>
            <h3 class="text-lg font-bold text-white">THỂ LOẠI HOT</h3>
          </div>
          
          <div class="space-y-2">
            <div 
              v-for="genre in hotGenres" 
              :key="genre.id"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ genre.icon }}</span>
                <span class="text-white text-sm font-medium">{{ genre.name }}</span>
              </div>
              <span class="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                {{ genre.tag }}
              </span>
            </div>
          </div>
          
          <button class="w-full mt-4 text-yellow-400 text-sm hover:text-yellow-300 transition-colors">
            Xem thêm →
          </button>
        </div>

        <!-- Bình Luận Mới -->
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-xl">⚡</span>
            <h3 class="text-lg font-bold text-white">BÌNH LUẬN MỚI</h3>
          </div>
          
          <div class="space-y-4">
            <div 
              v-for="comment in recentComments" 
              :key="comment.id"
              class="p-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div class="flex items-start gap-2 mb-2">
                <img :src="comment.avatar" :alt="comment.name" class="w-8 h-8 rounded-full border-2 border-gray-600" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-white text-sm font-medium">{{ comment.name }}</p>
                    <span v-if="comment.verified" class="text-red-500">★</span>
                  </div>
                  <p class="text-gray-400 text-xs">{{ comment.time }}</p>
                </div>
              </div>
              <p class="text-gray-300 text-sm line-clamp-2">{{ comment.text }}</p>
            </div>
          </div>
          
          <button class="w-full mt-4 text-yellow-400 text-sm hover:text-yellow-300 transition-colors">
            Xem thêm →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import CommentForm from './CommentForm.vue';

const router = useRouter();
const API_URL = 'http://localhost/HTHREE_film/backend/api';

// Mock data - sẽ thay bằng data thật từ Firestore
const topCommenters = ref([
  { id: 1, name: 'lunaBlades', avatar: 'https://ui-avatars.com/api/?name=Luna&background=f59e0b&color=000', comments: 234, likes: 1567 },
  { id: 2, name: 'draxMel02', avatar: 'https://ui-avatars.com/api/?name=Drax&background=3b82f6&color=fff', comments: 189, likes: 1234 },
  { id: 3, name: 'phung ngoc', avatar: 'https://ui-avatars.com/api/?name=Phung&background=ef4444&color=fff', comments: 156, likes: 987 },
  { id: 4, name: 'chuoi', avatar: 'https://ui-avatars.com/api/?name=Chuoi&background=10b981&color=fff', comments: 142, likes: 876 },
  { id: 5, name: 'Khuong Nguyen', avatar: 'https://ui-avatars.com/api/?name=Khuong&background=8b5cf6&color=fff', comments: 128, likes: 765 }
]);

const trendingMovies = ref([
  { id: 1, title: 'Cá Đen Báo Tử', poster: 'https://img.phimapi.com/unsafe/220x330/left/top/smart/filters:quality(90)/https://img.ophim.live/uploads/movies/ca-den-bao-tu-thumb.jpg', year: 2025 },
  { id: 2, title: 'X Thần Mới', poster: 'https://img.phimapi.com/unsafe/220x330/left/top/smart/filters:quality(90)/https://img.ophim.live/uploads/movies/x-than-moi-thumb.jpg', year: 2025 },
  { id: 3, title: 'Bộ Chót Thao Tung', poster: 'https://img.phimapi.com/unsafe/220x330/left/top/smart/filters:quality(90)/https://img.ophim.live/uploads/movies/bo-chot-thao-tung-thumb.jpg', year: 2024 },
  { id: 4, title: 'Hãy Lấy Em Đi', poster: 'https://img.phimapi.com/unsafe/220x330/left/top/smart/filters:quality(90)/https://img.ophim.live/uploads/movies/hay-lay-em-di-thumb.jpg', year: 2024 },
  { id: 5, title: 'Busujeon: Chiến Thần Samurai', poster: 'https://img.phimapi.com/unsafe/220x330/left/top/smart/filters:quality(90)/https://img.ophim.live/uploads/movies/busujeon-chien-than-samurai-thumb.jpg', year: 2024 }
]);

const hotGenres = ref([
  { id: 1, name: 'Hành Động', icon: '💥', tag: 'Chiến Kịch' },
  { id: 2, name: 'Tình Cảm', icon: '💕', tag: 'Lãng Mạn' },
  { id: 3, name: 'Hài Hước', icon: '😂', tag: 'Hoài Cổ' },
  { id: 4, name: 'Kinh Dị', icon: '👻', tag: 'Hồi Hộp' },
  { id: 5, name: 'Anime', icon: '🎌', tag: 'Nhật Bản' }
]);

const recentComments = ref([
  { id: 1, name: 'Hoang Gang', avatar: 'https://ui-avatars.com/api/?name=Hoang&background=f59e0b&color=000', verified: false, time: 'vừa xong', text: 'luôn là bộ phim tuyệt vời nhất mà tôi từng xem' },
  { id: 2, name: 'Hoàng Thành Nguyễn', avatar: 'https://ui-avatars.com/api/?name=Thanh&background=3b82f6&color=fff', verified: true, time: '2 phút trước', text: 'Nội dung hay nhất từ trước đến nay' },
  { id: 3, name: 'Margaret Qualley', avatar: 'https://ui-avatars.com/api/?name=Margaret&background=ef4444&color=fff', verified: false, time: '5 phút trước', text: 'Tuyệt vời! Diễn xuất quá đỉnh' }
]);

const goToMovie = (movie) => {
  // Navigate to movie detail page
  console.log('Go to movie:', movie.title);
};

// Load real data from API
const loadCommunityData = async () => {
  try {
    const response = await axios.get(`${API_URL}/community.php`);
    
    if (response.data.success) {
      const data = response.data.data;
      
      // Update top commenters
      if (data.top_commenters?.length) {
        topCommenters.value = data.top_commenters.map(user => ({
          id: user.id,
          name: user.full_name || user.username,
          avatar: user.avatar,
          comments: user.comment_count,
          likes: user.total_likes
        }));
      }
      
      // Update recent comments
      if (data.recent_comments?.length) {
        recentComments.value = data.recent_comments.map(comment => ({
          id: comment.id,
          name: comment.full_name || comment.username,
          avatar: comment.avatar,
          verified: false,
          time: comment.time_ago,
          text: comment.content
        }));
      }
      
      console.log('✅ Community data loaded from API');
    }
  } catch (error) {
    console.log('⚠️ Using mock data:', error.message);
  }
};

onMounted(() => {
  loadCommunityData();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
