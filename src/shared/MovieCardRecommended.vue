<template>
  <router-link
    v-if="movie"
    :to="`/film/${movie?.slug}`"
    class="relative block w-full aspect-[2/3] rounded-md overflow-hidden group transition-transform duration-300 ease-out hover:scale-105"
  >
    <img
      :src="movie?.backdrop_path"
      :alt="movie.title || 'Movie Poster'"
      class="w-full h-full object-cover"
      onerror="this.onerror=null;this.src='https://placehold.co/400x600/ccc/fff?text=No+Image';"
    />
    <div
      class="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
    ></div>

    <div
      v-if="movie?.episode_current && movie?.lang"
      class="absolute top-1 left-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-sm"
    >
      {{ movie.episode_current }} + {{ movie.lang }}
    </div>
    <div
      v-if="trending"
      class="absolute top-8 left-0 text-white bg-red-500 text-xs font-semibold px-2 py-1 rounded-sm shadow-md"
    >
      Trending
    </div>

    <div class="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 text-white z-10">
      <h3
        class="text-sm sm:text-base font-bold truncate group-hover:whitespace-normal group-hover:text-phim-red transition-colors"
        :title="movie.title"
      >
        {{ movie.title }}
      </h3>
      <p
        v-if="movie.original_title"
        class="text-xs text-gray-300 truncate group-hover:whitespace-normal"
        :title="movie.original_title"
      >
        {{ movie.original_title }}
      </p>
    </div>
    <div
      class="absolute inset-0 opacity-0 flex justify-center items-center group-hover:opacity-100 transition-opacity duration-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-white opacity-80"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    </div>
  </router-link>
</template>

<script setup>
import { defineProps, watch } from 'vue'; 
import { RouterLink } from 'vue-router'; 

const props = defineProps({
  movie: {
    type: Object,
    default: null,
  },
  trending: {
    type: Boolean,
    default: false,
  },
});

// Watcher này chỉ dùng để debug, có thể xóa sau khi xác nhận hiển thị đúng
watch(() => props.movie, (newMovie) => {
  if (newMovie) {
    console.log('MovieCardRecommended: movie prop received:', newMovie);
    console.log('MovieCardRecommended: movie.poster_path:', newMovie.backdrop_path);
    console.log('MovieCardRecommended: movie.title:', newMovie.title); 
    console.log('MovieCardRecommended: movie.original_title:', newMovie.original_title); 
  } else {
    console.log('MovieCardRecommended: movie prop is null or undefined.');
  }
}, { immediate: true }); 
</script>

<style scoped>
.group-hover\:text-phim-red {
  color: #f09258; 
}
</style>
