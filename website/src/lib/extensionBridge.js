/**
 * extensionBridge.js — Reads data pushed by the TabMarko extension content script.
 * 
 * The content script auto-fetches tabs/bookmarks/stats from the extension
 * and pushes them into the page via postMessage. This module listens for
 * that data and provides it to React components.
 */

let cachedData = {
    tabs: [],
    bookmarks: [],
    stats: {},
    ready: false,
};

// Resolve any pending waiters when data arrives
let dataResolvers = [];

// Listen for data pushed by the content script
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'TABMARKO_DATA_PUSH') {
        cachedData = event.data.data;
        console.log('[extensionBridge] Received data:', cachedData.tabs.length, 'tabs,', cachedData.bookmarks.length, 'bookmarks');

        // Resolve all pending waiters
        dataResolvers.forEach(resolve => resolve(cachedData));
        dataResolvers = [];
    }
});

/**
 * Wait for extension data to be available.
 * Returns immediately if data is already cached, otherwise waits up to timeoutMs.
 */
function waitForData(timeoutMs = 3000) {
    if (cachedData.ready) {
        return Promise.resolve(cachedData);
    }

    // Proactively ask for data in case we missed the initial broadcast
    window.postMessage({ type: 'TABMARKO_REFRESH' }, '*');

    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            // Remove this resolver
            dataResolvers = dataResolvers.filter(r => r !== resolveWrapper);
            reject(new Error('Extension data not available. Make sure the TabMarko extension is installed and the page is reloaded.'));
        }, timeoutMs);

        function resolveWrapper(data) {
            clearTimeout(timer);
            resolve(data);
        }

        dataResolvers.push(resolveWrapper);
    });
}

/**
 * Fetch tabs from the extension (live browser data).
 */
export async function fetchTabs() {
    const data = await waitForData();
    return data.tabs;
}

/**
 * Fetch bookmarks from the extension (live browser data).
 */
export async function fetchBookmarks() {
    const data = await waitForData();
    return data.bookmarks;
}

/**
 * Fetch stats from the extension (tab count, bookmark count, duplicates, etc.)
 */
export async function fetchStats() {
    const data = await waitForData();
    return data.stats;
}

/**
 * Trigger a full sync (AI categorization) in the extension.
 */
export function triggerSync() {
    window.postMessage({ type: 'TABMARKO_SYNC' }, '*');
}

/**
 * Request a data refresh from the extension (no AI, just re-read browser data).
 */
export function refreshData() {
    cachedData.ready = false;
    window.postMessage({ type: 'TABMARKO_REFRESH' }, '*');
}
