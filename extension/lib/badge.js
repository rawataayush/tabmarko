// badge.js
// Placeholder for badge logic (e.g. Inactive Tab/Bookmark Notifications on the toolbar icon)

function updateBadgeCount(count) {
  if (count > 0) {
    browser.browserAction.setBadgeText({ text: count.toString() });
    browser.browserAction.setBadgeBackgroundColor({ color: '#ef4444' });
  } else {
    browser.browserAction.setBadgeText({ text: '' });
  }
}
