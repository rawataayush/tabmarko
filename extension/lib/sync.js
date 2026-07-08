import { callAiCategorizer, saveTabAiMeta, callEmbedAndSearch, saveBookmarkAiMeta, clearUserTabs, clearUserBookmarks } from './supabaseClient.js';

export function isWebTab(url) {
  return Boolean(url);
}

export function extractCategory(response) {
  if (!response) return '';
  const rawCategory = response.result || response.category || response.message || response.text || '';
  const category = String(rawCategory).trim().replace(/^["']|["']$/g, '');
  if (!category || category.toLowerCase().startsWith('hello ')) return '';
  return category;
}

export function fallbackCategoryForTab(tab) {
  const text = `${tab.title || ''} ${tab.url || ''}`.toLowerCase();
  if (text.includes('github') || text.includes('stackoverflow') || text.includes('developer') || text.includes('docs')) return 'Development';
  if (text.includes('youtube') || text.includes('spotify') || text.includes('music')) return 'Media';
  if (text.includes('amazon') || text.includes('flipkart') || text.includes('shop')) return 'Shopping';
  if (text.includes('news') || text.includes('times') || text.includes('bbc')) return 'News';
  if (text.includes('figma') || text.includes('design') || text.includes('dribbble')) return 'Design';
  if (text.includes('react') || text.includes('course') || text.includes('learn')) return 'Study';
  return 'Research';
}

export async function syncTabs() {
  console.log('Starting Tab Sync...');
  const tabs = await browser.tabs.query({});
  const results = [];

  try {
    await clearUserTabs();
  } catch (err) {
    console.warn('Failed to clear old tabs:', err);
  }

  const { categoryCache = {} } = await browser.storage.local.get('categoryCache');

  for (const tab of tabs) {
    if (!isWebTab(tab.url)) continue;

    let category = categoryCache[tab.url];
    if (!category) {
      const response = await callAiCategorizer(
        'Categorize this browser tab into ONE short label (2 words max) - e.g. Studies, Songs, Search, Work, Shopping, News. Title: {title}, URL: {url}. Respond with only the category.',
        { title: tab.title, url: tab.url }
      );
      category = extractCategory(response) || fallbackCategoryForTab(tab);
      
      if (category) {
        categoryCache[tab.url] = category;
        await browser.storage.local.set({ categoryCache });
      }
    }

    if (category) {
      try {
        await saveTabAiMeta({ tabUrl: tab.url, title: tab.title, category });
      } catch (saveError) {
        console.error('Failed to save tab AI metadata:', saveError);
      }
      results.push({ tabId: tab.id, title: tab.title, url: tab.url, category });
    }
  }

  console.log('Sync Tabs Complete:', results);
  return results;
}

export async function syncBookmarks() {
  console.log('Starting Bookmark Sync...');
  const tree = await browser.bookmarks.getTree();
  const results = [];

  try {
    await clearUserBookmarks();
  } catch (err) {
    console.warn('Failed to clear old bookmarks:', err);
  }
  
  const flatBookmarks = [];
  function extractBookmarks(nodes) {
    for (const node of nodes) {
      if (node.url && isWebTab(node.url)) {
        flatBookmarks.push(node);
      }
      if (node.children) {
        extractBookmarks(node.children);
      }
    }
  }
  extractBookmarks(tree);

  const { categoryCache = {} } = await browser.storage.local.get('categoryCache');

  for (const bkmk of flatBookmarks) {
    let category = categoryCache[bkmk.url];
    if (!category) {
      const response = await callAiCategorizer(
        'Categorize this browser tab into ONE short label (2 words max) - e.g. Studies, Songs, Search, Work, Shopping, News. Title: {title}, URL: {url}. Respond with only the category.',
        { title: bkmk.title, url: bkmk.url }
      );
      category = extractCategory(response) || fallbackCategoryForTab({ title: bkmk.title, url: bkmk.url });
      
      if (category) {
        categoryCache[bkmk.url] = category;
        await browser.storage.local.set({ categoryCache });
      }
    }

    if (category) {
      try {
        await saveBookmarkAiMeta({ bookmarkUrl: bkmk.url, title: bkmk.title, category });
        await callEmbedAndSearch(`${bkmk.title} ${bkmk.url} ${category}`, 'store', String(bkmk.id));
      } catch (saveError) {
        console.error('Failed to save bookmark AI metadata:', saveError);
      }
      results.push({ id: bkmk.id, title: bkmk.title, url: bkmk.url, category });
    }
  }

  console.log('Sync Bookmarks Complete:', results);
  return results;
}
