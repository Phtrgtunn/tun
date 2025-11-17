<template>
  <div class="px-4 py-8 w-[1200px] mx-auto">
    <!-- Pass dynamic basePath and baseSlug to FilterBar based on current route -->
    <FilterBar 
      :basePath="currentBasePath" 
      :baseSlug="currentBaseSlug" 
    />

    <div class="w-full flex gap-6 mt-4">
      <div class="grid grid-cols-4 gap-4 flex-[4]">
        <template v-if="movies && movies.length > 0">
          <MovieCardRecommended
            v-for="(item, index) in movies"
            :key="item.id || index"
            :movie="item"
            :trending="false"
          />
        </template>
        <p v-else class="text-center col-span-4 text-gray-400">Không có dữ liệu.</p>
      </div>

      <div class="flex-1">
        <h3 class="uppercase text-[#da966e] text-sm border-b-2 border-dashed border-gray-400 pb-2 mb-3">
          Bảng Xếp Hạng
        </h3>
        <template v-if="recommendedMoviesStore.getRecommended.length > 0">
          <Rank
            v-for="(item, index) in recommendedMoviesStore.getRecommended.slice(0, 8)"
            :key="item.id || index"
            :trendingMovie="item"
            :index="index"
          />
        </template>
        <p v-else class="text-gray-400">Không có dữ liệu.</p>
      </div>
    </div>

    <div class="flex justify-center mt-8">
      <nav role="navigation" aria-label="pagination" class="mx-auto flex w-full justify-center">
        <ul class="flex flex-row items-center gap-1">
          <li>
            <button
              @click="handlePageChange(currentPage - 1)"
              :class="{ 'opacity-50 pointer-events-none': currentPage === 1 }"
              class="px-2.5 py-1.5 sm:pl-2.5 gap-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
              <span class="hidden sm:block">Previous</span>
            </button>
          </li>

          <li v-for="(page, index) in renderPagination()" :key="index">
            <span v-if="page === 'ellipsis'" class="flex size-9 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              <span class="sr-only">More pages</span>
            </span>
            <button
              v-else
              @click="handlePageChange(page)"
              :class="{ 'bg-[#da966e] text-white': currentPage === page, 'hover:bg-gray-200': currentPage !== page }"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
            >
              {{ page }}
            </button>
          </li>

          <li>
            <button
              @click="handlePageChange(currentPage + 1)"
              :class="{ 'opacity-50 pointer-events-none': currentPage === totalPage }"
              class="px-2.5 py-1.5 sm:pr-2.5 gap-1 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-200"
            >
              <span class="hidden sm:block">Next</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FilterBar from '@/shared/FilterBar.vue';
import MovieCardRecommended from '@/shared/MovieCardRecommended.vue';
import Rank from '@/shared/Rank.vue';
import { useRecommendedMoviesStore } from '@/stores/RecommendedMovies/recommendedMovies.js';
import { getPhimBo, getPhimLe, getHoatHinh, getTVShows, mapMovieData } from '@/services/movieApi';
import { useCategoryStore } from '@/stores/Category/category';
import { useCountryStore } from '@/stores/Country/country';

// Khởi tạo các hook của Vue Router
const route = useRoute();
const router = useRouter();

// Khởi tạo Pinia store
const recommendedMoviesStore = useRecommendedMoviesStore();
const categoryStore = useCategoryStore();
const countryStore = useCountryStore();

// State reactive cho danh sách phim và tổng số trang
const movies = ref([]);
const totalPage = ref(1);
const itemsPerPage = 20; // Số lượng phim trên mỗi trang

// Refs để lưu trữ các tham số từ route và query
const typeParam = ref(''); // Ví dụ: 'phim-bo' từ /list/:type
const categorySlugParam = ref(''); // Ví dụ: 'hanh-dong' từ /category/:categorySlug
const countrySlugParam = ref(''); // Ví dụ: 'an-do' từ /country/:countrySlug
const currentPage = ref(1);

// Refs cho các query parameters (được sử dụng cho việc lọc thêm)
const selectedCategoryQuery = ref('');
const selectedCountryQuery = ref('');
const selectedYearQuery = ref('');

// Computed properties cho FilterBar props
const currentBasePath = computed(() => {
  if (route.name === 'ListBaseCategory') return 'category';
  if (route.name === 'ListBaseCountry') return 'country';
  return 'list'; // Mặc định hoặc cho ListBaseType
});

const currentBaseSlug = computed(() => {
  if (route.name === 'ListBaseCategory') return categorySlugParam.value;
  if (route.name === 'ListBaseCountry') return countrySlugParam.value;
  return typeParam.value; // Mặc định hoặc cho ListBaseType
});


// Hàm fetch phim từ API
const fetchMovies = async () => {
  console.log("--- Bắt đầu fetchMovies từ API ---");
  console.log("Type Param:", typeParam.value);
  console.log("Selected Category:", selectedCategoryQuery.value);
  console.log("Selected Country:", selectedCountryQuery.value);
  console.log("Selected Year:", selectedYearQuery.value);
  console.log("Current Page:", currentPage.value);

  try {
    // Build params cho API
    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
      sort_field: 'modified.time',
      sort_type: 'desc'
    };

    // Lọc theo thể loại
    if (selectedCategoryQuery.value) {
      params.category = selectedCategoryQuery.value;
      console.log('Áp dụng lọc theo Thể loại:', selectedCategoryQuery.value);
    }

    // Lọc theo quốc gia
    if (selectedCountryQuery.value) {
      params.country = selectedCountryQuery.value;
      console.log('Áp dụng lọc theo Quốc gia:', selectedCountryQuery.value);
    }

    // Lọc theo năm
    if (selectedYearQuery.value) {
      const year = parseInt(selectedYearQuery.value);
      if (!isNaN(year)) {
        params.year = year;
        console.log('Áp dụng lọc theo Năm:', year);
      }
    }

    // Gọi API tương ứng với type
    let response;
    if (typeParam.value === 'phim-bo') {
      response = await getPhimBo(params);
    } else if (typeParam.value === 'phim-le') {
      response = await getPhimLe(params);
    } else if (typeParam.value === 'hoat-hinh') {
      response = await getHoatHinh(params);
    } else if (typeParam.value === 'tv-shows') {
      response = await getTVShows(params);
    } else {
      console.warn('Type không hợp lệ:', typeParam.value);
      movies.value = [];
      totalPages.value = 1;
      return;
    }

    console.log("API Response:", response);

    if (response.status && response.data) {
      movies.value = (response.data.items || []).map(mapMovieData);
      
      // Tính tổng số trang từ pagination
      const pagination = response.data.params?.pagination;
      if (pagination) {
        totalPages.value = pagination.totalPages || 1;
      }

      console.log('Phim đã tải từ API:', movies.value.length, 'phim');
      console.log('Tổng số trang:', totalPages.value);
    } else {
      console.warn('API không trả về dữ liệu hợp lệ');
      movies.value = [];
      totalPages.value = 1;
    }

  } catch (error) {
    console.error('Lỗi khi fetch phim từ API:', error);
    movies.value = [];
    totalPages.value = 1;
  }
};

// Theo dõi sự thay đổi của toàn bộ route (params và query)
watch(
  () => route,
  async (newRoute) => { // Make watcher async to await store data
    currentPage.value = parseInt(newRoute.params.pageNumber) || 1;

    // Trích xuất các slug chính từ route.params dựa trên tên route
    typeParam.value = newRoute.params.type || '';
    categorySlugParam.value = newRoute.params.categorySlug || '';
    countrySlugParam.value = newRoute.params.countrySlug || '';

    // Trích xuất các bộ lọc phụ từ route.query
    selectedCategoryQuery.value = newRoute.query.category || '';
    selectedCountryQuery.value = newRoute.query.country || '';
    selectedYearQuery.value = newRoute.query.year || '';

    // Đảm bảo stores đã tải dữ liệu trước khi fetchMovies được gọi
    // Điều này quan trọng vì fetchMovies cần categoryStore.getAllCategories và countryStore.getAllCountries
    // Nếu dữ liệu store chưa có, fetchMovies có thể không tìm thấy tên category/country từ slug.
    await categoryStore.getCategory(); 
    await countryStore.getCountry(); 

    // Gọi lại hàm fetchMovies khi route thay đổi
    fetchMovies();
  },
  { deep: true, immediate: true } 
);

// Khi component mount, gọi action lấy phim đề cử và dữ liệu category/country stores
onMounted(async () => {
  // onMounted này sẽ chỉ chạy một lần. Watcher sẽ xử lý việc fetchMovies khi route thay đổi.
  // Chúng ta vẫn cần đảm bảo Pinia stores được tải ban đầu ở đây để chúng sẵn sàng
  // cho watcher (nếu watcher chạy ngay lập tức).
  await recommendedMoviesStore.getRecommendedMovies();
  // categoryStore.getCategory() và countryStore.getCountry() cũng được gọi trong watcher
  // với { immediate: true }, nên có thể không cần gọi lại ở đây. 
  // Tuy nhiên, việc gọi ở đây đảm bảo chúng có sẵn sớm nhất có thể.
  // Nếu có lỗi, watcher sẽ bắt.
  // await categoryStore.getCategory(); 
  // await countryStore.getCountry(); 
});

// Hàm xử lý khi người dùng đổi trang
const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPage.value) {
    const currentRouteName = route.name;
    let pathSegment = '';

    // Xây dựng đoạn đường dẫn dựa trên tên route hiện tại
    if (currentRouteName === 'ListBaseType') {
      pathSegment = `list/${typeParam.value}`;
    } else if (currentRouteName === 'ListBaseCategory') {
      pathSegment = `category/${categorySlugParam.value}`;
    } else if (currentRouteName === 'ListBaseCountry') {
      pathSegment = `country/${countrySlugParam.value}`;
    } else {
      // Trường hợp dự phòng nếu routeName không khớp (có thể là các tuyến đường cụ thể khác)
      // Cần đảm bảo logic này không gây lỗi nếu ListBaseType được sử dụng ở các route không mong muốn
      pathSegment = `${typeParam.value}`; // Giả định vẫn là một loại slug
    }

    router.push({
      path: `/${pathSegment}/page/${page}`,
      query: route.query, // Giữ nguyên tất cả các query parameters hiện tại
    });
  }
};

// Hàm tạo mảng các trang để render pagination
const renderPagination = () => {
  const pages = new Set();
  const delta = 2; // Số trang hiển thị xung quanh trang hiện tại

  // Luôn thêm trang đầu tiên và trang cuối cùng
  pages.add(1);
  if (totalPage.value > 1) {
    pages.add(totalPage.value);
  }

  // Thêm các trang xung quanh trang hiện tại
  for (let i = currentPage.value - delta; i <= currentPage.value + delta; i++) {
    if (i >= 1 && i <= totalPage.value) {
      pages.add(i);
    }
  }

  // Chuyển Set thành Array và sắp xếp
  let sortedPages = Array.from(pages).sort((a, b) => a - b);
  let finalPages = [];

  // Thêm dấu ba chấm vào giữa các nhóm trang
  for (let i = 0; i < sortedPages.length; i++) {
    finalPages.push(sortedPages[i]);
    if (i < sortedPages.length - 1 && sortedPages[i + 1] - sortedPages[i] > 1) {
      finalPages.push('ellipsis');
    }
  }

  return finalPages;
};
</script>

<style scoped>
/* Thêm CSS cụ thể cho component này nếu cần */
</style>
