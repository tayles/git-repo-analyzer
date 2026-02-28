// Configure sidepanel to not open when extension icon is clicked
void chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });

chrome.action.onClicked.addListener(async tab => {
  await openSidePanel(tab);
});

// Handle keyboard commands
chrome.commands.onCommand.addListener(async (_command, tab) => {
  await openSidePanel(tab);
});

export async function openSidePanel(tab: chrome.tabs.Tab | undefined) {
  if (!tab?.id) {
    console.error('No active tab found');
    return;
  }
  const tabId = tab.id;

  // Open side panel for the current tab
  await chrome.sidePanel.open({ tabId });

  // send message to side panel to trigger repo detection and analysis if it is already open
  await chrome.runtime.sendMessage({ url: tab.url });
}
