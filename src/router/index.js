// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Import các component View (trang)
// Đảm bảo các đường dẫn này chính xác với cấu trúc thư mục của bạn
import WelcomePage from '../pages/WelcomePage.vue'; // Import WelcomePage
import Homepage from '../pages/Homepage.vue';
import MovieDetail from '../pages/MovieDetail.vue';
import WatchMovie from '../pages/WatchMovie.vue';
import ListBaseType from '../pages/ListBaseType.vue';
import ListBaseCategory from '../pages/ListBaseCategory.vue';
import ListBaseNational from '../pages/ListBaseNational.vue';
import Contact from '../pages/Contact.vue';
import Auth from '../pages/Auth.vue';
import Account from '../pages/Account.vue'; // Import trang Account

const routes = [
  { path: '/', name: 'Welcome', component: WelcomePage }, // WelcomePage hiển thị đầu tiên
  { path: '/home', name: 'Homepage', component: Homepage }, // Trang chủ thực sự
  { path: '/film/:filmName', name: 'MovieDetail', component: MovieDetail, props: true },
  { path: '/film/:filmName/tap/:tap', name: 'WatchMovie', component: WatchMovie, props: true },
  { 
    path: '/list/:type/page/:pageNumber', 
    name: 'ListBaseType', 
    component: ListBaseType, 
    props: true 
  },
  { 
    path: '/category/:categorySlug?/page/:pageNumber', // Slug tùy chọn
    name: 'ListBaseCategory', 
    component: ListBaseCategory, 
    props: true 
  },
  { 
    path: '/country/:countrySlug?/page/:pageNumber', // Slug tùy chọn
    name: 'ListBaseNational', 
    component: ListBaseNational, 
    props: true 
  },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/auth', name: 'Auth', component: Auth },
  { path: '/account', name: 'Account', component: Account }, // Thêm route cho trang tài khoản
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Đảm bảo tương thích Vite
  routes,
  // Luôn cuộn lên đầu trang khi chuyển route
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' };
  },
});

export default router;
