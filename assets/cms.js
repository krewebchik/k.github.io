// Загрузка текстов из Supabase для нового скина.
//
// Отличие от content-loader.js: тот дополнительно подключает hero-polish.css
// и why-studio.css — правки под старый дизайн. В новой вёрстке они перебивали
// её собственные стили (например, заново показывали пункты меню на мобильном),
// поэтому здесь остался только CMS-слой.
//
// При ошибке исходный HTML сохраняется как есть.
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
