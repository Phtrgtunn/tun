<template>
<div class="fixed inset-0 bg-[url('https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg')] bg-cover bg-center z-50 flex items-center justify-center overflow-auto">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>
    <div class="relative z-10 w-full max-w-md p-6">
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
        <button @click="router.push('/')" class="absolute top-4 right-4 text-white text-2xl hover:text-blue-300 transition-transform duration-200 hover:scale-110">×</button>
        <h2 class="text-4xl font-extrabold text-center text-white mb-8 tracking-tight">{{ isLogin ? 'Đăng Nhập' : 'Đăng Ký' }}</h2>
        
        <!-- Google Auth Button -->
        <button
          @click="handleGoogleAuth"
          class="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-800 to-gray-700 py-3 rounded-xl mb-6 hover:from-gray-700 hover:to-gray-600 transition-all duration-300 text-white text-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          :disabled="loading"
        >
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="w-5 h-5" />
          {{ isLogin ? 'Đăng Nhập bằng Google' : 'Đăng Ký bằng Google' }}
          <span v-if="loading" class="ml-2 animate-spin">⌀</span>
        </button>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="!isLogin" class="relative space-y-2">
            <div class="absolute top-3 left-3 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tên tài khoản"
              v-model="username"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              required
            />
          </div>
          <div class="relative space-y-2">
            <div class="absolute top-3 left-3 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Email"
              v-model="email"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              required
            />
          </div>
          <div class="relative space-y-2">
            <div class="absolute top-3 left-3 text-gray-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.1-.9-2-2-2H8V6a2 2 0 012-2h4a2 2 0 012 2v3h2a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2h2v2zm-2 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Mật khẩu"
              v-model="password"
              class="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-3 rounded-xl text-white font-semibold text-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
            :disabled="loading"
          >
            <span v-if="!loading">{{ isLogin ? 'Đăng Nhập' : 'Đăng Ký' }}</span>
            <span v-else class="flex items-center justify-center">
              <span class="animate-spin mr-2">⌀</span> Đang xử lý...
            </span>
          </button>
        </form>

        <!-- Error Message -->
        <transition name="fade">
          <p v-if="error" class="text-red-400 text-center mt-4 text-sm animate-pulse">{{ error }}</p>
        </transition>

        <!-- Toggle Mode -->
        <button
          @click="toggleMode"
          class="w-full mt-6 text-blue-300 hover:text-blue-200 text-sm font-medium text-center underline underline-offset-4 transition-colors duration-200"
        >
          {{ isLogin ? 'Chưa có tài khoản? Đăng Ký' : 'Đã có tài khoản? Đăng Nhập' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

// Initialize router for navigation
const router = useRouter();

// Get auth instance for login and registration
const auth = getAuth();
// Create Google auth provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' }); // Force account selection for Google Auth

// Reactive state for the form
const isLogin = ref(true); // true=login, false=register
const username = ref('');  // Username (used for registration)
const email = ref('');    // Email input
const password = ref(''); // Password input
const error = ref('');    // Error message
const loading = ref(false); // Loading state

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    router.push('/'); // Redirect to home if already logged in
  }
});

// Toggle between login and registration form
const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';     // Clear error on form switch
  username.value = '';  // Clear input fields
  email.value = '';
  password.value = '';
};

// Handle form submission for email/password
const handleSubmit = async () => {
  loading.value = true;
  error.value = ''; // Clear previous errors
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      console.log('Đăng nhập thành công');
    } else {
      const res = await createUserWithEmailAndPassword(auth, email.value, password.value);
      await updateProfile(res.user, { displayName: username.value || 'Người dùng' });
      console.log('Đăng ký thành công');
    }
    router.push('/');
  } catch (err) {
    error.value = getErrorMessage(err.code);
  } finally {
    loading.value = false;
  }
};

// Handle Google authentication for both login and registration
const handleGoogleAuth = async () => {
  loading.value = true;
  error.value = ''; // Clear previous errors
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (!isLogin.value) {
      // For registration, ensure displayName is set if provided
      await updateProfile(user, { displayName: user.displayName || username.value || 'Người dùng' });
      console.log('Đăng ký bằng Google thành công');
    } else {
      console.log('Đăng nhập bằng Google thành công');
    }
    router.push('/');
  } catch (err) {
    error.value = getErrorMessage(err.code);
  } finally {
    loading.value = false;
  }
};

// Convert Firebase error codes to user-friendly messages
const getErrorMessage = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email đã được sử dụng.';
    case 'auth/invalid-email':
      return 'Email không hợp lệ.';
    case 'auth/wrong-password':
      return 'Mật khẩu không đúng.';
    case 'auth/user-not-found':
      return 'Tài khoản không tồn tại.';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu, cần ít nhất 6 ký tự.';
    case 'auth/popup-closed-by-user':
      return 'Cửa sổ đăng nhập Google đã bị đóng.';
    case 'auth/popup-blocked':
      return 'Cửa sổ đăng nhập Google bị chặn bởi trình duyệt.';
    case 'auth/too-many-requests':
      return 'Quá nhiều yêu cầu, vui lòng thử lại sau.';
    case 'auth/network-request-failed':
      return 'Lỗi mạng, vui lòng kiểm tra kết nối internet.';
    default:
      return `Lỗi: ${code}. Vui lòng thử lại.`;
  }
};
</script>

<style scoped>
/* Fade transition for error message */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
:deep(*) {
  font-family: 'Inter', sans-serif;
}

/* Additional styling for inputs and buttons */
input {
  transition: all 0.3s ease;
}
input:focus {
  transform: scale(1.02);
}
button {
  transition: all 0.3s ease;
}
</style>