// content.js — injected into http://localhost/* by manifest.json
// Auto-fetches data from the extension and injects it into the page.

console.log('[TabMarko content.js] Injected into page');

// Auto-fetch all data from background and inject into the page
async function pushDataToPage() {
    try {
        const [tabsResp, bookmarksResp, statsResp] = await Promise.all([
            browser.runtime.sendMessage({ source: 'tabmarko-content', payload: { action: 'get_tabs' } }),
            browser.runtime.sendMessage({ source: 'tabmarko-content', payload: { action: 'get_bookmarks' } }),
            browser.runtime.sendMessage({ source: 'tabmarko-content', payload: { action: 'get_stats' } }),
        ]);

        const data = {
            tabs: tabsResp?.ok ? tabsResp.data : [],
            bookmarks: bookmarksResp?.ok ? bookmarksResp.data : [],
            stats: statsResp?.ok ? statsResp.data : {},
            ready: true,
            timestamp: Date.now(),
        };

        // Inject into page global
        window.postMessage({ type: 'TABMARKO_DATA_PUSH', data }, '*');
        console.log('[TabMarko content.js] Data pushed to page:', data.tabs.length, 'tabs,', data.bookmarks.length, 'bookmarks');
    } catch (err) {
        console.error('[TabMarko content.js] Failed to fetch data:', err);
    }
}

// Push data on page load
pushDataToPage();

// Listen for manual sync/refresh requests from the website
window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (!event.data || !event.data.type) return;

    if (event.data.type === 'TABMARKO_SYNC') {
        console.log('[TabMarko content.js] Sync requested');
        browser.runtime.sendMessage({
            source: 'tabmarko-content',
            payload: { action: 'sync_all' }
        }).catch(err => console.error('[TabMarko] Sync failed:', err));
    }

    if (event.data.type === 'TABMARKO_REFRESH') {
        console.log('[TabMarko content.js] Refresh requested');
        pushDataToPage();
    }

    if (event.data.type === 'TABMARKO_CLOSE_DUPLICATE_TABS') {
        console.log('[TabMarko content.js] Close duplicates requested');
        browser.runtime.sendMessage({
            source: 'tabmarko-content',
            payload: { action: 'close_duplicate_tabs' }
        }).then(() => pushDataToPage()).catch(err => console.error(err));
    }

    if (event.data.type === 'TABMARKO_CLOSE_TABS') {
        console.log('[TabMarko content.js] Close specific tabs requested', event.data.ids);
        browser.runtime.sendMessage({
            source: 'tabmarko-content',
            payload: { action: 'close_tabs', ids: event.data.ids }
        }).then(() => pushDataToPage()).catch(err => console.error(err));
    }

    if (event.data.type === 'TABMARKO_SCAN_LINKS') {
        console.log('[TabMarko content.js] Scan broken links requested');
        browser.runtime.sendMessage({
            source: 'tabmarko-content',
            payload: { action: 'scan_broken_links' }
        }).then(res => {
            if (res.ok) {
                window.postMessage({ type: 'TABMARKO_BROKEN_LINKS_RESULT', data: res.data }, '*');
            }
        }).catch(err => console.error(err));
    }

    if (event.data.type === 'TABMARKO_DELETE_BOOKMARKS') {
        console.log('[TabMarko content.js] Delete bookmarks requested', event.data.ids);
        browser.runtime.sendMessage({
            source: 'tabmarko-content',
            payload: { action: 'delete_bookmarks', ids: event.data.ids }
        }).then(() => pushDataToPage()).catch(err => console.error(err));
    }

    if (event.data.type === 'TABMARKO_ARCHIVE_TABS') {
        console.log('[TabMarko content.js] Archive tabs requested', event.data.ids);
        browser.runtime.sendMessage({
            source: 'tabmarko-content',
            payload: { action: 'archive_tabs', ids: event.data.ids }
        }).then(() => pushDataToPage()).catch(err => console.error(err));
    }
});
