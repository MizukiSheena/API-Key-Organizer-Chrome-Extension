/* eslint-disable no-undef */
// Shared utilities for popup, side panel, and options

const STORAGE_KEY = "data";

async function loadData() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (obj) => {
      const data = obj[STORAGE_KEY] || { version: 1, settings: {}, apiKeys: [] };
      resolve(structuredClone(data));
    });
  });
}

async function saveData(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: data }, resolve);
  });
}

function formatDate(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function maskKey(value) {
  if (!value) return "";
  if (value.length <= 6) return "***";
  return `${value.slice(0, 3)}***${value.slice(-3)}`;
}

function compareBy(a, b, key, asc = true) {
  const va = a[key] ?? "";
  const vb = b[key] ?? "";
  const result = typeof va === "string" && typeof vb === "string"
    ? va.localeCompare(vb)
    : (va > vb ? 1 : va < vb ? -1 : 0);
  return asc ? result : -result;
}

function sortApiKeys(list, mode = "name", asc = true) {
  const copy = [...list];
  if (mode === "name") return copy.sort((a, b) => compareBy(a, b, "name", asc));
  if (mode === "category") return copy.sort((a, b) => compareBy(a, b, "category", asc));
  if (mode === "useCount") return copy.sort((a, b) => compareBy(a, b, "useCount", asc));
  if (mode === "lastUsedAt") return copy.sort((a, b) => compareBy(a, b, "lastUsedAt", asc));
  if (mode === "createdAt") return copy.sort((a, b) => compareBy(a, b, "createdAt", asc));
  if (mode === "custom") return copy.sort((a, b) => compareBy(a, b, "order", asc));
  return copy;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // Fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  }
}

function findIndexById(list, id) {
  return list.findIndex((x) => x.id === id);
}

function generateEmptyItem() {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    name: "",
    value: "",
    category: "",
    note: "",
    useCount: 0,
    createdAt: now,
    updatedAt: now,
    lastUsedAt: 0,
    order: now
  };
}

function exportAsJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `api-keys-${new Date().toISOString().slice(0,19).replace(/[:T]/g, '-')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function importFromFile(file) {
  const text = await file.text();
  const json = JSON.parse(text);
  if (!json || !Array.isArray(json.apiKeys)) throw new Error("文件格式不正确");
  return json;
}

function matchQuery(item, q) {
  if (!q) return true;
  const s = q.toLowerCase();
  return (
    (item.name || "").toLowerCase().includes(s) ||
    (item.category || "").toLowerCase().includes(s) ||
    (item.note || "").toLowerCase().includes(s) ||
    (item.value || "").toLowerCase().includes(s)
  );
}

export {
  STORAGE_KEY,
  loadData,
  saveData,
  formatDate,
  maskKey,
  sortApiKeys,
  copyToClipboard,
  findIndexById,
  generateEmptyItem,
  exportAsJson,
  importFromFile,
  matchQuery
};


