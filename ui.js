import {
  loadData,
  saveData,
  sortApiKeys,
  maskKey,
  copyToClipboard,
  generateEmptyItem,
  exportAsJson,
  importFromFile,
  matchQuery
} from "./shared.js";

const $ = (sel) => document.querySelector(sel);

let state = {
  data: null,
  query: "",
  draggingId: null,
};

function renderList() {
  const container = $("#list");
  container.innerHTML = "";

  const { apiKeys = [], settings = {} } = state.data || {};
  const filtered = apiKeys.filter((it) => matchQuery(it, state.query));
  const sorted = sortApiKeys(filtered, settings.sortMode ?? "name", settings.sortAsc ?? true);

  if (sorted.length === 0) {
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.textContent = "暂无数据，点击上方“新增”添加";
    container.appendChild(empty);
    return;
  }

  for (const item of sorted) {
    container.appendChild(renderItem(item));
  }
}

function renderItem(item) {
  const wrapper = document.createElement("div");
  wrapper.className = "item";
  wrapper.draggable = true;
  wrapper.dataset.id = item.id;

  wrapper.addEventListener("dragstart", (e) => {
    state.draggingId = item.id;
    wrapper.classList.add("dragging");
    e.dataTransfer.setData("text/plain", item.id);
  });
  wrapper.addEventListener("dragend", () => {
    state.draggingId = null;
    wrapper.classList.remove("dragging");
  });
  wrapper.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  wrapper.addEventListener("drop", async (e) => {
    e.preventDefault();
    const targetId = item.id;
    const sourceId = e.dataTransfer.getData("text/plain");
    if (!sourceId || sourceId === targetId) return;
    const data = await loadData();
    const list = data.apiKeys || [];
    const si = list.findIndex((x) => x.id === sourceId);
    const ti = list.findIndex((x) => x.id === targetId);
    if (si < 0 || ti < 0) return;
    const [moved] = list.splice(si, 1);
    list.splice(ti, 0, moved);
    // Reassign order by index
    list.forEach((x, idx) => { x.order = idx; });
    data.apiKeys = list;
    await saveData(data);
    state.data = data;
    renderList();
  });

  const left = document.createElement("div");
  const right = document.createElement("div");
  right.className = "item-actions";

  const title = document.createElement("div");
  title.className = "item-title";
  title.textContent = item.name || "(未命名)";
  const sub = document.createElement("div");
  sub.className = "item-sub";
  const cat = item.category ? `分类: ${item.category}` : "分类: -";
  const uses = `使用: ${item.useCount}`;
  const updated = `更新: ${new Date(item.updatedAt).toLocaleString()}`;
  sub.textContent = `${cat}  ·  ${uses}  ·  ${updated}`;

  const keyLine = document.createElement("div");
  keyLine.className = "muted";
  keyLine.textContent = (state.data.settings?.showMasked ?? true) ? maskKey(item.value) : (item.value || "");

  const noteLine = document.createElement("div");
  noteLine.className = "muted";
  noteLine.textContent = item.note || "";

  left.appendChild(title);
  left.appendChild(sub);
  left.appendChild(keyLine);
  if (item.note) left.appendChild(noteLine);

  const btnCopy = document.createElement("button");
  btnCopy.className = "btn";
  btnCopy.textContent = "复制";
  btnCopy.addEventListener("click", async () => {
    if (!item.value) return;
    await copyToClipboard(item.value);
    const data = await loadData();
    const idx = data.apiKeys.findIndex((x) => x.id === item.id);
    if (idx >= 0) {
      data.apiKeys[idx].useCount += 1;
      data.apiKeys[idx].lastUsedAt = Date.now();
      await saveData(data);
      state.data = data;
      renderList();
    }
  });

  const btnEdit = document.createElement("button");
  btnEdit.className = "btn secondary";
  btnEdit.textContent = "编辑";
  btnEdit.addEventListener("click", () => openEditDialog(item));

  const btnDelete = document.createElement("button");
  btnDelete.className = "btn danger";
  btnDelete.textContent = "删除";
  btnDelete.addEventListener("click", async () => {
    const data = await loadData();
    data.apiKeys = (data.apiKeys || []).filter((x) => x.id !== item.id);
    await saveData(data);
    state.data = data;
    renderList();
  });

  right.appendChild(btnCopy);
  // 模板按钮
  const btnTpl = document.createElement("button");
  btnTpl.className = "btn secondary";
  btnTpl.textContent = "模板";
  btnTpl.addEventListener("click", () => openTemplateMenu(item));
  right.appendChild(btnTpl);
  right.appendChild(btnEdit);
  right.appendChild(btnDelete);

  wrapper.appendChild(left);
  wrapper.appendChild(right);
  return wrapper;
}

function openEditDialog(item) {
  const isNew = !item;
  const model = item ? { ...item } : generateEmptyItem();
  const dlg = document.createElement("div");
  dlg.className = "item";
  dlg.style.position = "fixed";
  dlg.style.left = "50%";
  dlg.style.top = "10%";
  dlg.style.transform = "translateX(-50%)";
  dlg.style.zIndex = "9999";
  dlg.style.width = "min(680px, 92vw)";

  const left = document.createElement("div");
  const right = document.createElement("div");
  right.className = "item-actions";

  const form = document.createElement("div");
  form.className = "list";
  form.innerHTML = `
    <div class="field-row">
      <label>名称</label>
      <input id="f_name" type="text" placeholder="比如：OpenAI / Claude / GitHub Token" value="${model.name || ""}">
    </div>
    <div class="field-row">
      <label>API Key</label>
      <input id="f_value" type="text" placeholder="粘贴你的 Key" value="${model.value || ""}">
    </div>
    <div class="field-row">
      <label>分类</label>
      <input id="f_category" type="text" placeholder="比如：LLM / Cloud / DB" value="${model.category || ""}">
    </div>
    <div class="field-row">
      <label>备注</label>
      <textarea id="f_note" rows="3" placeholder="比如：计费、套餐到期、来源账号等">${model.note || ""}</textarea>
    </div>
  `;

  left.appendChild(form);

  const btnSave = document.createElement("button");
  btnSave.className = "btn ok";
  btnSave.textContent = "保存";
  btnSave.addEventListener("click", async () => {
    const data = await loadData();
    const list = data.apiKeys || [];
    const idx = list.findIndex((x) => x.id === model.id);
    const now = Date.now();
    const record = {
      ...model,
      name: $("#f_name").value.trim(),
      value: $("#f_value").value.trim(),
      category: $("#f_category").value.trim(),
      note: $("#f_note").value,
      updatedAt: now,
    };
    if (idx >= 0) list[idx] = record; else list.unshift(record);
    data.apiKeys = list;
    await saveData(data);
    state.data = data;
    dlg.remove();
    renderList();
  });

  const btnCancel = document.createElement("button");
  btnCancel.className = "btn secondary";
  btnCancel.textContent = "取消";
  btnCancel.addEventListener("click", () => dlg.remove());

  right.appendChild(btnSave);
  right.appendChild(btnCancel);

  dlg.appendChild(left);
  dlg.appendChild(right);
  document.body.appendChild(dlg);
}

function openTemplateMenu(item) {
  const menu = document.createElement("div");
  menu.className = "item";
  menu.style.position = "fixed";
  menu.style.right = "12px";
  menu.style.top = "60px";
  menu.style.zIndex = "9999";
  const list = document.createElement("div");
  list.className = "list";

  const entries = [
    { label: "Bearer <KEY>", value: `Bearer ${item.value}` },
    { label: "Authorization 头", value: `Authorization: Bearer ${item.value}` },
    { label: "curl Header", value: `-H \"Authorization: Bearer ${item.value}\"` },
    { label: "JS fetch Header", value: `headers: { Authorization: 'Bearer ${item.value}' }` },
    { label: "UNIX 环境变量", value: `export API_KEY=${item.value}` },
    { label: "Windows 环境变量", value: `setx API_KEY ${item.value}` },
    { label: ".env 文件", value: `API_KEY=${item.value}` }
  ];

  for (const e of entries) {
    const row = document.createElement("div");
    row.className = "grid";
    const label = document.createElement("div");
    label.textContent = e.label;
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "复制";
    btn.addEventListener("click", async () => {
      await copyToClipboard(e.value);
      menu.remove();
    });
    row.appendChild(label);
    row.appendChild(btn);
    list.appendChild(row);
  }
  menu.appendChild(list);

  const close = document.createElement("button");
  close.className = "btn secondary";
  close.textContent = "关闭";
  close.addEventListener("click", () => menu.remove());
  const actions = document.createElement("div");
  actions.className = "item-actions";
  actions.appendChild(close);
  menu.appendChild(actions);

  document.body.appendChild(menu);
}

async function init() {
  state.data = await loadData();

  const settings = state.data.settings || {};
  $("#sortMode").value = settings.sortMode ?? "name";
  $("#sortAsc").value = String(settings.sortAsc ?? true);

  $("#search").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderList();
  });
  $("#add").addEventListener("click", () => openEditDialog(null));
  const openSideBtn = document.querySelector("#openSidePanel");
  if (openSideBtn && chrome?.sidePanel?.setOptions) {
    openSideBtn.addEventListener("click", async () => {
      try {
        await chrome.sidePanel.setOptions({ path: "sidepanel.html", enabled: true });
        await chrome.sidePanel.open({});
      } catch (e) {
        console.warn("Open side panel failed:", e);
      }
    });
  }
  $("#export").addEventListener("click", async () => {
    const data = await loadData();
    exportAsJson(data);
  });
  $("#importFile").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const json = await importFromFile(file);
      await saveData(json);
      state.data = json;
      renderList();
    } catch (err) {
      alert("导入失败: " + err.message);
    } finally {
      e.target.value = "";
    }
  });
  $("#sortMode").addEventListener("change", async (e) => {
    const data = await loadData();
    data.settings = data.settings || {};
    data.settings.sortMode = e.target.value;
    await saveData(data);
    state.data = data;
    renderList();
  });
  $("#sortAsc").addEventListener("change", async (e) => {
    const data = await loadData();
    data.settings = data.settings || {};
    data.settings.sortAsc = e.target.value === "true";
    await saveData(data);
    state.data = data;
    renderList();
  });

  renderList();
}

init();


