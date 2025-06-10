// importPhimBoToSupabase.js (Chạy bằng Node.js)
// Đây là script dùng để đẩy dữ liệu phim từ API của phimapi.com vào database Supabase của bạn.

// --- BƯỚC 1: ĐẢM BẢO CÁC GÓI ĐƯỢC CÀI ĐẶT ---
// Mở terminal trong thư mục gốc của dự án và chạy:
// npm install axios @supabase/supabase-js dotenv

// --- BƯỚC 2: CẤU HÌNH BIẾN MÔI TRƯỜNG ---
// Tạo một file .env ở thư mục gốc của dự án (ngang hàng với file này)
// và thêm các dòng sau vào đó (thay thế bằng URL và KEY của bạn):
// VITE_SUPABASE_URL=https://lpdbupezactldtxjsnjn.supabase.co
// VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZGJ1cGV6YWN0bGR0eGpzbmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNjYyMjIsImV4cCI6MjA2NDk0MjIyMn0.L-RBsTTTDtYdAOtDtQwyQFJC9viuEuGXehyd8cHXPzA

// Tải biến môi trường từ tệp .env vào process.env (sử dụng cú pháp ES module)
import 'dotenv/config'; 

// Import các thư viện cần thiết
import axios from 'axios';
import { createClient } from '@supabase/supabase-js'; 

// --- KHỞI TẠO SUPABASE CLIENT TRỰC TIẾP TRONG SCRIPT NÀY ---
// Sử dụng process.env để truy cập biến môi trường đã tải bởi dotenv
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

// Kiểm tra để đảm bảo biến môi trường đã được tải
if (!supabaseUrl || !supabaseKey) {
    console.error("Lỗi: Supabase URL hoặc Key (với tiền tố VITE_) không được định nghĩa trong biến môi trường của Node.js.");
    throw new Error("Thiếu biến môi trường Supabase. Vui lòng kiểm tra file .env của bạn.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Hàm này sẽ chuẩn hóa URL ảnh, tránh việc ghép nối tên miền hai lần
function normalizeImageUrl(imageUrl, cdnDomain) {
    if (!imageUrl) return null;
    // Kiểm tra xem URL đã chứa tên miền CDN chưa
    if (imageUrl.startsWith(cdnDomain)) {
        return imageUrl; // Nếu đã có, trả về nguyên bản
    }
    // Nếu chưa, ghép nối tên miền CDN
    return `${cdnDomain}/${imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl}`;
}

async function fetchDataAndUpsert(apiUrl, categoryLabel, pageLimit) {
    console.log(`Bắt đầu quá trình tải và đẩy dữ liệu ${categoryLabel} lên Supabase từ ${apiUrl}...`);

    for (let page = 1; page <= pageLimit; page++) {
        try {
            console.log(`Đang lấy dữ liệu từ trang ${page} của ${apiUrl}...`);
            const response = await axios.get(`${apiUrl}?page=${page}`);
            
            let apiData;
            if (response.data && response.data.data) {
                apiData = response.data.data; 
            } else if (response.data && response.data.items) {
                apiData = response.data; 
            } else {
                console.error(`Cấu trúc dữ liệu API không mong muốn từ ${apiUrl}. Bỏ qua trang này.`, response.data);
                continue; 
            }

            const moviesFromApi = apiData.items;
            const IMAGE_CDN_DOMAIN = apiData.APP_DOMAIN_CDN_IMAGE || 'https://phimimg.com';

            if (!moviesFromApi || moviesFromApi.length === 0) {
                console.log(`Không tìm thấy phim ${categoryLabel} ở trang ${page}. Dừng lại.`);
                break; 
            }

            const moviesToInsert = moviesFromApi.map(movie => {
                const runtimeMatch = movie.time ? movie.time.match(/(\d+)\s*phút/) : null;
                const runtimeMinutes = runtimeMatch ? parseInt(runtimeMatch[1]) : null;

                // --- ĐÃ SỬA: Chuẩn hóa URL ảnh để tránh lỗi trùng lặp tên miền ---
                const fullPosterPath = normalizeImageUrl(movie.thumb_url, IMAGE_CDN_DOMAIN);
                const fullBackdropPath = normalizeImageUrl(movie.poster_url, IMAGE_CDN_DOMAIN);

                return {
                    api_id: movie._id,
                    title: movie.name,
                    original_title: movie.origin_name || null,
                    overview: movie.content || null,
                    poster_path: fullPosterPath, 
                    backdrop_path: fullBackdropPath, 
                    release_date: movie.year ? `${movie.year}-01-01` : null, 
                    vote_average: movie.tmdb?.vote_average ? parseFloat(movie.tmdb.vote_average) : 0,
                    runtime: runtimeMinutes,
                    tagline: movie.chieurap ? 'Phim Chiếu Rạp' : null,
                    genres: movie.category ? movie.category.map(cat => cat.name) : [],
                    country: movie.country ? movie.country.map(c => c.name) : [], 
                    type: movie.type || null, 
                    slug: movie.slug || null, 
                    year: movie.year || null,
                    episode_current: movie.episode_current || null,
                    episode_total: movie.episode_total || null,
                    quality: movie.quality || null,
                    lang: movie.lang || null,
                    actor: movie.actor || [], 
                    director: movie.director || [], 
                    view: movie.view || 0,
                    status: movie.status || null,
                    is_copyright: movie.is_copyright || false,
                    sub_docquyen: movie.sub_docquyen || false,
                    chieurap: movie.chieurap || false,
                    trailer_url: movie.trailer_url || null,
                    notify: movie.notify || null,
                    showtimes: movie.showtimes || null,
                };
            });

            console.log(`Tìm thấy ${moviesToInsert.length} phim ${categoryLabel} ở trang ${page}. Đang đẩy lên Supabase...`);

            const { data, error } = await supabase
                .from('movies')
                .upsert(moviesToInsert, {
                    onConflict: 'api_id', 
                    ignoreDuplicates: false
                })
                .select();

            if (error) {
                console.error(`Lỗi khi đẩy phim ${categoryLabel} từ trang ${page} lên Supabase:`, error);
            } else {
                console.log(`Đã đẩy/cập nhật thành công ${data.length} phim ${categoryLabel} từ trang ${page}.`);
            }

            await new Promise(resolve => setTimeout(resolve, 500)); 
        } catch (apiError) {
            console.error(`Lỗi khi gọi API phim ${categoryLabel} ở trang ${page}:`, apiError); 
            console.error("Chi tiết lỗi API (nếu có):", apiError.response?.data || apiError.message);
            break; 
        }
    }
    console.log(`Hoàn thành quá trình tải và đẩy dữ liệu ${categoryLabel}.`);
}

// --- HÀM THÊM PHIM ĐƠN LẺ VÀO SUPABASE ---
async function addSingleMovieToSupabase(movieData) {
    console.log("Bắt đầu thêm phim đơn lẻ vào Supabase...");

    const IMAGE_CDN_DOMAIN_SINGLE = 'https://phimimg.com'; // Tên miền cho phim đơn lẻ

    const movieToInsert = {
        api_id: movieData._id,
        title: movieData.name,
        original_title: movieData.origin_name || null,
        overview: movieData.content || null,
        // --- ĐÃ SỬA: Chuẩn hóa URL ảnh cho phim đơn lẻ ---
        poster_path: normalizeImageUrl(movieData.thumb_url, IMAGE_CDN_DOMAIN_SINGLE), 
        backdrop_path: normalizeImageUrl(movieData.poster_url, IMAGE_CDN_DOMAIN_SINGLE),
        release_date: movieData.year ? `${movieData.year}-01-01` : null, 
        vote_average: movieData.tmdb?.vote_average ? parseFloat(movieData.tmdb.vote_average) : 0,
        runtime: movieData.time ? parseInt(movieData.time.match(/(\d+)/)?.[1]) : null, 
        tagline: movieData.tagline || movieData.chieurap ? 'Phim Chiếu Rạp' : null, 
        genres: movieData.category ? movieData.category.map(cat => cat.name) : [],
        country: movieData.country ? movieData.country.map(c => c.name) : [], 
        type: movieData.type || null,
        slug: movieData.slug || null,
        year: movieData.year || null,
        episode_current: movieData.episode_current || null,
        episode_total: movieData.episode_total || null,
        quality: movieData.quality || null,
        lang: movieData.lang || null,
        actor: movieData.actor || [],
        director: movieData.director || [],
        view: movieData.view || 0,
        status: movieData.status || null,
        is_copyright: movieData.is_copyright || false,
        sub_docquyen: movieData.sub_docquyen || false,
        chieurap: movieData.chieurap || false,
        trailer_url: movieData.trailer_url || null,
        notify: movieData.notify || null,
        showtimes: movieData.showtimes || null,
    };

    try {
        const { data, error } = await supabase
            .from('movies')
            .upsert([movieToInsert], {
                onConflict: 'api_id', 
                ignoreDuplicates: false
            })
            .select();

        if (error) {
            console.error("Lỗi khi thêm phim đơn lẻ vào Supabase:", error);
        } else {
            console.log("Phim đơn lẻ đã được thêm/cập nhật thành công vào Supabase:", data);
        }
    } catch (err) {
        console.error("Lỗi không xác định khi thêm phim đơn lẻ:", err);
    }
    console.log("Hoàn thành thêm phim đơn lẻ.");
}

// Hàm chính để gọi các hàm nhập dữ liệu
async function importAllMovies() {
    // Nhập phim bộ (5 trang)
    await fetchDataAndUpsert('https://phimapi.com/v1/api/danh-sach/phim-bo', 'phim bộ', 5);
    console.log("\n-----------------------------------\n"); 
    // Nhập phim lẻ (5 trang)
    await fetchDataAndUpsert('https://phimapi.com/v1/api/danh-sach/phim-le', 'phim lẻ', 5);
    console.log("\n-----------------------------------\n"); 
    // Nhập phim mới cập nhật (5 trang)
    await fetchDataAndUpsert('https://phimapi.com/danh-sach/phim-moi-cap-nhat', 'phim mới cập nhật', 5);
    console.log("\n-----------------------------------\n");

    // --- GỌI HÀM THÊM PHIM ĐƠN LẺ VỚI DỮ LIỆU CỤ THỂ ---
    const singleMovieData = {
        "status": true,
        "msg": "",
        "movie": {
          "tmdb": {
            "type": "movie",
            "id": "1306845",
            "season": null,
            "vote_average": 5.1,
            "vote_count": 8
          },
          "imdb": {
            "id": null
          },
          "created": {
            "time": "2025-06-08T21:33:53.000Z"
          },
          "modified": {
            "time": "2025-06-09T02:13:43.000Z"
          },
          "_id": "f4d3d2d59003d83fb3ef32f78610b4a2",
          "name": "Người Bảo Vệ Công Lý",
          "slug": "nguoi-bao-ve-cong-ly",
          "origin_name": "Jaat",
          "content": "Phim xoay quanh cuộc chiến giữa thiện và ác. Một bên là Ranatunga: tội phạm khét tiếng, tàn nhẫn, lợi dụng quyền lực và vàng để đàn áp dân lành. Bên kia là “Jaat”, vị khách bí ẩn sắt đá, đến để đòi một lời xin lỗi và đem lại hy vọng cho người dân bị áp bức.",
          "type": "single",
          "status": "completed",
          "poster_url": "https://phimimg.com/upload/vod/20250608-1/76ba9b77011ea542890bc8d7667ecfdc.jpg",
          "thumb_url": "https://phimimg.com/upload/vod/20250608-1/429243f5b2d2e4674366cd26318168ef.jpg",
          "is_copyright": false,
          "sub_docquyen": false,
          "chieurap": false,
          "trailer_url": "https://www.youtube.com/watch?v=7noiElC2MpE",
          "time": "153 phút",
          "episode_current": "Full",
          "episode_total": "1",
          "quality": "FHD",
          "lang": "Vietsub",
          "notify": "",
          "showtimes": "",
          "year": 2025,
          "view": 0,
          "actor": [
            "Sunny Deol",
            "Randeep Hooda",
            "Saiyami Kher",
            "Regina Cassandra",
            "Vineet Kumar Singh",
            "Ramya Krishnan",
            "Jagapati Babu",
            "Vinay Varma",
            "Zarina Wahab",
            "Upendra Limaye",
            "Urvashi Rautela",
            "Inaya Sultana",
            "Divi Vadthya",
            "Bandhavi Sridhar",
            "Ayesha Khan",
            "Makrand Deshpande",
            "Pranee"
          ],
          "director": [
            "Gopichand Malineni"
          ],
          "category": [
            {
              "id": "9822be111d2ccc29c7172c78b8af8ff5",
              "name": "Hành Động",
              "slug": "hanh-dong"
            },
            {
              "id": "7a035ac0b37f5854f0f6979260899c90",
              "name": "Hình Sự",
              "slug": "hinh-su"
            },
            {
              "id": "37a7b38b6184a5ebd3c43015aa20709d",
              "name": "Chính Kịch",
              "slug": "chinh-kich"
            }
          ],
          "country": [
            {
              "id": "aadd510492662beef1a980624b26c685",
              "name": "Ấn Độ",
              "slug": "an-do"
            }
          ]
        },
        "episodes": [
          {
            "server_name": "#Hà Nội (Vietsub)",
            "server_data": [
              {
                "name": "Full",
                "slug": "full",
                "filename": "Người Bảo Vệ Công Lý - Jaat - 2025 - 1080p - Vietsub - Full",
                "link_embed": "https://player.phimapi.com/player/?url=https://s6.kkphimplayer6.com/20250608/ASUwKkwG/index.m3u8",
                "link_m3u8": "https://s6.kkphimplayer6.com/20250608/ASUwKkwG/index.m3u8"
              }
            ]
          }
        ]
    };
    await addSingleMovieToSupabase(singleMovieData.movie); 
}

// Gọi hàm để bắt đầu import tất cả phim
importAllMovies();
