import { callAiCategorizer, saveTabAiMeta, callEmbedAndSearch, saveBookmarkAiMeta, clearUserTabs } from '../lib/supabaseClient.js';
import { syncTabs, syncBookmarks, isWebTab } from '../lib/sync.js';

/* ── helpers ───────────────────────────────────────────────── */

function normalizeTabUrl(url) {
  if (!isWebTab(url)) return '';
  return url.split('?')[0].replace(/\/$/, '');
}

async function openOrReloadDashboard(path) {
  try {
    const allTabs = await browser.tabs.query({});
    const match = allTabs.find(t => t.url && t.url.includes('localhost:5173'));
    if (match) {
      await browser.tabs.reload(match.id);
      await browser.tabs.update(match.id, { active: true });
    } else {
      await browser.tabs.create({ url: `http://localhost:5173${path}` });
    }
  } catch (err) {
    console.error('Dashboard redirect failed:', err);
    await browser.tabs.create({ url: `http://localhost:5173${path}` });
  }
}

/* ── main ──────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    /* ── Tab / Bookmark view switcher ── */
    const btnTabs = document.getElementById('tab-tabs');
    const btnBookmarks = document.getElementById('tab-bookmarks');
    const viewTabs = document.getElementById('view-tabs');
    const viewBookmarks = document.getElementById('view-bookmarks');
    const btnTheme = document.getElementById('btn-theme');
    const iconMoon = document.getElementById('icon-moon');
    const iconSun = document.getElementById('icon-sun');

    // Theme logic
    const setTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark');
            iconMoon.style.display = 'none';
            iconSun.style.display = 'block';
            localStorage.setItem('tabmarko_ext_theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            iconMoon.style.display = 'block';
            iconSun.style.display = 'none';
            localStorage.setItem('tabmarko_ext_theme', 'light');
        }
    };

    const storedTheme = localStorage.getItem('tabmarko_ext_theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setTheme(true);
    }

    btnTheme.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');
        setTheme(!isDark);
    });

    btnTabs.addEventListener('click', () => {
      btnTabs.classList.add('active');
      btnBookmarks.classList.remove('active');
      viewTabs.classList.add('active');
      viewBookmarks.classList.remove('active');
    });

    btnBookmarks.addEventListener('click', () => {
      btnBookmarks.classList.add('active');
      btnTabs.classList.remove('active');
      viewBookmarks.classList.add('active');
      viewTabs.classList.remove('active');
    });

    /* ── Navigation buttons ── */
    document.getElementById('btn-home').addEventListener('click', () => {
      browser.tabs.create({ url: 'http://localhost:5173' });
    });

    document.getElementById('btn-search-bookmark').addEventListener('click', () => {
      browser.tabs.create({ url: 'http://localhost:5173/bookmarks' });
    });

    /* ── Sync button (top bar) ── */
    const btnSync = document.getElementById('btn-sync');
    if (btnSync) {
      btnSync.addEventListener('click', async () => {
        btnSync.style.opacity = '0.5';
        btnSync.style.pointerEvents = 'none';
        try {
          await syncTabs();
          await syncBookmarks();
          await openOrReloadDashboard('/dashboard');
        } catch (e) {
          console.error('Sync failed:', e);
        } finally {
          btnSync.style.opacity = '1';
          btnSync.style.pointerEvents = '';
        }
      });
    }

    /* ── Group Tabs button ── */
    const btnGroupTabs = document.getElementById('btn-group-tabs');
    if (btnGroupTabs) {
      btnGroupTabs.addEventListener('click', async () => {
        const titleEl = btnGroupTabs.querySelector('.action-title');
        const originalTitle = titleEl.textContent;

        btnGroupTabs.setAttribute('aria-busy', 'true');
        titleEl.textContent = 'Categorizing...';

        try {
          const results = await syncTabs();
          titleEl.textContent = `Saved ${results.length} tabs`;
          await openOrReloadDashboard('/tabs');
        } catch (error) {
          console.error('Failed to group tabs:', error);
          titleEl.textContent = 'Try Again';
        } finally {
          btnGroupTabs.removeAttribute('aria-busy');
          setTimeout(() => { titleEl.textContent = originalTitle; }, 2000);
        }
      });
    }

    /* ── Group Bookmarks button ── */
    const btnGroupBookmarks = document.getElementById('btn-group-bookmarks');
    if (btnGroupBookmarks) {
      btnGroupBookmarks.addEventListener('click', async () => {
        const titleEl = btnGroupBookmarks.querySelector('.action-title');
        const originalTitle = titleEl.textContent;

        btnGroupBookmarks.setAttribute('aria-busy', 'true');
        titleEl.textContent = 'Categorizing...';

        try {
          const results = await syncBookmarks();
          titleEl.textContent = `Saved ${results.length} bookmarks`;
          await openOrReloadDashboard('/bookmarks');
        } catch (error) {
          console.error('Failed to group bookmarks:', error);
          titleEl.textContent = 'Try Again';
        } finally {
          btnGroupBookmarks.removeAttribute('aria-busy');
          setTimeout(() => { titleEl.textContent = originalTitle; }, 2000);
        }
      });
    }

    /* ── Stats: Tabs ── */
    async function updateTabsData() {
      const tabs = await browser.tabs.query({});
      const windows = new Set(tabs.map(t => t.windowId)).size;

      document.getElementById('stat-tabs-count').textContent = tabs.length;
      document.getElementById('stat-windows-count').textContent = windows;

      const urlMap = new Map();
      let duplicateCount = 0;

      for (const tab of tabs) {
        const normUrl = normalizeTabUrl(tab.url);
        if (!normUrl) continue;
        const count = urlMap.get(normUrl) || 0;
        if (count >= 1) duplicateCount++;
        urlMap.set(normUrl, count + 1);
      }

      document.getElementById('stat-tabs-dupes').textContent = duplicateCount;
      document.getElementById('stat-tabs-ai').textContent = '0';
    }

    /* ── Stats: Bookmarks ── */
    async function updateBookmarksData() {
      const tree = await browser.bookmarks.getTree();

      let bookmarkCount = 0;
      let folderCount = 0;
      const urlMap = new Map();
      let duplicateCount = 0;

      function traverseNodes(nodes) {
        for (const node of nodes) {
          if (node.url) {
            bookmarkCount++;
            const count = urlMap.get(node.url) || 0;
            if (count >= 1) duplicateCount++;
            urlMap.set(node.url, count + 1);
          } else if (node.title) {
            folderCount++;
          }
          if (node.children) {
            traverseNodes(node.children);
          }
        }
      }

      traverseNodes(tree);

      document.getElementById('stat-bookmarks-count').textContent = bookmarkCount > 999 ? '999+' : bookmarkCount;
      document.getElementById('stat-folders-count').textContent = folderCount;
      document.getElementById('stat-bookmarks-dupes').textContent = duplicateCount;
      document.getElementById('stat-bookmarks-ai').textContent = '0';
    }

    await updateTabsData();
    await updateBookmarksData();

    /* ── Deduplicate Tabs ── */
    document.getElementById('btn-dedupe-tabs').addEventListener('click', async () => {
      const tabs = await browser.tabs.query({});
      const seen = new Set();
      const tabsToRemove = [];

      for (const tab of tabs) {
        const normUrl = normalizeTabUrl(tab.url);
        if (!normUrl) continue;
        if (seen.has(normUrl)) {
          tabsToRemove.push(tab.id);
        } else {
          seen.add(normUrl);
        }
      }

      if (tabsToRemove.length > 0) {
        await browser.tabs.remove(tabsToRemove);
        await updateTabsData();
      }
    });

    /* ── Deduplicate Bookmarks ── */
    document.getElementById('btn-dedupe-bookmarks').addEventListener('click', async () => {
      const tree = await browser.bookmarks.getTree();
      const seen = new Set();
      const toRemove = [];

      function findDupes(nodes) {
        for (const node of nodes) {
          if (node.url) {
            if (seen.has(node.url)) {
              toRemove.push(node.id);
            } else {
              seen.add(node.url);
            }
          }
          if (node.children) {
            findDupes(node.children);
          }
        }
      }

      findDupes(tree);

      if (toRemove.length > 0) {
        for (const id of toRemove) {
          await browser.bookmarks.remove(id);
        }
        await updateBookmarksData();
      }
    });

    /* ── Stat card click routes ── */
    const statCardRoutes = {
      'card-tabs-open': '/tabs',
      'card-windows-open': '/tabs',
      'card-tabs-dupes': '/duplicate-finder',
      'card-tabs-ai': '/ai-suggestions',
      'card-bookmarks-count': '/bookmarks',
      'card-folders-count': '/bookmarks',
      'card-bookmarks-dupes': '/duplicate-finder',
      'card-bookmarks-ai': '/ai-suggestions',
      'btn-tab-manager': '/tabs',
    };

    Object.entries(statCardRoutes).forEach(([id, path]) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          browser.tabs.create({ url: `http://localhost:5173${path}` });
        });
      }
    });

  } catch (error) {
    document.body.innerHTML = `<div style="padding:20px;color:red;font-size:14px;word-wrap:break-word;">
      <strong>Fatal Error:</strong><br/>
      ${error.message}<br/>
      <pre>${error.stack}</pre>
    </div>`;
    console.error('Fatal Popup Error:', error);
  }
});
