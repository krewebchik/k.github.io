Connect this static HTML landing page to Supabase so its content becomes editable without touching code.

Context: static HTML/CSS/JS site, no build step, no backend. I'll give you the Supabase project URL and anon/publishable key — ask me for them if I haven't provided them yet. Never use, request, or store the secret/service_role key anywhere in client-facing files (index.html, admin.html, or any JS served to the browser).

Do this:

1. **Inventory the content.** Scan the HTML for real marketing copy: headings, subheadings, paragraph text, card/feature titles + descriptions, button/CTA labels, testimonials, footer text. Skip purely decorative elements (icons, numbers, ARIA labels, anchor nav links) unless told otherwise.

2. **Mark it up.** Add a `data-key="..."` attribute to each text element you're making editable, short snake_case keys grouped by section (e.g. `hero_title`, `pricing_card2_desc`). Where an element's text contains a line break that must be preserved, keep the key but note it needs `type: html`.

3. **Design the Supabase schema.** Create a `content` table: `key text primary key`, `value text`, `label text` (human-readable, for the admin form), `section text` (for grouping in the admin form), `type text default 'text'` (`text` or `html`, where html means a literal `\n` in the value becomes `<br>`), `sort_order int`, `updated_at timestamptz`. Enable RLS: public `select`, `update` restricted to `auth.role() = 'authenticated'`. Add an `updated_at` trigger. Seed the table with the page's current hardcoded values so nothing visually changes on first load. Output this as one `.sql` file for me to run in the Supabase SQL editor — you have no DB access, so you can't run it yourself.

4. **Wire up the front end.** Add a small config file (`assets/supabase-config.js`) holding only `SUPABASE_URL` and the anon key, as placeholders for me to fill in. Add a loader script that fetches all rows from `content` on page load and applies them to matching `[data-key]` elements — `textContent` for `type: text`, escaped-then-`<br>`-substituted HTML for `type: html` (never raw innerHTML of unescaped values). It must fail silently and keep the hardcoded fallback text if Supabase is unreachable — the page must never break or go blank. If the page has intro/reveal animations gated by a JS class, delay triggering them until the content fetch resolves (with a timeout fallback around 800ms) so there's no flash of old text before the real content appears.

5. **Build the admin panel.** New `admin.html`: Supabase Auth email+password login form, `noindex, nofollow` meta tag, and after login a form grouped by `section` with one field per `key` (label above, textarea below), a single "Save changes" button that updates only the dirty/changed rows, and a logout button. No signup form — I'll create the admin user manually in the Supabase dashboard.

6. **Tell me exactly what you need from me**: Supabase URL + anon key (never the secret key), confirmation I've run the SQL file, and confirmation I've created an admin user in Supabase Auth with "Auto Confirm User" checked.

Keep the existing visual design untouched — this is purely a content-editing layer on top of it, not a redesign.
