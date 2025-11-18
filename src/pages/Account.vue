<template>
  <div class="min-h-screen bg-black font-sans flex flex-col">
    <!-- Top Header with Logo -->
    <div class="bg-black border-b border-gray-800 px-8 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/home" class="flex items-center gap-2">
          <svg class="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          <span class="text-2xl font-bold text-white">HTHREE</span>
        </router-link>
      </div>
    </div>

    <div class="flex flex-1 justify-center">
      <div class="flex w-full max-w-7xl">
        <!-- Sidebar -->
        <aside class="w-80 flex-shrink-0 flex flex-col pl-8 pr-8 py-8">
        <!-- Back Button -->
        <div class="mb-8">
          <router-link to="/home" class="inline-flex items-center text-gray-400 hover:text-white transition-colors font-medium text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Quay lại HTHREE Film
          </router-link>
        </div>

        <!-- Menu Items -->
        <nav class="flex-1 space-y-1">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="activeSection = item.id"
            :class="[
              'w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-500 ease-out relative group',
              activeSection === item.id
                ? 'text-white font-semibold'
                : 'text-gray-400 hover:text-white'
            ]"
            style="isolation: isolate;"
          >
            <!-- Hover background (fade in) -->
            <div 
              v-if="activeSection !== item.id"
              class="absolute inset-0 bg-[#2a2a2a]/40 rounded-lg transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100"
              style="z-index: -1;"
            ></div>
            
            <!-- Active background -->
            <div 
              v-if="activeSection === item.id"
              class="absolute inset-0 bg-[#2a2a2a]/40 rounded-lg"
              style="z-index: -1;"
            ></div>
            
            <!-- Active bar (slide down) -->
            <div 
              v-if="activeSection === item.id"
              class="absolute left-0 top-0 w-1 h-full bg-yellow-400 animate-slide-down-bar"
              style="z-index: 10;"
            ></div>
            
            <!-- Content -->
            <component :is="item.icon" class="w-5 h-5 mr-3 transition-transform duration-500 ease-out group-hover:scale-105 relative z-10" />
            <span class="text-base relative z-10">{{ item.label }}</span>
          </button>
        </nav>
      </aside>

        <!-- Main Content Area -->
        <div class="flex-1 overflow-y-auto">
          <div class="max-w-4xl px-8 py-8">

        <main class="w-full">
          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
            <svg class="animate-spin h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          <!-- Not Logged In -->
          <div v-else-if="!user" class="text-center py-12">
            <p class="text-xl text-gray-400 mb-4">Vui lòng đăng nhập để xem thông tin tài khoản.</p>
            <router-link to="/auth" class="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors">
              Đăng Nhập Ngay
            </router-link>
          </div>

          <!-- Account Content -->
          <div v-else>
            <!-- Tổng quan -->
            <div v-if="activeSection === 'overview'">
              <h1 class="text-3xl font-bold text-white mb-2 tracking-tight">Tài khoản</h1>
              <p class="text-gray-300 mb-8">Thông tin tư cách thành viên</p>

              <!-- Membership Card -->
              <div class="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 border border-purple-700 rounded-lg p-6 mb-6 shadow-lg">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <span class="inline-block bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full mb-3">
                      Thành viên từ tháng {{ getJoinMonth() }}
                    </span>
                    <h2 class="text-xl font-bold text-white tracking-tight">Gói Cao cấp</h2>
                    <p class="text-gray-200 text-sm">Ngày thanh toán tiếp theo: {{ getNextPaymentDate() }}</p>
                    <p class="text-gray-300 text-sm mt-1">Ghi chú trực tiếp: {{ user.email }}</p>
                  </div>
                </div>
                <button class="text-gray-200 hover:text-yellow-400 text-sm font-medium flex items-center transition-colors">
                  Quản lý tư cách thành viên
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              <!-- Quick Links -->
              <div class="space-y-3">
                <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Liên kết nhanh</h3>
                
                <!-- Thay đổi gói dịch vụ -->
                <button class="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-yellow-400 hover:bg-[#2a2a2a] transition-all flex items-center justify-between group">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3 text-gray-300 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                    </svg>
                    <span class="text-white font-medium">Thay đổi gói dịch vụ</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>

                <!-- Quản lý phương thức thanh toán -->
                <button class="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-yellow-400 hover:bg-[#2a2a2a] transition-all flex items-center justify-between group">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3 text-gray-300 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    <span class="text-white font-medium">Quản lý phương thức thanh toán</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>

                <!-- Mua thêm một suất thành viên bổ sung -->
                <button class="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-yellow-400 hover:bg-[#2a2a2a] transition-all flex items-center justify-between group">
                  <div class="flex items-center flex-1">
                    <svg class="w-5 h-5 mr-3 text-gray-300 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <div class="text-left flex-1">
                      <p class="text-white font-medium">Mua thêm một suất thành viên bổ sung</p>
                      <p class="text-gray-400 text-sm">Chia sẻ HTHREE với người không sống cùng bạn.</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">Mới</span>
                    <svg class="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>

                <!-- Quản lý quyền truy cập và thiết bị -->
                <button @click="activeSection = 'devices'" class="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-yellow-400 hover:bg-[#2a2a2a] transition-all flex items-center justify-between group">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3 text-gray-300 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-white font-medium">Quản lý quyền truy cập và thiết bị</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>

                <!-- Cập nhật mật khẩu -->
                <button @click="activeSection = 'password'" class="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-yellow-400 hover:bg-[#2a2a2a] transition-all flex items-center justify-between group">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3 text-gray-300 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <span class="text-white font-medium">Cập nhật mật khẩu</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>

                <!-- Chuyển hồ sơ -->
                <button class="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-yellow-400 hover:bg-[#2a2a2a] transition-all flex items-center justify-between group">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3 text-gray-300 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    <span class="text-white font-medium">Chuyển hồ sơ</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>

                <!-- Điều chỉnh tính năng kiểm soát của cha mẹ -->
                <button class="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-yellow-400 hover:bg-[#2a2a2a] transition-all flex items-center justify-between group">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-3 text-gray-300 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    <span class="text-white font-medium">Điều chỉnh tính năng kiểm soát của cha mẹ</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>

                <!-- Sửa cài đặt -->
                <button @click="activeSection = 'settings'" class="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-yellow-400 hover:bg-[#2a2a2a] transition-all flex items-center justify-between group">
                  <div class="flex items-center flex-1">
                    <svg class="w-5 h-5 mr-3 text-gray-300 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <div class="text-left flex-1">
                      <p class="text-white font-medium">Sửa cài đặt</p>
                      <p class="text-gray-400 text-sm">Ngôn ngữ, phụ đề, tự động phát, thông báo, quyền riêng tư và hơn thế nữa</p>
                    </div>
                  </div>
                  <svg class="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Tư cách thành viên -->
            <div v-if="activeSection === 'membership'">
              <h1 class="text-3xl font-bold text-white mb-2 tracking-tight">Tư cách thành viên</h1>
              <p class="text-gray-400 mb-8">Thông tin gói dịch vụ</p>

              <!-- Gói Cao cấp -->
              <div class="bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-700 rounded-lg p-6 mb-6">
                <h2 class="text-2xl font-bold text-white mb-2">Gói Cao cấp</h2>
                <p class="text-gray-200 mb-4">Độ phân giải video 4K với âm thanh không gian, không quảng cáo khi xem và hơn thế nữa.</p>
                
                <!-- Thay đổi gói dịch vụ -->
                <button class="w-full bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg p-4 transition-all flex items-center justify-between group mt-4">
                  <span class="text-white font-medium">Thay đổi gói dịch vụ</span>
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>

                <!-- Mua thêm một suất thành viên bổ sung -->
                <button class="w-full bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg p-4 transition-all flex items-center justify-between group mt-3">
                  <div class="text-left flex-1">
                    <p class="text-white font-medium">Mua thêm một suất thành viên bổ sung</p>
                    <p class="text-gray-300 text-sm">Chia sẻ HTHREE với người không sống cùng bạn.</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">Mới</span>
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>
              </div>

              <!-- Thông tin thanh toán -->
              <div class="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-6">
                <h3 class="text-xl font-bold text-white mb-4">Thông tin thanh toán</h3>
                
                <!-- Lần thanh toán tiếp theo -->
                <div class="mb-6">
                  <h4 class="text-white font-semibold mb-2">Lần thanh toán tiếp theo</h4>
                  <p class="text-gray-300">{{ getNextPaymentDate() }}</p>
                  <p class="text-gray-400 text-sm">Ghi nợ trực tiếp: {{ user.email }}</p>
                </div>

                <!-- Quản lý phương thức thanh toán -->
                <button class="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-gray-700 rounded-lg p-4 transition-all flex items-center justify-between group mb-3">
                  <span class="text-white font-medium">Quản lý phương thức thanh toán</span>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>

                <!-- Đổi mã quà tặng hoặc khuyến mại -->
                <button class="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-gray-700 rounded-lg p-4 transition-all flex items-center justify-between group mb-3">
                  <span class="text-white font-medium">Đổi mã quà tặng hoặc khuyến mại</span>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>

                <!-- Xem lịch sử thanh toán -->
                <button class="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-gray-700 rounded-lg p-4 transition-all flex items-center justify-between group">
                  <span class="text-white font-medium">Xem lịch sử thanh toán</span>
                  <svg class="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>

              <!-- Hủy tư cách thành viên -->
              <div class="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                <button class="w-full text-center text-red-400 hover:text-red-300 font-medium transition-colors">
                  Hủy tư cách thành viên
                </button>
              </div>
            </div>

            <!-- Bảo mật -->
            <div v-if="activeSection === 'password'">
              <h1 class="text-3xl font-bold text-white mb-8 tracking-tight">Bảo mật</h1>
              <div class="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-semibold text-white mb-4">Đổi mật khẩu</h2>
                <form @submit.prevent="changePassword" class="space-y-4 max-w-md">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Mật khẩu hiện tại</label>
                    <input type="password" v-model="passwordForm.current" class="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-500" placeholder="Nhập mật khẩu hiện tại" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Mật khẩu mới</label>
                    <input type="password" v-model="passwordForm.new" class="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-500" placeholder="Nhập mật khẩu mới" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Xác nhận mật khẩu mới</label>
                    <input type="password" v-model="passwordForm.confirm" class="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-500" placeholder="Nhập lại mật khẩu mới" />
                  </div>
                  <button type="submit" class="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition-colors">
                    Cập nhật mật khẩu
                  </button>
                </form>
              </div>
            </div>

            <!-- Thiết bị -->
            <div v-if="activeSection === 'devices'">
              <h1 class="text-3xl font-bold text-white mb-8 tracking-tight">Thiết bị</h1>
              <div class="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                <p class="text-gray-300">Quản lý các thiết bị đã đăng nhập.</p>
              </div>
            </div>

            <!-- Hỗ trợ -->
            <div v-if="activeSection === 'help'">
              <h1 class="text-3xl font-bold text-white mb-8 tracking-tight">Hỗ trợ</h1>
              <div class="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                <p class="text-gray-300">Trung tâm trợ giúp và hỗ trợ khách hàng.</p>
              </div>
            </div>

            <!-- Cài đặt -->
            <div v-if="activeSection === 'settings'">
              <h1 class="text-3xl font-bold text-white mb-8 tracking-tight">Cài đặt</h1>
              <div class="space-y-4">
                <div class="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                  <h3 class="font-semibold text-white mb-4 text-lg">Thông tin cá nhân</h3>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-1">Tên hiển thị</label>
                      <input type="text" v-model="profileForm.displayName" class="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-500" placeholder="Nhập tên hiển thị" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input type="email" :value="user.email" disabled class="w-full px-4 py-2 bg-[#2a2a2a] border border-gray-700 text-gray-400 rounded-lg cursor-not-allowed" />
                    </div>
                    <button @click="saveProfile" class="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition-colors">
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, h } from 'vue';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useToast } from '@/composables/useToast';

const auth = getAuth();
const toast = useToast();

const user = ref(null);
const loading = ref(true);
const activeSection = ref('overview');

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
});

const profileForm = reactive({
  displayName: ''
});

// Menu items with icons
const menuItems = [
  { id: 'overview', label: 'Tổng quan', icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
  ])},
  { id: 'membership', label: 'Tư cách thành viên', icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' })
  ])},
  { id: 'password', label: 'Bảo mật', icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' })
  ])},
  { id: 'devices', label: 'Thiết bị', icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
  ])},
  { id: 'help', label: 'Hỗ trợ', icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])},
  { id: 'settings', label: 'Cài đặt', icon: () => h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
  ])}
];

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    if (currentUser) {
      profileForm.displayName = currentUser.displayName || '';
    }
    loading.value = false;
  });
});

const getJoinMonth = () => {
  if (!user.value?.metadata?.creationTime) return '1/2025';
  const date = new Date(user.value.metadata.creationTime);
  return `${date.getMonth() + 1}/${date.getFullYear()}`;
};

const getNextPaymentDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return `${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
};

const saveProfile = async () => {
  if (!user.value) return;
  
  try {
    await updateProfile(user.value, {
      displayName: profileForm.displayName
    });
    toast.success('Cập nhật thông tin thành công!');
  } catch (error) {
    toast.error('Lỗi khi cập nhật thông tin: ' + error.message);
  }
};

const changePassword = () => {
  if (passwordForm.new !== passwordForm.confirm) {
    toast.error('Mật khẩu xác nhận không khớp!');
    return;
  }
  toast.info('Chức năng đổi mật khẩu đang được phát triển');
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-slide-down-bar {
  animation: slideDownBar 0.3s ease-out;
  transform-origin: top;
}

@keyframes slideDownBar {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}
</style>
