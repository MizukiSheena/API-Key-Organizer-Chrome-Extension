import { loadData, saveData } from "./shared.js";

const $ = (sel) => document.querySelector(sel);

async function init() {
  const data = await loadData();
  const { settings = {} } = data;
  $("#sortMode").value = settings.sortMode ?? "name";
  $("#sortAsc").value = String(settings.sortAsc ?? true);
  $("#showMasked").value = String(settings.showMasked ?? true);

  $("#save").addEventListener("click", async () => {
    const next = await loadData();
    next.settings = {
      sortMode: $("#sortMode").value,
      sortAsc: $("#sortAsc").value === "true",
      showMasked: $("#showMasked").value === "true",
    };
    await saveData(next);
    window.close();
  });
}

init();


