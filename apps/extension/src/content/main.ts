/**
 * Content script for Git Repo Analyzer Chrome Extension
 *
 * This script runs on GitHub pages and can be used to:
 * - Detect the current repository
 * - Add analyze buttons to the UI
 * - Communicate with the popup
 */

// Extract repository information from the current GitHub page
function getRepositoryInfo(): { owner: string; repo: string } | null {
  const pathMatch = window.location.pathname.match(/^\/([^/]+)\/([^/]+)/);
  if (pathMatch) {
    return {
      owner: pathMatch[1],
      repo: pathMatch[2],
    };
  }
  return null;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_REPO_INFO') {
    const repoInfo = getRepositoryInfo();
    sendResponse(repoInfo);
  }
  return true;
});

// Log that the content script is loaded (for debugging)
const repoInfo = getRepositoryInfo();
if (repoInfo) {
  // Content script loaded on repository page
}
