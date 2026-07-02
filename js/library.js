/* =========================================================
   library.js — Logic for the Offline Library & Folders
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const libraryGrid = document.getElementById('library-grid');
    const emptyState = document.getElementById('library-empty');
    
    let currentFolderId = null;
    let itemToMoveId = null;
    
    // Pro Features State
    let isSelectMode = false;
    let selectedItems = new Set();
    let searchQuery = "";
    let sortMethod = "newest";
    let editingFolderId = null; // For color picker

    const colorMap = {
        'blue': { glow: 'bg-blue-500/5 group-hover:bg-blue-500/10', icon: 'bg-blue-100 text-blue-600' },
        'red': { glow: 'bg-red-500/5 group-hover:bg-red-500/10', icon: 'bg-red-100 text-red-600' },
        'emerald': { glow: 'bg-emerald-500/5 group-hover:bg-emerald-500/10', icon: 'bg-emerald-100 text-emerald-600' },
        'purple': { glow: 'bg-purple-500/5 group-hover:bg-purple-500/10', icon: 'bg-purple-100 text-purple-600' },
        'amber': { glow: 'bg-amber-500/5 group-hover:bg-amber-500/10', icon: 'bg-amber-100 text-amber-600' }
    };

    // DOM Elements
    const libraryTitle = document.getElementById('library-title');
    const btnNewFolder = document.getElementById('btn-new-folder');
    const btnBackFolder = document.getElementById('btn-back-folder');
    const btnSelectMode = document.getElementById('btn-select-mode');
    
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    
    // Modals
    const moveModal = document.getElementById('move-modal');
    const moveModalContent = document.getElementById('move-modal-content');
    const closeMoveModalBtn = document.getElementById('close-move-modal');
    const cancelMoveBtn = document.getElementById('cancel-move-btn');
    const confirmMoveBtn = document.getElementById('confirm-move-btn');
    const moveFolderSelect = document.getElementById('move-folder-select');

    const colorModal = document.getElementById('color-modal');
    const colorModalContent = document.getElementById('color-modal-content');
    const closeColorModalBtn = document.getElementById('close-color-modal');
    
    const storageModal = document.getElementById('storage-modal');
    const storageModalContent = document.getElementById('storage-modal-content');
    const closeStorageModalBtn = document.getElementById('close-storage-modal');
    
    const bulkActionBar = document.getElementById('bulk-action-bar');
    const selectedCountText = document.getElementById('selected-count');
    const btnCancelSelect = document.getElementById('btn-cancel-select');
    const btnBulkMove = document.getElementById('btn-bulk-move');
    const btnBulkDelete = document.getElementById('btn-bulk-delete');

    renderLibrary();
    checkStorage();

    // ── Search & Sort ──
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderLibrary();
    });

    sortSelect.addEventListener('change', (e) => {
        sortMethod = e.target.value;
        renderLibrary();
    });

    // ── Select Mode & Bulk Actions ──
    btnSelectMode.addEventListener('click', () => {
        isSelectMode = true;
        selectedItems.clear();
        renderLibrary();
        showBulkActionBar();
    });

    btnCancelSelect.addEventListener('click', () => {
        isSelectMode = false;
        selectedItems.clear();
        renderLibrary();
        hideBulkActionBar();
    });

    btnBulkDelete.addEventListener('click', async () => {
        if(selectedItems.size === 0) return;
        if(confirm(`Delete ${selectedItems.size} selected items? Folders will be deleted and their contents moved to root.`)) {
            // Process deletes
            let library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
            let folders = JSON.parse(localStorage.getItem('so_offline_folders') || '[]');
            const cache = await caches.open('offline-materials');

            for (let id of selectedItems) {
                // Is it a folder?
                const folderIdx = folders.findIndex(f => f.id === id);
                if (folderIdx !== -1) {
                    folders.splice(folderIdx, 1);
                    library.forEach(item => { if (item.folderId === id) item.folderId = null; });
                    continue;
                }
                
                // Is it a PDF?
                const itemIdx = library.findIndex(i => i.id === id);
                if (itemIdx !== -1) {
                    try { await cache.delete(library[itemIdx].url); } catch (e) {}
                    library.splice(itemIdx, 1);
                }
            }
            
            localStorage.setItem('so_offline_folders', JSON.stringify(folders));
            localStorage.setItem('so_offline_library', JSON.stringify(library));
            
            isSelectMode = false;
            selectedItems.clear();
            hideBulkActionBar();
            renderLibrary();
            checkStorage();
        }
    });

    btnBulkMove.addEventListener('click', () => {
        if(selectedItems.size === 0) return;
        // Only allow moving PDFs (folders can't be moved inside folders right now)
        const hasFolderSelected = Array.from(selectedItems).some(id => id.startsWith('folder_'));
        if (hasFolderSelected) {
            alert('Cannot move folders. Please select only PDFs to move.');
            return;
        }
        openMoveModal(null, true); // true = bulk mode
    });

    function showBulkActionBar() {
        btnSelectMode.classList.add('hidden');
        bulkActionBar.classList.remove('translate-y-full');
        updateBulkCount();
    }
    
    function hideBulkActionBar() {
        btnSelectMode.classList.remove('hidden');
        bulkActionBar.classList.add('translate-y-full');
    }

    function updateBulkCount() {
        selectedCountText.textContent = `${selectedItems.size} Selected`;
    }

    // ── Folder Navigation & Creation ──
    btnBackFolder.addEventListener('click', () => {
        currentFolderId = null;
        isSelectMode = false;
        hideBulkActionBar();
        renderLibrary();
    });

    btnNewFolder.addEventListener('click', () => {
        const folderName = prompt('Enter folder name:');
        if (folderName && folderName.trim()) {
            const newId = 'folder_' + Date.now();
            const folders = JSON.parse(localStorage.getItem('so_offline_folders') || '[]');
            folders.push({
                id: newId,
                title: folderName.trim(),
                dateAdded: new Date().toISOString(),
                color: 'blue',
                isPinned: false
            });
            localStorage.setItem('so_offline_folders', JSON.stringify(folders));
            renderLibrary();
            openColorModal(newId);
        }
    });

    // ── Color Modal ──
    function openColorModal(folderId) {
        editingFolderId = folderId;
        colorModal.classList.remove('hidden');
        colorModal.classList.add('flex');
        setTimeout(() => {
            colorModalContent.classList.remove('scale-95', 'opacity-0');
            colorModalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
    
    function closeColorModal() {
        colorModalContent.classList.remove('scale-100', 'opacity-100');
        colorModalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            colorModal.classList.add('hidden');
            colorModal.classList.remove('flex');
            editingFolderId = null;
        }, 300);
    }
    
    closeColorModalBtn.addEventListener('click', closeColorModal);
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const color = e.target.dataset.color;
            if (editingFolderId) {
                const folders = JSON.parse(localStorage.getItem('so_offline_folders') || '[]');
                const f = folders.find(f => f.id === editingFolderId);
                if (f) {
                    f.color = color;
                    localStorage.setItem('so_offline_folders', JSON.stringify(folders));
                    renderLibrary();
                }
            }
            closeColorModal();
        });
    });

    // ── Storage Modal ──
    document.getElementById('storage-info').addEventListener('click', () => {
        storageModal.classList.remove('hidden');
        storageModal.classList.add('flex');
        setTimeout(() => {
            storageModalContent.classList.remove('scale-95', 'opacity-0');
            storageModalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
        populateStorageModal();
    });
    
    function closeStorageModal() {
        storageModalContent.classList.remove('scale-100', 'opacity-100');
        storageModalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            storageModal.classList.add('hidden');
            storageModal.classList.remove('flex');
        }, 300);
    }
    closeStorageModalBtn.addEventListener('click', closeStorageModal);

    async function populateStorageModal() {
        const list = document.getElementById('storage-file-list');
        list.innerHTML = '<div class="text-center text-gray-500 py-4"><svg class="animate-spin h-5 w-5 mx-auto mb-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Analyzing files...</div>';
        
        let library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
        if (library.length === 0) {
            list.innerHTML = '<p class="text-gray-500 text-sm text-center">No offline files found.</p>';
            return;
        }

        // Sort by oldest first
        library.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
        
        list.innerHTML = '';
        for (const item of library) {
            const dateStr = new Date(item.dateAdded).toLocaleDateString();
            const div = document.createElement('div');
            div.className = "flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100";
            div.innerHTML = `
                <div class="flex flex-col truncate pr-4">
                    <span class="text-sm font-bold text-gray-800 truncate">${item.title}</span>
                    <span class="text-xs text-gray-500">Saved: ${dateStr} ${item.isRead ? '<span class="text-emerald-500 ml-1 font-bold">✓ Read</span>' : ''}</span>
                </div>
                <button class="shrink-0 text-red-500 hover:bg-red-50 p-2 rounded-lg text-xs font-bold transition-colors" onclick="window.deleteSingleFile('${item.url}', '${item.id}')">Delete</button>
            `;
            list.appendChild(div);
        }
    }

    window.deleteSingleFile = async (url, id) => {
        if(confirm("Delete this file to free up space?")) {
            await removeFromLibrary(url, id);
            populateStorageModal(); // Refresh list
        }
    };

    // ── Move Modal Logic ──
    let isBulkMove = false;
    function openMoveModal(itemId, bulk = false) {
        itemToMoveId = itemId;
        isBulkMove = bulk;
        const folders = JSON.parse(localStorage.getItem('so_offline_folders') || '[]');
        
        moveFolderSelect.innerHTML = '<option value="root">Root (My Library)</option>';
        folders.forEach(f => {
            moveFolderSelect.innerHTML += `<option value="${f.id}">${f.title}</option>`;
        });
        
        if (!bulk) {
            const library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
            const item = library.find(i => i.id === itemId);
            if (item) moveFolderSelect.value = item.folderId || 'root';
        }

        moveModal.classList.remove('hidden');
        moveModal.classList.add('flex');
        setTimeout(() => {
            moveModalContent.classList.remove('scale-95', 'opacity-0');
            moveModalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    }

    function closeMoveModal() {
        moveModalContent.classList.remove('scale-100', 'opacity-100');
        moveModalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            moveModal.classList.add('hidden');
            moveModal.classList.remove('flex');
            itemToMoveId = null;
        }, 300);
    }

    closeMoveModalBtn.addEventListener('click', closeMoveModal);
    cancelMoveBtn.addEventListener('click', closeMoveModal);
    
    confirmMoveBtn.addEventListener('click', () => {
        const targetFolderId = moveFolderSelect.value === 'root' ? null : moveFolderSelect.value;
        if (isBulkMove) {
            let library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
            selectedItems.forEach(id => {
                const item = library.find(i => i.id === id);
                if (item) item.folderId = targetFolderId;
            });
            localStorage.setItem('so_offline_library', JSON.stringify(library));
            isSelectMode = false;
            selectedItems.clear();
            hideBulkActionBar();
            renderLibrary();
        } else if (itemToMoveId) {
            moveLibraryItem(itemToMoveId, targetFolderId);
        }
        closeMoveModal();
    });

    // ── Main Render Function ──
    function renderLibrary() {
        let library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
        let folders = JSON.parse(localStorage.getItem('so_offline_folders') || '[]');

        // Filter by Folder
        let currentItems = library.filter(item => (item.folderId || null) === currentFolderId);
        let currentFolders = currentFolderId === null ? folders : [];

        // Apply Search
        if (searchQuery) {
            currentItems = currentItems.filter(i => i.title.toLowerCase().includes(searchQuery));
            currentFolders = currentFolders.filter(f => f.title.toLowerCase().includes(searchQuery));
        }

        // Apply Sort & Pinned
        const sortFn = (a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            if (sortMethod === 'newest') return new Date(b.dateAdded) - new Date(a.dateAdded);
            if (sortMethod === 'oldest') return new Date(a.dateAdded) - new Date(b.dateAdded);
            if (sortMethod === 'az') return a.title.localeCompare(b.title);
            if (sortMethod === 'za') return b.title.localeCompare(a.title);
            return 0;
        };

        currentItems.sort(sortFn);
        currentFolders.sort(sortFn);

        // Update Title
        if (currentFolderId === null) {
            libraryTitle.textContent = 'My Library';
            btnBackFolder.classList.add('hidden');
            btnBackFolder.classList.remove('flex');
            btnNewFolder.classList.remove('hidden');
            btnNewFolder.classList.add('flex');
        } else {
            const currentFolder = folders.find(f => f.id === currentFolderId);
            libraryTitle.textContent = currentFolder ? currentFolder.title : 'My Library';
            btnBackFolder.classList.remove('hidden');
            btnBackFolder.classList.add('flex');
            btnNewFolder.classList.add('hidden');
            btnNewFolder.classList.remove('flex');
        }

        const isRootEmpty = (currentFolderId === null && currentFolders.length === 0 && currentItems.length === 0);
        const isFolderEmpty = (currentFolderId !== null && currentItems.length === 0);

        if ((isRootEmpty || isFolderEmpty) && !searchQuery) {
            libraryGrid.innerHTML = '';
            libraryGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
            emptyState.classList.add('flex');
            
            if(isFolderEmpty) {
                emptyState.querySelector('h2').textContent = 'This folder is empty';
                emptyState.querySelector('p').textContent = 'Move PDFs here from your main library.';
                emptyState.querySelector('a').classList.add('hidden');
            } else {
                emptyState.querySelector('h2').textContent = 'Your library is empty';
                emptyState.querySelector('p').textContent = 'Open any PDF material and click "Save Offline" to add it here.';
                emptyState.querySelector('a').classList.remove('hidden');
            }
            return;
        }

        emptyState.classList.add('hidden');
        emptyState.classList.remove('flex');
        libraryGrid.classList.remove('hidden');
        libraryGrid.innerHTML = '';

        let delayIndex = 0;

        // Render Folders
        currentFolders.forEach((folder) => {
            const card = document.createElement('div');
            const isSelected = selectedItems.has(folder.id);
            const ringClass = isSelected ? 'ring-4 ring-blue-500 border-transparent' : 'border border-blue-50';
            card.className = `bg-white rounded-3xl p-5 ${ringClass} relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(37,99,235,0.12)] transition-all duration-300 transform hover:-translate-y-1 material-card cursor-pointer`;
            card.dataset.id = folder.id;
            card.dataset.type = 'folder';
            
            const itemCount = library.filter(i => i.folderId === folder.id).length;
            const colors = colorMap[folder.color || 'blue'];
            const pinIconColor = folder.isPinned ? 'text-amber-500 fill-amber-500' : 'text-gray-300 group-hover:text-amber-400';

            let actionIcons = '';
            if (isSelectMode) {
                actionIcons = `
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}">
                        ${isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' : ''}
                    </div>
                `;
            } else {
                actionIcons = `
                    <button class="pin-folder-btn ${pinIconColor} transition-colors p-2 rounded-full hover:bg-gray-50" data-id="${folder.id}" title="Pin/Unpin">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </button>
                    <button class="rename-folder-btn text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50" data-id="${folder.id}" title="Edit Folder">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button class="remove-folder-btn text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" data-id="${folder.id}" title="Delete Folder">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                `;
            }

            card.innerHTML = `
                <div class="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl transition-colors ${colors.glow}"></div>
                <div class="flex items-start justify-between mb-4 relative z-10">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${colors.icon}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                    </div>
                    <div class="flex items-center gap-1" onclick="event.stopPropagation()">
                        ${actionIcons}
                    </div>
                </div>
                <h3 class="font-heading text-lg font-bold text-blue-950 mb-1 leading-tight relative z-10 pr-2 line-clamp-2">${folder.title}</h3>
                <p class="text-xs text-gray-500 font-medium relative z-10">${itemCount} Items</p>
            `;

            card.addEventListener('click', () => {
                if (isSelectMode) {
                    toggleSelection(folder.id);
                } else {
                    currentFolderId = folder.id;
                    renderLibrary();
                }
            });

            libraryGrid.appendChild(card);
            animateCard(card, delayIndex++);
        });

        // Render PDFs
        currentItems.forEach((item) => {
            const card = document.createElement('div');
            const isSelected = selectedItems.has(item.id);
            const ringClass = isSelected ? 'ring-4 ring-blue-500 border-transparent' : 'border border-blue-50';
            card.className = `bg-white rounded-3xl p-5 ${ringClass} relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(37,99,235,0.12)] transition-all duration-300 transform hover:-translate-y-1 material-card cursor-pointer`;
            card.dataset.id = item.id;
            card.dataset.type = 'pdf';
            
            const dateStr = new Date(item.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const pinIconColor = item.isPinned ? 'text-amber-500 fill-amber-500' : 'text-gray-300 group-hover:text-amber-400';
            
            let badgeHtml = item.isRead 
                ? `<span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>Read</span>`
                : `<span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-600">Offline PDF</span>`;

            let actionIcons = '';
            if (isSelectMode) {
                actionIcons = `
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}">
                        ${isSelected ? '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' : ''}
                    </div>
                `;
            } else {
                actionIcons = `
                    <button class="pin-btn ${pinIconColor} transition-colors p-2 rounded-full hover:bg-gray-50" data-id="${item.id}" title="Pin/Unpin">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </button>
                    <button class="move-btn text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50" data-id="${item.id}" title="Move to Folder">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                    </button>
                    <button class="rename-btn text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50" data-id="${item.id}" title="Rename">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button class="remove-btn text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" data-url="${item.url}" data-id="${item.id}" title="Remove from Library">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                `;
            }

            let readAction = isSelectMode ? '' : `
                <a href="player.html?type=${item.type}&url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}" 
                   class="read-now-link text-sm font-semibold text-white bg-blue-600 px-4 py-2 rounded-full shadow-[0_4px_10px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_15px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 transition-all"
                   data-id="${item.id}">Read Now</a>
            `;

            card.innerHTML = `
                <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                <div class="flex items-start justify-between mb-4 relative z-10">
                    <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <div class="flex items-center gap-1" onclick="event.stopPropagation()">
                        ${actionIcons}
                    </div>
                </div>
                
                <div class="title-display relative z-10" data-id="${item.id}">
                    <h3 class="font-heading text-lg font-bold text-blue-950 mb-1 leading-tight pr-2 line-clamp-2">${item.title}</h3>
                </div>
                <div class="title-edit relative z-10 hidden" data-id="${item.id}" onclick="event.stopPropagation()">
                    <input type="text" value="${item.title.replace(/"/g, '&quot;')}" class="w-full bg-blue-50/80 border-2 border-blue-300 text-blue-950 font-heading font-bold text-base rounded-xl px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" maxlength="120" />
                    <div class="flex items-center gap-2 mb-1">
                        <button class="save-rename-btn bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors" data-id="${item.id}">Save</button>
                        <button class="cancel-rename-btn text-gray-500 hover:text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors" data-id="${item.id}">Cancel</button>
                    </div>
                </div>

                <p class="text-xs text-gray-500 mb-5 font-medium relative z-10">Saved on ${dateStr}</p>
                
                <div class="relative z-10 pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    ${badgeHtml}
                    ${readAction}
                </div>
            `;

            card.addEventListener('click', (e) => {
                if (isSelectMode) {
                    toggleSelection(item.id);
                } else {
                    // Navigate if they clicked the card and not a button
                    if (!e.target.closest('button') && !e.target.closest('a') && !e.target.closest('.title-edit')) {
                        window.location.href = `player.html?type=${item.type}&url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}`;
                    }
                }
            });

            libraryGrid.appendChild(card);
            animateCard(card, delayIndex++);
        });

        attachEventListeners();
    }

    function toggleSelection(id) {
        if (selectedItems.has(id)) selectedItems.delete(id);
        else selectedItems.add(id);
        renderLibrary();
        updateBulkCount();
    }

    function animateCard(card, index) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 0.6, delay: index * 0.05, ease: "back.out(1.2)" }
            );
        }
    }

    // ── Event Listeners Attachment ──
    function attachEventListeners() {
        if (isSelectMode) return; // Disable standard actions in select mode
        
        // Pinning
        document.querySelectorAll('.pin-btn, .pin-folder-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const isFolder = e.currentTarget.classList.contains('pin-folder-btn');
                const key = isFolder ? 'so_offline_folders' : 'so_offline_library';
                let items = JSON.parse(localStorage.getItem(key) || '[]');
                const item = items.find(i => i.id === id);
                if (item) {
                    item.isPinned = !item.isPinned;
                    localStorage.setItem(key, JSON.stringify(items));
                    renderLibrary();
                }
            });
        });

        // PDF Remove
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if(confirm('Remove this PDF from your offline library?')) {
                    await removeFromLibrary(e.currentTarget.dataset.url, e.currentTarget.dataset.id);
                }
            });
        });

        // Folder Remove
        document.querySelectorAll('.remove-folder-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if(confirm('Delete this folder? PDFs inside will be moved back to the main library.')) {
                    deleteFolder(e.currentTarget.dataset.id);
                }
            });
        });

        // Folder Edit / Rename / Color
        document.querySelectorAll('.rename-folder-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const folders = JSON.parse(localStorage.getItem('so_offline_folders') || '[]');
                const folder = folders.find(f => f.id === id);
                if (folder) {
                    const newName = prompt('Enter new folder name:', folder.title);
                    if (newName && newName.trim()) {
                        folder.title = newName.trim();
                        localStorage.setItem('so_offline_folders', JSON.stringify(folders));
                    }
                    // Offer to change color too
                    openColorModal(id);
                }
            });
        });

        // PDF Move
        document.querySelectorAll('.move-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openMoveModal(e.currentTarget.dataset.id, false);
            });
        });

        // PDF Rename
        document.querySelectorAll('.rename-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const card = e.currentTarget.closest('.material-card');
                card.querySelector(`.title-display[data-id="${id}"]`).classList.add('hidden');
                card.querySelector(`.title-edit[data-id="${id}"]`).classList.remove('hidden');
                const input = card.querySelector(`.title-edit[data-id="${id}"] input`);
                input.focus();
                input.select();
            });
        });

        // PDF Save Rename
        document.querySelectorAll('.save-rename-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const input = e.currentTarget.closest('.title-edit').querySelector('input');
                if (input.value.trim()) renameLibraryItem(id, input.value.trim());
            });
        });

        // PDF Cancel Rename
        document.querySelectorAll('.cancel-rename-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.dataset.id;
                const card = e.currentTarget.closest('.material-card');
                card.querySelector(`.title-edit[data-id="${id}"]`).classList.add('hidden');
                card.querySelector(`.title-display[data-id="${id}"]`).classList.remove('hidden');
            });
        });

        document.querySelectorAll('.title-edit input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                const id = input.closest('.title-edit').dataset.id;
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (input.value.trim()) renameLibraryItem(id, input.value.trim());
                } else if (e.key === 'Escape') {
                    const card = input.closest('.material-card');
                    card.querySelector(`.title-edit[data-id="${id}"]`).classList.add('hidden');
                    card.querySelector(`.title-display[data-id="${id}"]`).classList.remove('hidden');
                }
            });
            input.addEventListener('click', e => e.stopPropagation());
        });
    }

    // ── Data Management Functions ──
    async function removeFromLibrary(url, id) {
        let library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
        library = library.filter(item => item.id !== id);
        localStorage.setItem('so_offline_library', JSON.stringify(library));

        try {
            const cache = await caches.open('offline-materials');
            await cache.delete(url);
        } catch (err) {}

        renderLibrary();
        checkStorage();
    }

    function renameLibraryItem(id, newTitle) {
        let library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
        const item = library.find(item => item.id === id);
        if (item) {
            item.title = newTitle;
            localStorage.setItem('so_offline_library', JSON.stringify(library));
            renderLibrary();
        }
    }

    function moveLibraryItem(id, folderId) {
        let library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
        const item = library.find(item => item.id === id);
        if (item) {
            item.folderId = folderId;
            localStorage.setItem('so_offline_library', JSON.stringify(library));
            renderLibrary();
        }
    }

    function deleteFolder(folderId) {
        let folders = JSON.parse(localStorage.getItem('so_offline_folders') || '[]');
        folders = folders.filter(f => f.id !== folderId);
        localStorage.setItem('so_offline_folders', JSON.stringify(folders));

        let library = JSON.parse(localStorage.getItem('so_offline_library') || '[]');
        library.forEach(item => { if (item.folderId === folderId) item.folderId = null; });
        localStorage.setItem('so_offline_library', JSON.stringify(library));

        renderLibrary();
    }

    async function checkStorage() {
        try {
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
            let quotaMB = '1000';
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                if (estimate.quota !== undefined) {
                    quotaMB = (estimate.quota / (1024 * 1024)).toFixed(0);
                }
            }
            
            document.getElementById('storage-info').classList.remove('hidden');
            document.getElementById('storage-details').textContent = `${usageMB} MB / ${quotaMB} MB`;
            document.getElementById('storage-modal-used').textContent = `${usageMB} MB`;
            
            const percent = Math.min(100, (usedBytes / (quotaMB * 1024 * 1024)) * 100);
            document.getElementById('storage-progress-bar').style.width = `${percent}%`;
            
        } catch (err) {
            document.getElementById('storage-info').classList.add('hidden');
        }
    }
});
