/* ===================================================
   SUBJECTS ONLINE — Firestore Cloud Sync
   =================================================== */

// Keys we want to sync to the cloud
const SYNC_KEYS = [
    'subjectsOnlineName',
    'subjectsOnlineDept',
    'subjectsOnlineAvatarTheme',
    'subjectsOnlineAvatarImage',
    'soPlannerTasks',
    'soVisits',
    'soLastOpened',
    'soCompletedSections',
    'soCompletedQuizzes',
    'soCompletedChapters',
    'soCompletedMaterials',
    'soFavorites',
    'soDarkMode'
];

let syncTimeout = null;
let isSyncingFromCloud = false;

/**
 * Pushes all monitored localStorage keys to Firestore.
 * Debounced to prevent too many writes.
 */
function debouncedSyncToFirebase() {
    // If we are currently downloading data from the cloud, don't upload it back
    if (isSyncingFromCloud) {
        console.log('☁️ [Cloud Sync] Ignored setItem because we are downloading from cloud.');
        return;
    }

    const uid = localStorage.getItem('subjectsOnlineUID');
    const provider = localStorage.getItem('subjectsOnlineAuthProvider');

    // Only sync if it's a real Google account
    if (!uid || provider !== 'google') {
        console.log('☁️ [Cloud Sync] Sync ignored. UID:', uid, 'Provider:', provider);
        return;
    }

    console.log('☁️ [Cloud Sync] Change detected! Waiting 2 seconds before upload...');

    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
        const db = initFirebaseDB();
        
        // Gather all data
        const dataToSync = {};
        SYNC_KEYS.forEach(key => {
            const val = localStorage.getItem(key);
            if (val !== null) {
                dataToSync[key] = val;
            }
        });

        // Add a timestamp
        dataToSync.lastUpdated = firebase.firestore.FieldValue.serverTimestamp();

        db.collection('users').doc(uid).set(dataToSync, { merge: true })
            .then(() => console.log('☁️ [Cloud Sync] Data saved to Firebase'))
            .catch(err => console.error('☁️ [Cloud Sync] Error saving:', err));

    }, 2000); // Wait 2 seconds after the last change before uploading
}

/**
 * Downloads data from Firestore and populates localStorage.
 * Called immediately after a successful Google Sign-In.
 */
async function syncFromFirebase(uid) {
    if (!uid) return;
    
    console.log('☁️ [Cloud Sync] Downloading user data...');
    const db = initFirebaseDB();
    
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            const data = doc.data();
            
            isSyncingFromCloud = true; // prevent interceptor from re-uploading this
            
            SYNC_KEYS.forEach(key => {
                if (data[key] !== undefined) {
                    localStorage.setItem(key, data[key]);
                }
            });
            
            isSyncingFromCloud = false;
            console.log('☁️ [Cloud Sync] Download complete!');
        } else {
            console.log('☁️ [Cloud Sync] No existing cloud data found for this user.');
            // Force an initial sync of whatever is currently local
            debouncedSyncToFirebase();
        }
    } catch (err) {
        console.error('☁️ [Cloud Sync] Error downloading data:', err);
        isSyncingFromCloud = false;
    }
}

// ── LocalStorage Interceptor ───────────────────────────────────────────────────

// Keep a reference to the original functions
const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;

// Override setItem
localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);
    if (SYNC_KEYS.includes(key)) {
        debouncedSyncToFirebase();
    }
};

// Override removeItem
localStorage.removeItem = function(key) {
    originalRemoveItem.apply(this, arguments);
    if (SYNC_KEYS.includes(key)) {
        debouncedSyncToFirebase();
    }
};

console.log('☁️ [Cloud Sync] Interceptor initialized.');
