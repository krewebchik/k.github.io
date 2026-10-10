// Существующие поправки и изолированные стили третьего блока.
(() => {
  const base = document.currentScript?.src ||
    new URL("assets/content-loader.js", document.baseURI).href;

  const stylesheets = [
    ["hero-polish-styles", "hero-polish.css"],
    ["why-studio-styles", "why-studio.css"]
  ];

  stylesheets.forEach(([id, filename]) => {
    if (document.getElementById(id)) return;

    const stylesheet = document.createElement("link");
    stylesheet.id = id;
    stylesheet.rel = "stylesheet";
    stylesheet.href = new URL(filename, base).href;
    document.head.appendChild(stylesheet);
  });
})();

// Загрузка текстов из Supabase с сохранением исходного HTML при ошибке.
(async () => {
  const finish = () => window.dispatchEvent(new Event("content-ready"));

  try {
    if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return;

    const client = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );

    const { data, error } = await client
      .from("content")
      .select("key, value, type");

    if (error || !data) {
      console.error("Не удалось загрузить контент из Supabase:", error);
      return;
    }

    const escapeHtml = (str) =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    data.forEach((row) => {
      if (typeof row.value !== "string") return;
      const el = document.querySelector(`[data-key="${row.key}"]`);
      if (!el) return;

      if (row.type === "html") {
        el.innerHTML = escapeHtml(row.value).replace(/\n/g, "<br>");
      } else {
        el.textContent = row.value;
      }
    });
  } catch (error) {
    console.error("Не удалось загрузить контент из Supabase:", error);
  } finally {
    finish();
  }
})();
