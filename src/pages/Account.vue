<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <header class="bg-blue-800 p-4 shadow-md text-center">
      <h1 class="text-3xl font-bold">Tài Khoản Của Tôi</h1>
    </header>
    <div class="container mx-auto p-6">
      <div v-if="loading" class="flex justify-center items-center min-h-[400px] text-gray-400">
        <svg class="animate-spin h-8 w-8 mr-3 text-blue-400" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75" />
        </svg>
        <p>Đang tải thông tin tài khoản...</p>
      </div>
      <div v-else-if="!user" class="text-center text-gray-400 min-h-[400px] flex items-center justify-center flex-col">
        <p class="text-xl mb-4">Vui lòng đăng nhập để xem thông tin tài khoản.</p>
        <router-link to="/auth" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Đăng Nhập Ngay
        </router-link>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Thông tin cá nhân -->
        <div class="md:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
          <h2 class="text-2xl font-semibold mb-4 text-blue-400">Thông Tin Cá Nhân</h2>
          <p class="mb-3 text-lg">Tên: <span class="font-medium text-gray-200">{{ user.displayName || 'Chưa cập nhật' }}</span></p>
          <p class="mb-3 text-lg">Email: <span class="font-medium text-gray-200">{{ user.email || 'N/A' }}</span></p>
          <p class="mb-3 text-lg">ID Người dùng: <span class="font-medium text-gray-200 break-all">{{ userId || 'N/A' }}</span></p>
          <button @click="editProfile" class="mt-4 bg-blue-700 hover:bg-blue-800 py-2 px-4 rounded-lg text-white transition-all transform hover:scale-105">
            Chỉnh Sửa Thông Tin
          </button>
        </div>

        <!-- Phim yêu thích -->
        <div class="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
          <h2 class="text-2xl font-semibold mb-4 text-pink-400">Phim Yêu Thích</h2>
          <div v-if="loadingFavorites" class="text-center text-gray-400 py-8">
            <svg class="animate-spin h-6 w-6 mx-auto mb-2 text-pink-400" viewBox="0 0 24 24"></svg>
            Đang tải phim yêu thích...
          </div>
          <div v-else-if="favorites.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div v-for="movie in favorites" :key="movie.id" class="relative bg-gray-700 rounded-lg overflow-hidden shadow-md group">
              <router-link :to="`/film/${movie.slug}`">
                <img :src="movie.poster_path || 'https://placehold.co/200x300/ccc/fff?text=No+Image'" :alt="movie.title" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="p-3">
                  <p class="font-medium text-sm text-gray-100 group-hover:text-pink-300 truncate">{{ movie.title }}</p>
                </div>
              </router-link>
              <button @click="removeFavorite(movie.id)" class="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white rounded-full p-1.5 transition-all opacity-0 group-hover:opacity-100 transform group-hover:scale-110" aria-label="Xóa phim yêu thích">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>
          <p v-else class="text-center text-gray-400 py-8">Chưa có phim yêu thích nào.</p>
        </div>

        <!-- Lịch Sử Xem Phim -->
        <div class="md:col-span-3 bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
          <h2 class="text-2xl font-semibold mb-4 text-green-400">Lịch Sử Xem Phim</h2>
          <div v-if="loadingHistory" class="text-center text-gray-400 py-8">
            <svg class="animate-spin h-6 w-6 mx-auto mb-2 text-green-400" viewBox="0 0 24 24"></svg>
            Đang tải lịch sử xem phim...
          </div>
          <div v-else-if="watchHistory.length" class="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-custom">
            <div v-for="history in watchHistory" :key="history.id" class="p-4 bg-gray-700 rounded-lg flex items-center gap-4">
              <img :src="history.poster_path || 'https://placehold.co/100x150/ccc/fff?text=No+Image'" :alt="history.movie_title" class="w-16 h-24 object-cover rounded" />
              <div class="flex-1">
                <p class="font-medium text-lg text-gray-100">{{ history.movie_title }} <span v-if="history.episode_number && history.episode_number !== 'full'">- Tập {{ history.episode_number }}</span></p>
                <p class="text-gray-400 text-sm">Xem lần cuối: {{ new Date(history.last_watched_at).toLocaleString('vi-VN') }}</p>
                <div v-if="history.progress_seconds !== null && history.total_duration_seconds !== null && history.total_duration_seconds > 0" class="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                  <div class="bg-green-500 h-2.5 rounded-full" :style="{ width: `${(history.progress_seconds / history.total_duration_seconds * 100).toFixed(0)}%` }"></div>
                  <p class="text-right text-xs text-gray-300 mt-1">{{ (history.progress_seconds / history.total_duration_seconds * 100).toFixed(0) }}%</p>
                </div>
                <button @click="continueWatching(history)" class="mt-3 bg-blue-700 hover:bg-blue-800 py-1.5 px-4 rounded-lg text-white text-sm transition-all transform hover:scale-105">
                  Tiếp Tục Xem
                </button>
              </div>
            </div>
          </div>
          <p v-else class="text-center text-gray-400 py-8">Chưa có lịch sử xem phim nào.</p>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="editProfileDialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div class="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md relative text-white">
        <button @click="editProfileDialogOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl" aria-label="Đóng">×</button>
        <h2 class="text-2xl font-bold mb-6 text-center text-blue-400">Chỉnh Sửa Thông Tin Cá Nhân</h2>
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div>
            <label for="editDisplayName" class="block text-sm font-medium text-gray-300">Tên hiển thị</label>
            <input type="text" id="editDisplayName" v-model="profileForm.displayName" class="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2">
          </div>
          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Lưu Thay Đổi</button>
        </form>
        <p v-if="profileMessage" :class="['mt-4 text-center', profileMessageType === 'success' ? 'text-green-400' : 'text-red-400']">{{ profileMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth'; // Import updateProfile
import { supabase } from '../supabaseClient'; // Import Supabase client

const router = useRouter();
const auth = getAuth(); // Firebase Auth instance

// State for user data and loading
const user = ref(null);
const userId = ref(null); // To store Firebase UID
const loading = ref(true);
const favorites = ref([]);
const watchHistory = ref([]);
const loadingFavorites = ref(true);
const loadingHistory = ref(true);

// State for Edit Profile Modal
const editProfileDialogOpen = ref(false);
const profileForm = reactive({
  displayName: '',
});
const profileMessage = ref('');
const profileMessageType = ref('');

// --- Firebase Auth Listener ---
onMounted(() => {
  // Listen for Firebase Auth state changes
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    if (currentUser) {
      userId.value = currentUser.uid;
      console.log('Account.vue: User authenticated:', currentUser.uid);
      // Fetch user data from Supabase only after user is authenticated
      fetchFavorites();
      fetchWatchHistory();
    } else {
      userId.value = null;
      favorites.value = [];
      watchHistory.value = [];
      loadingFavorites.value = false;
      loadingHistory.value = false;
      console.log('Account.vue: User not authenticated.');
    }
    loading.value = false; // End initial loading state
  });
});

// --- Supabase Data Fetching ---

// Function to fetch favorite movies from Supabase
const fetchFavorites = async () => {
  if (!userId.value) {
    favorites.value = [];
    loadingFavorites.value = false;
    return;
  }
  loadingFavorites.value = true;
  console.log('Account.vue: Fetching favorites for user:', userId.value);
  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*, movies(id, slug, title, poster_path)') // Select movie details via FK relation
      .eq('user_id', userId.value);

    if (error) {
      console.error('Account.vue: Error fetching favorites:', error);
      favorites.value = [];
    } else {
      // Extract the nested movie object from the joined data
      favorites.value = data.map(fav => fav.movies).filter(movie => movie !== null);
      console.log('Account.vue: Favorites loaded:', favorites.value);
    }
  } catch (err) {
    console.error('Account.vue: Unexpected error fetching favorites:', err);
    favorites.value = [];
  } finally {
    loadingFavorites.value = false;
  }
};

// Function to fetch watch history from Supabase
const fetchWatchHistory = async () => {
  if (!userId.value) {
    watchHistory.value = [];
    loadingHistory.value = false;
    return;
  }
  loadingHistory.value = true;
  console.log('Account.vue: Fetching watch history for user:', userId.value);
  try {
    const { data, error } = await supabase
      .from('user_watch_history')
      .select('*') // Select all columns from watch history table
      .eq('user_id', userId.value)
      .order('last_watched_at', { ascending: false }); // Sort by most recent

    if (error) {
      console.error('Account.vue: Error fetching watch history:', error);
      watchHistory.value = [];
    } else {
      watchHistory.value = data || [];
      console.log('Account.vue: Watch history loaded:', watchHistory.value);
    }
  } catch (err) {
    console.error('Account.vue: Unexpected error fetching watch history:', err);
    watchHistory.value = [];
  } finally {
    loadingHistory.value = false;
  }
};

// --- Actions ---

const editProfile = () => {
  if (user.value) {
    profileForm.displayName = user.value.displayName || '';
    editProfileDialogOpen.value = true;
  }
};

const saveProfile = async () => {
  if (!user.value) {
    profileMessage.value = 'Không có người dùng để cập nhật.';
    profileMessageType.value = 'error';
    return;
  }

  profileMessage.value = '';
  profileMessageType.value = '';

  try {
    // Update display name in Firebase Auth
    await updateProfile(user.value, {
      displayName: profileForm.displayName,
    });
    
    // Refresh user object to reflect changes
    user.value.reload(); // Re-fetch user data from Firebase to update reactive `user` ref

    profileMessage.value = 'Cập nhật thông tin thành công!';
    profileMessageType.value = 'success';
    console.log('Account.vue: Profile updated in Firebase Auth.');
  } catch (err) {
    console.error('Account.vue: Lỗi khi cập nhật thông tin cá nhân:', err);
    profileMessage.value = `Lỗi: ${err.message}`;
    profileMessageType.value = 'error';
  } finally {
    setTimeout(() => { profileMessage.value = ''; }, 3000);
    // You might want to close the dialog here, or let the user see the message
    // editProfileDialogOpen.value = false;
  }
};

const removeFavorite = async (movieId) => {
  if (!userId.value) return;
  console.log('Account.vue: Attempting to remove favorite:', movieId, 'for user:', userId.value);
  try {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId.value)
      .eq('movie_id', movieId); // Ensure correct column name for movie ID

    if (error) {
      console.error('Account.vue: Error removing favorite:', error);
      alert('Lỗi khi xóa phim yêu thích: ' + error.message); // Use custom modal in real app
    } else {
      console.log('Account.vue: Favorite removed successfully.');
      // Re-fetch favorites to update UI
      fetchFavorites();
    }
  } catch (err) {
    console.error('Account.vue: Unexpected error removing favorite:', err);
    alert('Lỗi không xác định khi xóa phim yêu thích.'); // Use custom modal
  }
};

const continueWatching = (historyItem) => {
  if (!historyItem || !historyItem.movie_slug) {
    console.warn('Account.vue: Lịch sử xem không hợp lệ để tiếp tục.');
    return;
  }
  // Construct the correct watch URL
  const episode = historyItem.episode_number || 'full'; // Assuming 'full' for single movies
  router.push(`/film/${historyItem.movie_slug}/tap/${encodeURIComponent(episode)}`);
};
</script>

<style scoped>
/* Scrollbar tùy chỉnh */
.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: #4a5568 #2d3748; /* Màu thumb và track */
}

.scrollbar-custom::-webkit-scrollbar {
  width: 8px; /* Tăng chiều rộng để dễ thấy */
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #2d3748; /* Màu nền track */
  border-radius: 4px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #4a5568; /* Màu thumb */
  border-radius: 4px;
  border: 2px solid #2d3748; /* Viền thumb */
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #6b7280; /* Màu khi hover */
}

/* Các hiệu ứng animation cho loading và hover */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.3s;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.3s;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-1.md:grid-cols-3 {
    grid-template-columns: 1fr; /* Stack columns on smaller screens */
  }
  .md:col-span-1, .md:col-span-2, .md:col-span-3 {
    grid-column: span 1 / span 1;
  }
}
</style>
