/* eslint-disable no-undef */
// MV3 service worker: handle command to toggle/open side panel

chrome.runtime.onInstalled.addListener(() => {
  // Initialize storage if empty
  chrome.storage.local.get(["data"], ({ data }) => {
    if (!data) {
      const now = Date.now();
      const initial = {
        version: 1,
        settings: {
          sortMode: "name",
          sortAsc: true,
          showMasked: true
        },
        apiKeys: [
          {
            id: crypto.randomUUID(),
            name: "示例-OpenAI",
            value: "sk-xxxx...",
            category: "LLM",
            note: "示例数据，可删除",
            useCount: 0,
            createdAt: now,
            updatedAt: now,
            lastUsedAt: 0,
            order: 0
          }
        ]
      };
      chrome.storage.local.set({ data: initial });
    }
  });
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-side-panel") {
    try {
      // 在快捷键下，打开侧边栏会因缺少用户手势而失败。
      // 改为打开独立无边框窗口，避免手势限制。
      await chrome.windows.create({
        url: chrome.runtime.getURL("standalone.html"),
        type: "popup",
        focused: true,
        width: 520,
        height: 680
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to open window:", e);
    }
  }
});


