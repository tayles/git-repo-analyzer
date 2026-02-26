import { beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test';

function createChromeMock() {
  return {
    sidePanel: {
      setPanelBehavior: mock(async () => {}),
      open: mock(async () => {}),
    },
    runtime: {
      onInstalled: { addListener: mock(() => {}) },
      sendMessage: mock(async () => {}),
    },
    contextMenus: {
      create: mock(() => {}),
      onClicked: { addListener: mock(() => {}) },
    },
    action: { onClicked: { addListener: mock(() => {}) } },
    commands: { onCommand: { addListener: mock(() => {}) } },
  } as const;
}

describe('background', () => {
  let chromeMock: ReturnType<typeof createChromeMock>;
  let openSidePanel: (tab: chrome.tabs.Tab | undefined) => Promise<void>;

  beforeEach(async () => {
    chromeMock = createChromeMock();
    globalThis.chrome = chromeMock as unknown as typeof chrome;

    ({ openSidePanel } = await import('./background'));
  });

  it('configures panel behavior and event listeners on startup', () => {
    expect(chromeMock.sidePanel.setPanelBehavior).toHaveBeenCalledWith({
      openPanelOnActionClick: false,
    });
    expect(chromeMock.runtime.onInstalled.addListener).toHaveBeenCalledTimes(1);
    expect(chromeMock.action.onClicked.addListener).toHaveBeenCalledTimes(1);
    expect(chromeMock.contextMenus.onClicked.addListener).toHaveBeenCalledTimes(1);
    expect(chromeMock.commands.onCommand.addListener).toHaveBeenCalledTimes(1);
  });

  it('opens side panel and sends current tab URL when tab is valid', async () => {
    await openSidePanel({ id: 42, url: 'https://github.com/owner/repo' } as chrome.tabs.Tab);

    expect(chromeMock.sidePanel.open).toHaveBeenCalledWith({ tabId: 42 });
    expect(chromeMock.runtime.sendMessage).toHaveBeenCalledWith({
      url: 'https://github.com/owner/repo',
    });
  });

  it('logs and returns when there is no active tab id', async () => {
    const originalError = console.error;
    const consoleErrorMock = mock(() => {});
    console.error = consoleErrorMock;

    await openSidePanel(undefined);

    expect(consoleErrorMock).toHaveBeenCalledWith('No active tab found');
    expect(chromeMock.sidePanel.open).not.toHaveBeenCalled();
    expect(chromeMock.runtime.sendMessage).not.toHaveBeenCalled();

    console.error = originalError;
  });
});
