/* =========================================================
   library.js — Manage Offline PDF Library
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const libraryGrid = document.getElementById('library-grid');
    const emptyState = document.getElementById('library-empty');
    const storageInfo = document.getElementById('storage-info');
    const storageDetails = document.getElementById('storage-details');

    renderLibrary();
    checkStorage();

    function renderLibrary() {
        const library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');

        if (library.length === 0) {
            libraryGrid.innerHTML = '';
            libraryGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            emptyState.classList.add('flex');
            return;
        }

        emptyState.classList.add('hidden');
        emptyState.classList.remove('flex');
        libraryGrid.classList.remove('hidden');
        libraryGrid.innerHTML = '';

        library.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-3xl p-5 border border-blue-50 relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(37,99,235,0.12)] transition-all duration-300 transform hover:-translate-y-1 material-card';
            
            // Format date
            const dateStr = new Date(item.dateAdded).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });

            card.innerHTML = `
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                
                <div class="flex items-start justify-between mb-4 relative z-10">
                    <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <button class="remove-btn text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" data-url="${item.url}" data-id="${item.id}" title="Remove from Library">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
                
                <h3 class="font-heading text-lg font-bold text-blue-950 mb-1 leading-tight relative z-10 pr-2 line-clamp-2">${item.title}</h3>
                <p class="text-xs text-gray-500 mb-5 font-medium relative z-10">Saved on ${dateStr}</p>
                
                <div class="relative z-10 pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-600">Offline PDF</span>
                    <a href="player.html?type=${item.type}&url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}" 
                       class="text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-full shadow-[0_4px_10px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_15px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all">
                       Read Now
                    </a>
                </div>
            `;

            libraryGrid.appendChild(card);

            // Animate entry if GSAP is loaded
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(card, 
                    { opacity: 0, y: 30 }, 
                    { opacity: 1, y: 0, duration: 0.6, delay: index * 0.1, ease: "back.out(1.2)" }
                );
            }
        });

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const url = e.currentTarget.dataset.url;
                const id = e.currentTarget.dataset.id;
                
                if(confirm('Remove this PDF from your offline library?')) {
                    await removeFromLibrary(url, id);
                }
            });
        });
    }

    async function removeFromLibrary(url, id) {
        // 1. Remove from localStorage
        let library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
        library = library.filter(item => item.id !== id);
        localStorage.setItem('so_offline_library', JSON.stringify(library));

        // 2. Remove from Cache
        try {
            const cache = await caches.open('offline-materials');
            await cache.delete(url);
        } catch (err) {
            console.error('Failed to remove from cache:', err);
        }

        // 3. Re-render
        renderLibrary();
        checkStorage();
    }

    async function checkStorage() {
        try {
            // Calculate exact size of saved PDFs
            let usedBytes = 0;
            const cache = await caches.open('offline-materials');
            const requests = await cache.keys();
            
            for (const req of requests) {
                const res = await cache.match(req);
                if (res) {
                    const blob = await res.blob();
                    usedBytes += blob.size;
                }
            }
            
            const usageMB = (usedBytes / (1024 * 1024)).toFixed(2);
            
            // Get total quota from browser if available
            let quotaMB = '1000'; // Default fallback
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                if (estimate.quota !== undefined) {
                    quotaMB = (estimate.quota / (1024 * 1024)).toFixed(0);
                }
            }
            
            storageInfo.classList.remove('hidden');
            storageDetails.textContent = `${usageMB} MB used of ${quotaMB} MB`;
        } catch (err) {
            console.error('Failed to get exact storage size:', err);
            storageInfo.classList.add('hidden');
        }
    }
});
