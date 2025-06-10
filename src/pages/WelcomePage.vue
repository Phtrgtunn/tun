<template>
  <div class="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
    <main class="bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl ring-1 ring-blue-100/50 max-w-2xl w-full text-center
                 transform opacity-0 scale-95 animate-fade-in-up">
      <div class="space-y-6">
        <p class="text-sm sm:text-base font-normal text-gray-500 uppercase tracking-widest">ỦY BAN NHÂN DÂN</p>
        <p class="text-base sm:text-lg font-normal text-gray-600 uppercase tracking-widest">SỞ GIÁO DỤC VÀ ĐÀO TẠO</p>
        <h1 class="text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-800 uppercase">TRƯỜNG CAO ĐẲNG KINH TẾ THÀNH PHỐ HỒ CHÍ MINH</h1>
        <p class="text-base sm:text-lg text-blue-500 font-semibold italic">ĐỒ ÁN THIẾT KẾ WEB NÂNG CAO</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-8 sm:gap-y-0 sm:gap-x-12 mt-10 border-t border-b border-gray-200 py-8">
          <div class="text-left">
            <p class="text-base sm:text-lg font-bold text-blue-600 mb-3">GIẢNG VIÊN HƯỚNG DẪN</p>
            <p class="text-base sm:text-lg text-gray-700 hover:text-blue-700 transition-colors cursor-pointer">Phạm Đặng Phương</p>
          </div>
          <div class="text-left">
            <p class="text-base sm:text-lg font-bold text-blue-600 mb-3">SINH VIÊN THỰC HIỆN</p>
            <p class="text-base sm:text-lg text-gray-700 hover:text-blue-700 transition-colors cursor-pointer">Phạm Trung Tuấn</p>
            <p class="text-base sm:text-lg text-gray-700 hover:text-blue-700 transition-colors cursor-pointer">Nguyễn Minh Huy</p>
            <p class="text-base sm:text-lg text-gray-700 hover:text-blue-700 transition-colors cursor-pointer">Trần Lạc Khả Tú</p>
            <p class="text-base sm:text-lg text-gray-700 hover:text-blue-700 transition-colors cursor-pointer">Nguyễn Lý Anh Thư</p>
          </div>
        </div>

        <p class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 pt-10 drop-shadow-md">HTHREE-FILM</p>
        
        <button
          @click="navigateToHomepage"
          class="mt-12 px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl
                 transition-all duration-300 transform hover:scale-105 active:scale-98
                 focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-opacity-75 relative overflow-hidden group"
          aria-label="Vào Trang Web Chính"
        >
          <span class="relative z-10">Vào Trang Web</span>
          <span class="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToHomepage = () => {
  router.push('/home'); // Điều hướng đến trang chủ thực sự của ứng dụng
};
</script>

<style scoped>
/* Import font Inter */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

/* Định nghĩa font Inter */
.font-inter {
  font-family: 'Inter', sans-serif;
}

/* Animation cho phần nội dung chính */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    transform: scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Đảm bảo responsive tốt hơn cho text và padding */
@media (max-width: 640px) {
  .text-xs { font-size: 0.65rem; }
  .text-sm { font-size: 0.75rem; }
  .text-base { font-size: 0.875rem; } /* Adjusted for better fit */
  .text-lg { font-size: 1rem; }
  .text-xl { font-size: 1.125rem; }
  .text-2xl { font-size: 1.25rem; }
  .text-3xl { font-size: 1.5rem; }
  .text-4xl { font-size: 1.75rem; } /* Slightly smaller for very small screens */
  .px-10 { padding-left: 2rem; padding-right: 2rem; } /* Adjusted padding */
  .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
  .p-6, .p-8, .p-10 { padding: 1.25rem; } /* Adjusted card padding */
}
</style>
