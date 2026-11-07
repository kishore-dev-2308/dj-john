/**
 * DJ John - Dynamic Event Gallery & Video Showcase
 * Handles category filtering, fullscreen photo/video modal lightbox,
 * and browser-based instant photo & video upload with local persistence.
 */

(function () {
  'use strict';

  let activeFilter = 'all';
  let galleryItems = [];

  /**
   * Load manifest items (local files and curated samples)
   */
  function loadAllMedia() {
    galleryItems = (window.DJ_GALLERY_ITEMS && Array.isArray(window.DJ_GALLERY_ITEMS))
      ? window.DJ_GALLERY_ITEMS
      : [];
  }

  /**
   * Render gallery grid items based on active filter
   */
  function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    loadAllMedia();

    const filtered = galleryItems.filter((item) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'video') return item.type === 'video';
      return item.category === activeFilter;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-16 text-center glass-card rounded-3xl border border-white/10 p-8">
          <i class="fa-solid fa-photo-film text-4xl text-gray-500 mb-3 block"></i>
          <p class="text-gray-300 font-syne font-bold text-lg">No media found in this category.</p>
          <p class="text-gray-400 text-xs mt-1">Check back soon for more live event highlights!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map((item, index) => {
        const isVideo = item.type === 'video';
        const badgeColor =
          item.category === 'wedding'
            ? 'bg-brand-pink/20 text-brand-pink border-brand-pink/30'
            : item.category === 'birthday'
            ? 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30'
            : item.category === 'parties'
            ? 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30'
            : 'bg-purple-500/20 text-purple-400 border-purple-500/30';

        const categoryLabel =
          item.category === 'wedding'
            ? 'Wedding'
            : item.category === 'birthday'
            ? 'Birthday'
            : item.category === 'parties'
            ? 'Club & Party'
            : 'Celebration';

        return `
          <div class="glass-card glass-card-hover rounded-2xl overflow-hidden border border-white/10 flex flex-col group cursor-pointer transition-all duration-300" onclick="openMediaModal('${item.id}')">
            <!-- Media Poster / Image Container -->
            <div class="relative w-full aspect-[16/10] overflow-hidden bg-black/60 flex items-center justify-center">
              ${
                isVideo
                  ? `
                  <img src="${item.poster || item.src}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" onerror="this.src='https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'">
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div class="w-13 h-13 rounded-full bg-brand-yellow text-brand-dark flex items-center justify-center text-lg pl-1 shadow-neon-yellow group-hover:scale-110 transition-transform">
                      <i class="fa-solid fa-play"></i>
                    </div>
                  </div>
                  <span class="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 border border-white/20 text-[10px] font-mono font-bold text-white flex items-center gap-1">
                    <i class="fa-solid fa-video text-brand-pink"></i> VIDEO CLIP
                  </span>
                  `
                  : `
                  <img src="${item.src}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span class="text-xs text-brand-yellow font-bold flex items-center gap-1.5">
                      <i class="fa-solid fa-expand"></i> View Fullscreen
                    </span>
                  </div>
                  `
              }
              
              <!-- Category Pill -->
              <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${badgeColor}">
                ${categoryLabel}
              </span>
            </div>

            <!-- Card Meta Details -->
            <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 class="font-syne font-bold text-white text-base group-hover:text-brand-yellow transition-colors line-clamp-1">
                  ${item.title}
                </h4>
                <p class="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  ${item.caption || 'Live celebration powered by DJ John.'}
                </p>
              </div>

              <div class="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                <span class="flex items-center gap-1.5">
                  <i class="fa-solid ${isVideo ? 'fa-film text-brand-pink' : 'fa-camera text-brand-yellow'}"></i>
                  ${isVideo ? 'Live Video' : 'Event Photo'}
                </span>
                <span class="text-brand-yellow font-bold group-hover:translate-x-1 transition-transform">
                  View <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </span>
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  /**
   * Filter Tab Switcher
   */
  function setGalleryFilter(filterName) {
    activeFilter = filterName;
    document.querySelectorAll('.gallery-filter-btn').forEach((btn) => {
      const btnFilter = btn.getAttribute('data-filter');
      if (btnFilter === filterName) {
        btn.className =
          'gallery-filter-btn px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-brand-yellow text-brand-dark shadow-neon-yellow transition active:scale-95';
      } else {
        btn.className =
          'gallery-filter-btn px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider glass-card text-gray-300 hover:text-white hover:border-white/20 transition active:scale-95';
      }
    });
    renderGallery();
  }

  /**
   * Modal Lightbox (Photo & Video Player)
   */
  function openMediaModal(itemId) {
    const item = galleryItems.find((i) => i.id === itemId);
    if (!item) return;

    const modal = document.getElementById('mediaModal');
    const content = document.getElementById('mediaModalContent');
    if (!modal || !content) return;

    const isVideo = item.type === 'video';

    content.innerHTML = `
      <div class="relative w-full max-w-4xl bg-brand-card rounded-3xl border border-white/15 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <!-- Top bar with title and close button -->
        <div class="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/60">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full ${isVideo ? 'bg-brand-pink' : 'bg-brand-yellow'} animate-pulse"></span>
            <h3 class="font-syne font-bold text-white text-base sm:text-lg line-clamp-1">${item.title}</h3>
          </div>
          <button onclick="closeMediaModal()" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 flex items-center justify-center transition" aria-label="Close Preview">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Media Display Body -->
        <div class="flex-1 bg-black flex items-center justify-center overflow-hidden relative min-h-[300px]">
          ${
            isVideo
              ? `
              <video src="${item.src}" controls autoplay playsinline class="w-full max-h-[65vh] object-contain" poster="${item.poster || ''}">
                Your browser does not support HTML5 video.
              </video>
              `
              : `
              <img src="${item.src}" alt="${item.title}" class="w-full max-h-[65vh] object-contain">
              `
          }
        </div>

        <!-- Bottom Caption & Actions -->
        <div class="p-4 sm:p-5 border-t border-white/10 bg-[#0d0f19] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <p class="text-gray-300 leading-relaxed max-w-2xl">${item.caption || 'Event powered by DJ John'}</p>
          <a href="https://wa.me/917358830098?text=Hi%20DJ%20John,%20I%20saw%20your%20event%20sample%20('${encodeURIComponent(item.title)}')%20and%20would%20like%20similar%20sound%20and%20setup!" target="_blank" rel="noopener noreferrer" class="whitespace-nowrap px-4 py-2 rounded-xl bg-brand-yellow text-brand-dark font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-neon-yellow hover:bg-yellow-300 transition">
            <i class="fa-brands fa-whatsapp text-sm"></i> Inquire About This Setup
          </a>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeMediaModal() {
    const modal = document.getElementById('mediaModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';

    // Stop any playing video
    const video = modal.querySelector('video');
    if (video) video.pause();
  }

  // Bind to global window
  window.setGalleryFilter = setGalleryFilter;
  window.openMediaModal = openMediaModal;
  window.closeMediaModal = closeMediaModal;

  document.addEventListener('DOMContentLoaded', () => {
    renderGallery();

    // Close modal on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMediaModal();
      }
    });
  });
})();
