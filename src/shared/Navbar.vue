<template>
  <nav class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-opacity-80 shadow-lg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo -->
        <router-link to="/" class="text-2xl font-bold tracking-tight hover:text-orange-400 transition-all duration-300 ease-out flex items-center gap-2">
          <!-- Logo mới cho HTHREE -->
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-monitor-play">
            <path d="m10 7 5 3-5 3Z"/>
            <rect width="20" height="14" x="2" y="4" rx="2"/>
          </svg>
          HTHREE
        </router-link>

        <!-- Menu chính (Desktop) -->
        <ul class="hidden lg:flex items-center gap-6 text-sm font-medium">
          <li>
            <router-link to="/" class="relative px-3 py-2 hover:text-orange-400 transition-all duration-300 ease-out group">
              Trang chủ
              <span class="absolute bottom-0 left-0 w-full h-0.5 bg-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </router-link>
          </li>
          <li class="relative" ref="categoryDropdownRef">
            <button @click="toggleDropdown('categoryDesktop')" class="desktop-dropdown-button px-3 py-2 hover:text-orange-400 transition-all duration-300 ease-out flex items-center gap-1" aria-haspopup="true" :aria-expanded="isCategoryDropdownOpenDesktop">
              Thể loại
              <svg class="w-4 h-4 transform transition-transform duration-300" :class="{ 'rotate-180': isCategoryDropdownOpenDesktop }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="isCategoryDropdownOpenDesktop"
                 class="desktop-dropdown-content absolute z-50 mt-2 w-64 bg-gray-900/95 backdrop-blur-lg text-white rounded-xl shadow-xl transition-all duration-300 max-h-96 overflow-y-auto scrollbar-thin"
                 :class="{ 'opacity-100 translate-y-0': isCategoryDropdownOpenDesktop, 'opacity-0 -translate-y-2 pointer-events-none': !isCategoryDropdownOpenDesktop }">
              <router-link
                v-for="item in categoryStore.getAllCategories"
                :key="item.slug"
                :to="`/category/${item.slug}/page/1`"
                class="block px-4 py-3 hover:bg-orange-500/10 hover:text-orange-400 rounded-lg transition-all duration-200"
                @click="closeAllDropdowns"
              >
                {{ item.name }}
              </router-link>
            </div>
          </li>
          <li class="relative" ref="countryDropdownRef">
            <button @click="toggleDropdown('countryDesktop')" class="desktop-dropdown-button px-3 py-2 hover:text-orange-400 transition-all duration-300 ease-out flex items-center gap-1" aria-haspopup="true" :aria-expanded="isCountryDropdownOpenDesktop">
              Quốc gia
              <svg class="w-4 h-4 transform transition-transform duration-300" :class="{ 'rotate-180': isCountryDropdownOpenDesktop }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="isCountryDropdownOpenDesktop"
                 class="desktop-dropdown-content absolute z-50 mt-2 w-64 bg-gray-900/95 backdrop-blur-lg text-white rounded-xl shadow-xl transition-all duration-300 max-h-96 overflow-y-auto scrollbar-thin"
                 :class="{ 'opacity-100 translate-y-0': isCountryDropdownOpenDesktop, 'opacity-0 -translate-y-2 pointer-events-none': !isCountryDropdownOpenDesktop }">
              <router-link
                v-for="item in countryStore.getAllCountries"
                :key="item.slug"
                :to="`/country/${item.slug}/page/1`"
                class="block px-4 py-3 hover:bg-orange-500/10 hover:text-orange-400 rounded-lg transition-all duration-200"
                @click="closeAllDropdowns"
              >
                {{ item.name }}
              </router-link>
            </div>
          </li>
          <li>
            <router-link to="/contact" class="relative px-3 py-2 hover:text-orange-400 transition-all duration-300 ease-out group">
              Liên hệ
              <span class="absolute bottom-0 left-0 w-full h-0.5 bg-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
            </router-link>
          </li>
        </ul>

        <!-- Tìm kiếm và Tài khoản -->
        <div class="flex items-center gap-4">
          <!-- Tìm kiếm -->
          <div class="relative w-full sm:w-80" ref="searchContainerRef">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                @input="debouncedSearch"
                @keyup.enter="handleSearchEnter"
                placeholder="Tìm kiếm phim..."
                class="search-input w-full pl-10 pr-12 py-2.5 bg-gray-900/30 backdrop-blur-lg text-white placeholder-gray-400 border border-gray-700/50 rounded-full focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all duration-300 shadow-sm"
                aria-label="Tìm kiếm phim"
              />
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors duration-200"
                aria-label="Xóa tìm kiếm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div
              v-if="movieStore.getMovies.length > 0 && searchQuery"
              class="search-dropdown absolute z-50 mt-2 w-full max-h-96 overflow-y-auto bg-gray-900/95 backdrop-blur-lg text-white rounded-xl shadow-xl scrollbar-thin"
            >
              <router-link
                v-for="movie in movieStore.getMovies"
                :key="movie.slug"
                :to="`/film/${movie.slug}`"
                class="block px-4 py-3 hover:bg-orange-500/10 rounded-lg transition-all duration-200 flex items-center gap-3"
                @click="clearSearch"
              >
                <img
                  v-if="movie.thumb_url"
                  :src="movie.thumb_url"
                  alt="Poster phim"
                  class="w-10 h-14 object-cover rounded-md"
                />
                <img v-else src="https://placehold.co/40x40/ccc/fff?text=No+Img" alt="Placeholder" class="w-10 h-14 object-cover rounded-md"/>
                <div>
                  <p class="font-medium">{{ movie.name }}</p>
                  <p class="text-xs text-gray-400">
                    {{ movie.year || 'N/A' }}
                    <template v-if="movie.genres && movie.genres.length > 0">
                      • {{ movie.genres.join(', ') }}
                    </template>
                  </p>
                </div>
              </router-link>
            </div>
            <div
              v-else-if="searchQuery && !movieStore.getMovies.length && !movieStore.getLoading"
              class="search-dropdown absolute z-50 mt-2 w-full bg-gray-900/95 backdrop-blur-lg text-white rounded-xl shadow-xl px-4 py-3"
            >
              Không tìm thấy phim
            </div>
            <div
              v-else-if="movieStore.getLoading && searchQuery"
              class="search-dropdown absolute z-50 mt-2 w-full bg-gray-900/95 backdrop-blur-lg text-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-2"
            >
              <svg class="animate-spin h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75" />
              </svg>
              Đang tìm kiếm...
            </div>
          </div>

          <!-- User Dropdown -->
          <div class="relative" ref="userDropdownRef">
            <button @click="toggleDropdown('userDesktop')" class="desktop-dropdown-button flex items-center gap-2 px-3 py-2 hover:bg-orange-500/10 rounded-full transition-all duration-300" aria-haspopup="true" :aria-expanded="isUserDropdownOpenDesktop">
              <img
                v-if="user && user.photoURL"
                :src="user.photoURL"
                alt="Avatar người dùng"
                class="w-8 h-8 rounded-full object-cover border border-gray-700/50"
              />
              <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="text-sm font-medium">{{ user ? (user.displayName || user.email) : 'Khách' }}</span>
            </button>
            <div v-show="isUserDropdownOpenDesktop"
                 class="desktop-dropdown-content absolute z-50 mt-2 right-0 w-48 bg-gray-900/95 backdrop-blur-lg text-white rounded-xl shadow-xl transition-all duration-300"
                 :class="{ 'opacity-100 translate-y-0': isUserDropdownOpenDesktop, 'opacity-0 -translate-y-2 pointer-events-none': !isUserDropdownOpenDesktop }">
              <router-link
                v-if="user"
                to="/account"
                class="block px-4 py-3 hover:bg-orange-500/10 rounded-t-lg"
                @click="closeAllDropdowns"
              >
                Tài khoản
              </router-link>
              <label
                v-if="user"
                for="avatar-upload"
                class="block w-full text-left px-4 py-3 hover:bg-orange-500/10 cursor-pointer"
              >
                Cập nhật Avatar
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
                />
              </label>
              <button
                v-if="user"
                @click="handleLogout"
                class="block w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-b-lg"
              >
                Đăng xuất
              </button>
              <router-link
                v-else
                to="/auth"
                class="block px-4 py-3 hover:bg-orange-500/10 rounded-lg"
                @click="closeAllDropdowns"
              >
                Đăng nhập
              </router-link>
            </div>
          </div>

          <!-- Hamburger Menu (Mobile) -->
          <button class="lg:hidden mobile-menu-trigger" @click="toggleMobileMenu" aria-label="Mở menu di động">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu (Slide-in) -->
      <div
        v-if="isMobileMenuOpen"
        class="mobile-menu-slide-in lg:hidden fixed top-0 right-0 h-full w-80 bg-gray-900/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out"
        :class="{ 'translate-x-0': isMobileMenuOpen, 'translate-x-full': !isMobileMenuOpen }"
      >
        <div class="flex justify-end p-4">
          <button @click="toggleMobileMenu" class="text-white hover:text-orange-400" aria-label="Đóng menu di động">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="px-4 pb-4">
          <div class="mb-4 relative"> <!-- Added relative for search icon positioning -->
            <input
              type="text"
              v-model="searchQuery"
              @input="debouncedSearch"
              @keyup.enter="handleSearchEnter"
              placeholder="Tìm kiếm phim..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 backdrop-blur-lg text-white placeholder-gray-400 border border-gray-700/50 rounded-full focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all duration-300"
              aria-label="Tìm kiếm phim"
            />
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <ul class="flex flex-col gap-4 text-base font-semibold">
            <li>
              <router-link to="/" class="block py-2 hover:text-orange-400" @click="toggleMobileMenu">
                Trang chủ
              </router-link>
            </li>
            <li>
              <button @click="toggleDropdown('categoryMobile')" class="block py-2 hover:text-orange-400 w-full text-left flex items-center justify-between">
                Genres
                <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': isCategoryDropdownOpenMobile }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="isCategoryDropdownOpenMobile" class="mt-2 pl-4 max-h-64 overflow-y-auto scrollbar-thin">
                <router-link
                  v-for="item in categoryStore.getAllCategories"
                  :key="item.slug"
                  :to="`/category/${item.slug}/page/1`"
                  class="block py-2 hover:text-orange-400"
                  @click="closeAllDropdowns"
                >
                  {{ item.name }}
                </router-link>
              </div>
            </li>
            <li>
              <button @click="toggleDropdown('countryMobile')" class="block py-2 hover:text-orange-400 w-full text-left flex items-center justify-between">
                Quốc Gia
                <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': isCountryDropdownOpenMobile }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="isCountryDropdownOpenMobile" class="mt-2 pl-4 max-h-64 overflow-y-auto scrollbar-thin">
                <router-link
                  v-for="item in countryStore.getAllCountries"
                  :key="item.slug"
                  :to="`/country/${item.slug}/page/1`"
                  class="block py-2 hover:text-orange-400"
                  @click="closeAllDropdowns"
                >
                  {{ item.name }}
                </router-link>
              </div>
            </li>
            <li>
              <router-link to="/contact" class="block py-2 hover:text-orange-400" @click="toggleMobileMenu">
                Liên hệ
              </router-link>
            </li>
            <li>
              <router-link v-if="user" to="/account" class="block py-2 hover:text-orange-400" @click="toggleMobileMenu">
                Tài khoản
              </router-link>
              <router-link v-else to="/auth" class="block py-2 hover:text-orange-400" @click="toggleMobileMenu">
                Đăng nhập
              </router-link>
            </li>
            <li v-if="user">
              <label for="avatar-upload-mobile" class="block py-2 hover:text-orange-400 cursor-pointer w-full text-left">
                Cập nhật Avatar
                <input
                  id="avatar-upload-mobile"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
                />
              </label>
            </li>
            <li v-if="user">
              <button @click="handleLogout" class="block py-2 text-red-400 hover:text-red-300 w-full text-left">
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCountryStore } from '@/stores/Country/country.js';
import { useCategoryStore } from '@/stores/Category/category.js';
import { useMovieStore } from '@/stores/Movie/movie.js';
import { getAuth, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { debounce } from 'lodash';

// Router
const router = useRouter();

// Stores
const countryStore = useCountryStore();
const categoryStore = useCategoryStore();
const movieStore = useMovieStore();

// State for mobile dropdowns (inside mobile menu)
const isCategoryDropdownOpenMobile = ref(false);
const isCountryDropdownOpenMobile = ref(false);
const isMobileMenuOpen = ref(false); // Controls the slide-in mobile menu

// State for desktop dropdowns
const isCategoryDropdownOpenDesktop = ref(false);
const isCountryDropdownOpenDesktop = ref(false);
const isUserDropdownOpenDesktop = ref(false);

const searchQuery = ref('');
const user = ref(null); // Firebase user object

// Template Refs for desktop dropdowns and search container
const categoryDropdownRef = ref(null);
const countryDropdownRef = ref(null);
const userDropdownRef = ref(null);
const searchContainerRef = ref(null);

// Tìm kiếm với debounce
const debouncedSearch = debounce(() => {
  const query = searchQuery.value.trim();
  movieStore.searchMovies(query);
}, 300);

// Toggle dropdown (handles both mobile and desktop based on context)
const toggleDropdown = (type) => {
  if (isMobileMenuOpen.value) { // Logic for mobile dropdowns (within the slide-in menu)
    if (type === 'categoryMobile') {
      isCategoryDropdownOpenMobile.value = !isCategoryDropdownOpenMobile.value;
      isCountryDropdownOpenMobile.value = false; // Close other mobile dropdown
    } else if (type === 'countryMobile') {
      isCountryDropdownOpenMobile.value = !isCountryDropdownOpenMobile.value;
      isCategoryDropdownOpenMobile.value = false; // Close other mobile dropdown
    }
  } else { // Logic for desktop dropdowns
    // Đóng tất cả các dropdown desktop khác trước khi mở cái mới
    if (type === 'categoryDesktop') {
      isCategoryDropdownOpenDesktop.value = !isCategoryDropdownOpenDesktop.value;
      isCountryDropdownOpenDesktop.value = false;
      isUserDropdownOpenDesktop.value = false;
    } else if (type === 'countryDesktop') {
      isCountryDropdownOpenDesktop.value = !isCountryDropdownOpenDesktop.value;
      isCategoryDropdownOpenDesktop.value = false;
      isUserDropdownOpenDesktop.value = false;
    } else if (type === 'userDesktop') {
      isUserDropdownOpenDesktop.value = !isUserDropdownOpenDesktop.value;
      isCategoryDropdownOpenDesktop.value = false;
      isCountryDropdownOpenDesktop.value = false;
    }
  }
};

// Đóng tất cả dropdown (cho cả desktop và mobile menu)
const closeAllDropdowns = () => {
  // Desktop dropdowns
  isCategoryDropdownOpenDesktop.value = false;
  isCountryDropdownOpenDesktop.value = false;
  isUserDropdownOpenDesktop.value = false;

  // Mobile dropdowns (inside the mobile menu)
  isCategoryDropdownOpenMobile.value = false;
  isCountryDropdownOpenMobile.value = false;
  isMobileMenuOpen.value = false; // Close the mobile slide-in menu itself
  searchQuery.value = ''; // Clear search when all dropdowns are closed
};

// Toggle menu di động
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // Khi mở/đóng menu di động, đóng tất cả các dropdown desktop
  isCategoryDropdownOpenDesktop.value = false;
  isCountryDropdownOpenDesktop.value = false;
  isUserDropdownOpenDesktop.value = false;
  if (!isMobileMenuOpen.value) { // Nếu đang đóng mobile menu, đóng luôn các dropdown con
    isCategoryDropdownOpenMobile.value = false;
    isCountryDropdownOpenMobile.value = false;
    searchQuery.value = '';
  }
};

// Xử lý tìm kiếm khi nhấn Enter
const handleSearchEnter = () => {
  if (movieStore.getMovies.length > 0) {
    const firstMovie = movieStore.getMovies[0];
    router.push(`/film/${firstMovie.slug}`);
    clearSearch();
  }
};

// Xóa tìm kiếm
const clearSearch = () => {
  searchQuery.value = '';
  movieStore.searchMovies(''); // Reset kết quả tìm kiếm trong store
};

// Xử lý tải lên avatar
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const auth = getAuth();
  const currentUser = auth.currentUser; // Lấy user hiện tại
  if (!currentUser || !currentUser.uid) {
    console.warn('Vui lòng đăng nhập để cập nhật avatar.');
    return;
  }

  try {
    const storage = getStorage();
    const storageReference = storageRef(storage, `avatars/${currentUser.uid}/${file.name}`);
    await uploadBytes(storageReference, file);
    const photoURL = await getDownloadURL(storageReference);
    await updateProfile(currentUser, { photoURL });
    user.value = { ...user.value, photoURL }; // Cập nhật user ref cục bộ
    console.log('Cập nhật avatar thành công!');
  } catch (error) {
    console.error('Lỗi khi tải lên avatar:', error);
    console.warn('Đã có lỗi xảy ra khi cập nhật avatar.');
  }
};

// Xử lý đăng xuất
const handleLogout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
    user.value = null; // Xóa user ref cục bộ
    router.push('/auth');
    closeAllDropdowns();
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
    console.warn('Đã có lỗi xảy ra khi đăng xuất.');
  }
};

// Lifecycle hooks
onMounted(() => {
  // Global click listener để đóng các dropdown khi click bên ngoài
  document.addEventListener('click', (e) => {
    // Đóng desktop dropdowns nếu click bên ngoài vùng của chúng
    if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target)) {
      isCategoryDropdownOpenDesktop.value = false;
    }
    if (countryDropdownRef.value && !countryDropdownRef.value.contains(e.target)) {
      isCountryDropdownOpenDesktop.value = false;
    }
    if (userDropdownRef.value && !userDropdownRef.value.contains(e.target)) {
      isUserDropdownOpenDesktop.value = false;
    }

    // Đóng search dropdown nếu click bên ngoài search input hoặc dropdown kết quả
    if (searchQuery.value && searchContainerRef.value && !searchContainerRef.value.contains(e.target)) {
      clearSearch();
    }

    // Đóng mobile menu nếu click bên ngoài menu hoặc nút mở menu
    const mobileMenuElement = document.querySelector('.mobile-menu-slide-in');
    const mobileMenuTriggerButton = document.querySelector('.mobile-menu-trigger');
    if (isMobileMenuOpen.value && mobileMenuElement && mobileMenuTriggerButton && !mobileMenuElement.contains(e.target) && !mobileMenuTriggerButton.contains(e.target)) {
      closeAllDropdowns(); // Sử dụng closeAllDropdowns để đảm bảo tất cả đóng
    }
  });


  try {
    // Gọi các hành động của Pinia store để tải dữ liệu
    countryStore.getCountry();
    categoryStore.getCategory();

    // Thêm console log để kiểm tra dữ liệu sau khi tải
    console.log('Navbar: categoryStore.getAllCategories length:', categoryStore.getAllCategories.length);
    console.log('Navbar: countryStore.getAllCountries length:', countryStore.getAllCountries.length);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu thể loại/quốc gia:', error);
  }

  // Lắng nghe trạng thái xác thực Firebase
  const auth = getAuth();
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser; // Cập nhật biến user cục bộ
  });
});

// Theo dõi tìm kiếm (đã có debounce)
watch(searchQuery, (newQuery) => {
  debouncedSearch();
});
</script>

<style scoped>
/* Tùy chỉnh thanh cuộn */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #f97316 #1f2937;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #1f2937;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #f97316;
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #ea580c;
}

/* Kiểu cho liên kết đang hoạt động */
.router-link-active {
  color: #f97316;
  position: relative;
}

.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #f97316;
}

/* Tùy chỉnh responsive */
@media (max-width: 1024px) {
  /* .w-full.sm\:w-80 {
    width: 100%;
  } */
}
</style>
