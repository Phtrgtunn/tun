<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Navbar luôn hiển thị -->
    <Navbar class="shadow-md" />

    <!-- Trạng thái đang kiểm tra đăng nhập -->
    <div
      v-if="user === undefined"
      class="flex flex-col items-center justify-center flex-grow bg-gradient-to-br from-indigo-100 to-gray-50"
    >
      <div class="text-center">
        <svg
          class="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-xl font-semibold text-gray-700">Đang kiểm tra đăng nhập...</p>
      </div>
    </div>

    <!-- Nội dung chính -->
    <main v-else class="flex-grow">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-4 text-center">
      <p class="text-sm">© 2025 - Ứng dụng xem phim. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from '@/shared/Navbar.vue';
import { toast } from 'vue3-toastify';

const user = ref(undefined);
const auth = getAuth();

onMounted(() => {
  const timeout = setTimeout(() => {
    if (user.value === undefined) {
      user.value = null;
      toast.error('Không thể kiểm tra trạng thái đăng nhập. Vui lòng thử lại!');
    }
  }, 5000);

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    clearTimeout(timeout);
  });

  return () => {
    unsubscribe();
    clearTimeout(timeout);
  };
});
</script>

<style>
body {
  padding-top: 64px; /* Khớp với min-h-[64px] của Navbar */
}
</style>