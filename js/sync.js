/* ===================================================
   SUBJECTS ONLINE — Firestore Cloud Sync
   Firestore is the durable copy; localStorage is a cache
   =================================================== */

/*
  Include every Subjects Online value in localStorage, except values that
  belong to Firebase/authentication or this sync module itself. This avoids a
  brittle hand-maintained list of app keys.

  Do not add `subjectsOnlineUID` or an auth provider to this list: Firebase
  Authentication, not localStorage, decides which user may read/write data.
*/
const CLOUD_CACHE_UID_KEY = 'subjectsOnlineCloudCacheUID';
const CLOUD_SCHEMA_VERSION = 2;
const CLOUD_DEBOUNCE_MS = 1500;

let syncTimeout = null;
let isSyncingFromCloud = false;
let cloudReadyForUid = null;
let writeInProgress = false;
let syncQueuedWhileWriting = false;
let authListenerAttached = false;

function getCurrentUser() {
    if (!window.firebase || !firebase.auth) {
        console.error('☁️ [Cloud Sync] Firebase Auth is not available. Load Firebase before sync.js.');
        return null;
    }
    try {
        return firebase.auth().currentUser;
    } catch (error) {
        console.error('☁️ [Cloud Sync] Firebase has not been initialized yet. Load the Firebase config before sync.js.', error);
        return null;
    }
}

function isSystemKey(key) {
    return key === CLOUD_CACHE_UID_KEY ||
        key === 'subjectsOnlineUID' ||
        key === 'subjectsOnlineAuthProvider' ||
        key.indexOf('firebase:') === 0 ||
        key.indexOf('firebaseui::') === 0 ||
        key.indexOf('__firebase') === 0 ||
        key.indexOf('goog') === 0;
}

function shouldSyncKey(key) {
    return typeof key === 'string' && !isSystemKey(key);
}

function getLocalEntries() {
    const entries = [];

    for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (shouldSyncKey(key)) {
            entries.push({ key: key, value: localStorage.getItem(key) });
        }
    }

    return entries;
}

function getDatabase() {
    if (typeof initFirebaseDB !== 'function') {
        throw new Error('initFirebaseDB() is missing. Initialize Firebase before loading sync.js.');
    }
    return initFirebaseDB();
}

function logFirebaseError(action, error) {
    const message = error && error.message ? error.message : String(error);
    console.error('☁️ [Cloud Sync] ' + action + ' failed:', message, error);

    if (error && error.code === 'permission-denied') {
        console.error('☁️ [Cloud Sync] Check the Firestore Rules: users/{uid} must allow only request.auth.uid == uid.');
    }
}

function debouncedSyncToFirebase() {
    if (isSyncingFromCloud) return;

    const user = getCurrentUser();
    if (!user) return;

    // Never let startup writes overwrite a cloud profile before it is read.
    if (cloudReadyForUid !== user.uid) {
        console.log('☁️ [Cloud Sync] Change held until cloud data is loaded.');
        return;
    }

    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(syncToFirebase, CLOUD_DEBOUNCE_MS);
}

async function syncToFirebase() {
    const user = getCurrentUser();
    if (!user || isSyncingFromCloud || cloudReadyForUid !== user.uid) return;

    if (writeInProgress) {
        syncQueuedWhileWriting = true;
        return;
    }

    writeInProgress = true;
    const uid = user.uid;

    try {
        const entries = getLocalEntries();
        await getDatabase().collection('users').doc(uid).set({
            schemaVersion: CLOUD_SCHEMA_VERSION,
            storage: entries,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        localStorage.setItem(CLOUD_CACHE_UID_KEY, uid);
        console.log('☁️ [Cloud Sync] Saved ' + entries.length + ' local values to Firestore.');
    } catch (error) {
        logFirebaseError('Saving data', error);
    } finally {
        writeInProgress = false;
        if (syncQueuedWhileWriting) {
            syncQueuedWhileWriting = false;
            debouncedSyncToFirebase();
        }
    }
}

function entriesFromCloudDocument(data) {
    // Current format: an array preserves exact localStorage key names safely.
    if (Array.isArray(data.storage)) {
        return data.storage.filter(function (entry) {
            return entry && shouldSyncKey(entry.key) && typeof entry.value === 'string';
        });
    }

    // One-time compatibility with the old sync.js document format.
    return Object.keys(data)
        .filter(function (key) {
            return key !== 'lastUpdated' && key !== 'schemaVersion' && key !== 'storage' &&
                shouldSyncKey(key) && typeof data[key] === 'string';
        })
        .map(function (key) {
            return { key: key, value: data[key] };
        });
}

function clearAppCache() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (shouldSyncKey(key)) keys.push(key);
    }
    keys.forEach(function (key) { localStorage.removeItem(key); });
}

/*
  Public on purpose: existing Google sign-in code may keep calling
  syncFromFirebase(user.uid). The argument is ignored; the authenticated user
  from Firebase Auth is always the authority.
*/
async function syncFromFirebase() {
    const user = getCurrentUser();
    if (!user) {
        console.log('☁️ [Cloud Sync] No signed-in user; cloud download skipped.');
        return false;
    }

    const uid = user.uid;
    cloudReadyForUid = null;

    // Prevent another Google account on this browser from inheriting this
    // account's cache if the second account has no cloud document yet.
    const cachedForUid = localStorage.getItem(CLOUD_CACHE_UID_KEY);
    if (cachedForUid && cachedForUid !== uid) {
        isSyncingFromCloud = true;
        clearAppCache();
        isSyncingFromCloud = false;
    }

    try {
        console.log('☁️ [Cloud Sync] Loading cloud data for the signed-in user...');
        const snapshot = await getDatabase().collection('users').doc(uid).get();

        isSyncingFromCloud = true;
        if (snapshot.exists) {
            const entries = entriesFromCloudDocument(snapshot.data());
            // Firestore is the source of truth: remove stale cache entries too.
            clearAppCache();
            entries.forEach(function (entry) {
                localStorage.setItem(entry.key, entry.value);
            });
            console.log('☁️ [Cloud Sync] Loaded ' + entries.length + ' values from Firestore.');
        } else {
            console.log('☁️ [Cloud Sync] No cloud profile exists yet. Local cache will seed it only if it has data.');
        }

        localStorage.setItem(CLOUD_CACHE_UID_KEY, uid);
        cloudReadyForUid = uid;
        isSyncingFromCloud = false;

        // A new account with useful existing local data is seeded only after
        // Firestore confirmed that no document exists. An empty new device does
        // not create or overwrite anything.
        if (!snapshot.exists && getLocalEntries().length > 0) {
            debouncedSyncToFirebase();
        }
        return snapshot.exists;
    } catch (error) {
        isSyncingFromCloud = false;
        logFirebaseError('Loading data', error);
        return false;
    }
}

// Intercept writes made by the existing app. This affects localStorage only,
// and therefore keeps older pages working while Firestore remains durable.
(function installLocalStorageInterceptor() {
    const storagePrototype = Object.getPrototypeOf(localStorage);
    if (storagePrototype.__subjectsOnlineCloudSyncInstalled) return;

    const originalSetItem = storagePrototype.setItem;
    const originalRemoveItem = storagePrototype.removeItem;
    const originalClear = storagePrototype.clear;

    storagePrototype.setItem = function (key, value) {
        originalSetItem.apply(this, arguments);
        if (this === localStorage && shouldSyncKey(String(key))) debouncedSyncToFirebase();
    };

    storagePrototype.removeItem = function (key) {
        originalRemoveItem.apply(this, arguments);
        if (this === localStorage && shouldSyncKey(String(key))) debouncedSyncToFirebase();
    };

    storagePrototype.clear = function () {
        originalClear.apply(this, arguments);
        // Do not mirror clear() to Firestore. Browser/site-data clearing should
        // be recoverable by signing in again, not erase the cloud backup.
        if (this === localStorage) {
            cloudReadyForUid = null;
            console.warn('☁️ [Cloud Sync] localStorage.clear() was not uploaded. Reload and sign in to restore cloud data.');
        }
    };

    storagePrototype.__subjectsOnlineCloudSyncInstalled = true;
    console.log('☁️ [Cloud Sync] Local cache interceptor initialized.');
}());

// Load Firestore before allowing any post-login local edits to be uploaded.
// initFirebaseDB() must initialize Firebase (firebase.initializeApp(config))
// before it returns firebase.firestore().
function startCloudSync() {
    if (authListenerAttached) return;

    try {
        getDatabase();
        if (!firebase.apps || firebase.apps.length === 0) {
            throw new Error('initFirebaseDB() returned without calling firebase.initializeApp(firebaseConfig).');
        }
    } catch (error) {
        logFirebaseError('Starting sync', error);
        return;
    }

    authListenerAttached = true;
    firebase.auth().onAuthStateChanged(function (user) {
        clearTimeout(syncTimeout);
        cloudReadyForUid = null;
        if (user) {
            syncFromFirebase();
        } else {
            console.log('☁️ [Cloud Sync] Signed out; cloud sync paused.');
        }
    });
}

startCloudSync();

window.SubjectsOnlineCloudSync = {
    syncFromFirebase: syncFromFirebase,
    syncToFirebase: syncToFirebase
};
