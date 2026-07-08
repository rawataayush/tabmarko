// background.js — TabMarko background service worker (module)
import { syncTabs, syncBookmarks, isWebTab } from '../lib/sync.js';

browser.runtime.onInstalled.addListener(() => {
  console.log('TabMarko installed.');

  browser.alarms.create('deadLinkScanner', {
    periodInMinutes: 60 * 24
  });
});

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'deadLinkScanner') {
    console.log('Running Dead Link Scanner alarm...');
  }
});

browser.runtime.onMessage.addListener((message, sender) => {
  if (!message || message.source !== 'tabmarko-content' || !message.payload) {
    return;
  }

  const { action } = message.payload;

  switch (action) {
    case 'sync_all': {
      console.log('Received sync request from website');
      // Return the promise so the caller can wait for it
      return (async () => {
        try {
          await syncTabs();
          await syncBookmarks();
          console.log('Background Sync Complete');
          if (sender.tab && sender.tab.id) {
            browser.tabs.reload(sender.tab.id);
          }
          return { ok: true };
        } catch (err) {
          console.error('Background Sync Failed:', err);
          return { ok: false, error: err.message };
        }
      })();
    }

    case 'get_tabs': {
      return (async () => {
        try {
          const tabs = await browser.tabs.query({});
          const { categoryCache = {} } = await browser.storage.local.get('categoryCache');

          const webTabs = tabs.filter(t =>
            isWebTab(t.url) && !t.url.includes('localhost:5173')
          );

          const result = webTabs.map(tab => ({
            id: tab.id,
            tab_url: tab.url,
            title: tab.title || '',
            category: categoryCache[tab.url] || 'Uncategorized',
            favicon: tab.favIconUrl || '',
            windowId: tab.windowId,
            lastAccessed: tab.lastAccessed || Date.now(), // Fallback to now if unsupported
            created_at: new Date().toISOString(),
          }));

          return { ok: true, data: result };
        } catch (err) {
          console.error('get_tabs failed:', err);
          return { ok: false, error: err.message };
        }
      })();
    }

    case 'get_bookmarks': {
      return (async () => {
        try {
          const tree = await browser.bookmarks.getTree();
          const { categoryCache = {} } = await browser.storage.local.get('categoryCache');

          const flat = [];
          function extract(nodes, folderName) {
            for (const node of nodes) {
              if (node.url && isWebTab(node.url)) {
                flat.push({
                  id: node.id,
                  bookmark_url: node.url,
                  title: node.title || '',
                  category: categoryCache[node.url] || 'Uncategorized',
                  folder: folderName || 'Other',
                  created_at: node.dateAdded
                    ? new Date(node.dateAdded).toISOString()
                    : new Date().toISOString(),
                });
              }
              if (node.children) {
                extract(node.children, node.title || folderName);
              }
            }
          }
          extract(tree, '');

          return { ok: true, data: flat };
        } catch (err) {
          console.error('get_bookmarks failed:', err);
          return { ok: false, error: err.message };
        }
      })();
    }

    case 'get_stats': {
      return (async () => {
        try {
          const tabs = await browser.tabs.query({});
          const tree = await browser.bookmarks.getTree();
          const { categoryCache = {} } = await browser.storage.local.get('categoryCache');

          const webTabs = tabs.filter(t =>
            isWebTab(t.url) && !t.url.includes('localhost:5173')
          );
          const windows = new Set(tabs.map(t => t.windowId)).size;

          const tabUrlSet = new Set();
          let dupeTabs = 0;
          for (const t of webTabs) {
            const norm = t.url.split('?')[0].replace(/\/$/, '');
            if (tabUrlSet.has(norm)) dupeTabs++;
            else tabUrlSet.add(norm);
          }

          let bookmarkCount = 0;
          let folderCount = 0;
          let dupeBookmarks = 0;
          const bmUrlSet = new Set();
          function countNodes(nodes) {
            for (const node of nodes) {
              if (node.url) {
                bookmarkCount++;
                if (bmUrlSet.has(node.url)) dupeBookmarks++;
                else bmUrlSet.add(node.url);
              } else if (node.title) {
                folderCount++;
              }
              if (node.children) countNodes(node.children);
            }
          }
          countNodes(tree);

          const categorized = webTabs.filter(t => categoryCache[t.url]).length;

          return {
            ok: true,
            data: {
              tabsOpen: tabs.length,
              webTabs: webTabs.length,
              windows,
              dupeTabs,
              categorized,
              bookmarks: bookmarkCount,
              folders: folderCount,
              dupeBookmarks,
            }
          };
        } catch (err) {
          console.error('get_stats failed:', err);
          return { ok: false, error: err.message };
        }
      })();
    }

    case 'close_duplicate_tabs': {
      return (async () => {
        try {
          const tabs = await browser.tabs.query({});
          const webTabs = tabs.filter(t => isWebTab(t.url));
          const tabUrlSet = new Set();
          const toClose = [];
          
          for (const t of webTabs) {
            const norm = t.url.split('?')[0].replace(/\/$/, '');
            if (tabUrlSet.has(norm)) {
                // Protect the active tab from being closed if it's a duplicate
                if (t.active) {
                    // Find the previously kept tab for this URL and close that instead
                    const prevTab = webTabs.find(oldT => oldT.id !== t.id && oldT.url.split('?')[0].replace(/\/$/, '') === norm && !toClose.includes(oldT.id));
                    if (prevTab) toClose.push(prevTab.id);
                } else {
                    toClose.push(t.id);
                }
            } else {
                tabUrlSet.add(norm);
            }
          }
          
          if (toClose.length > 0) {
            await browser.tabs.remove(toClose);
          }
          await syncTabs();
          return { ok: true, closed: toClose.length };
        } catch (err) {
          console.error('close_duplicate_tabs failed:', err);
          return { ok: false, error: err.message };
        }
      })();
    }

    case 'close_tabs': {
      return (async () => {
        try {
          if (message.payload.ids && message.payload.ids.length > 0) {
            await browser.tabs.remove(message.payload.ids);
            await syncTabs();
            return { ok: true, closed: message.payload.ids.length };
          }
          return { ok: false, error: 'No ids provided' };
        } catch (err) {
          console.error('close_tabs failed:', err);
          return { ok: false, error: err.message };
        }
      })();
    }

    case 'scan_broken_links': {
      return (async () => {
        try {
          const tree = await browser.bookmarks.getTree();
          const flat = [];
          function extract(nodes) {
            for (const node of nodes) {
              if (node.url && isWebTab(node.url)) {
                flat.push(node);
              }
              if (node.children) extract(node.children);
            }
          }
          extract(tree);

          // For the hackathon demo, we limit to scanning the first 20 bookmarks to avoid long waits/rate limits.
          const toScan = flat.slice(0, 20);
          const broken = [];
          
          for (const b of toScan) {
            try {
              const res = await fetch(b.url, { method: 'HEAD', mode: 'no-cors' });
              // Note: no-cors often returns status 0. If it throws, it's definitely broken (DNS/timeout).
              if (res.status >= 400) {
                 broken.push({ id: b.id, title: b.title, url: b.url, status: res.status === 404 ? '404 Not Found' : (res.status >= 500 ? '500 Server Error' : 'Broken') });
              }
            } catch (err) {
              broken.push({ id: b.id, title: b.title, url: b.url, status: 'DNS Resolution' });
            }
          }
          
          return { ok: true, data: broken };
        } catch (err) {
          console.error('scan_broken_links failed:', err);
          return { ok: false, error: err.message };
        }
      })();
    }

    case 'delete_bookmarks': {
      return (async () => {
        try {
          if (message.payload.ids && message.payload.ids.length > 0) {
            for (const id of message.payload.ids) {
              await browser.bookmarks.remove(String(id));
            }
            await syncBookmarks();
            return { ok: true, deleted: message.payload.ids.length };
          }
          return { ok: false, error: 'No ids provided' };
        } catch (err) {
          console.error('delete_bookmarks failed:', err);
          return { ok: false, error: err.message };
        }
      })();
    }

    case 'archive_tabs': {
      return (async () => {
        try {
          if (message.payload.ids && message.payload.ids.length > 0) {
            const tabs = await browser.tabs.query({});
            const tabsToArchive = tabs.filter(t => message.payload.ids.includes(t.id));
            
            // Find or create "Archive" folder
            const tree = await browser.bookmarks.getTree();
            let archiveFolderId = null;
            if (tree[0].children) {
                // Assuming it's in the first root (e.g. bookmarks bar or other)
                const otherBookmarks = tree[0].children.find(c => c.id === '2' || c.title === 'Other Bookmarks') || tree[0].children[0];
                const existingFolder = otherBookmarks.children?.find(c => c.title === 'TabMarko Archive');
                if (existingFolder) {
                    archiveFolderId = existingFolder.id;
                } else {
                    const newFolder = await browser.bookmarks.create({ parentId: otherBookmarks.id, title: 'TabMarko Archive' });
                    archiveFolderId = newFolder.id;
                }
            }

            for (const t of tabsToArchive) {
              if (archiveFolderId) {
                await browser.bookmarks.create({ parentId: archiveFolderId, title: t.title, url: t.url });
              }
              await browser.tabs.remove(t.id);
            }
            await syncTabs();
            await syncBookmarks();
            return { ok: true, archived: message.payload.ids.length };
          }
          return { ok: false, error: 'No ids provided' };
        } catch (err) {
          console.error('archive_tabs failed:', err);
          return { ok: false, error: err.message };
        }
      })();
    }

    default:
      return Promise.resolve({ ok: false, error: 'Unknown action' });
  }
});
