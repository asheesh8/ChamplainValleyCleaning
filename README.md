# Champlain Valley Cleaning

Marketing site + admin back office for a janitorial company in Chittenden, VT.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Prisma 7 · SQLite

---

## Run it

```bash
npm install && npx prisma migrate dev && npx tsx prisma/seed.ts && npm run dev
```

Site: <http://localhost:3000> · Admin: <http://localhost:3000/admin>

The seed script prints the admin credentials it created. Override them with
`ADMIN_EMAIL` / `ADMIN_PASSWORD` before seeding.

---

## What's here

### Public site

| Route | What it does |
|---|---|
| `/` | Hero with layered Green Mountain ridgeline, featured services, work gallery, process, service area |
| `/services` | All services grouped by category, deep-linkable per service |
| `/gallery` | Filterable masonry grid with a keyboard-navigable lightbox |
| `/about` | Story, values, service area, hours, contact |
| `/contact` | Quote form → writes a `Lead` |

### Admin (`/admin`)

Dashboard · Leads (filterable inbox, detail view with status/priority/quoted
amount and internal notes) · Schedule · Services (full CRUD) · Gallery
(publish / feature / edit the 34 imported photos) · Reviews · Settings
(editable site copy).

### Backend

- `POST /api/leads` — public quote submission. Zod-validated, honeypot-protected.
- `GET /api/leads` — admin only, session-guarded.
- `POST /api/chat` — **stub, returns 501.** See below.
- Admin mutations are Server Actions in `src/app/admin/actions.ts`, each gated
  by `requireUser()`.

Auth is a server-side session table plus an httpOnly cookie; passwords use
scrypt with per-password salts. Sessions are revocable, unlike a stateless JWT.

---

## Chatbot — deliberately not wired

The widget (`src/components/chat/`) is visually complete: launcher with unread
dot, typing indicator, quick replies, action chips, transcript, composer.

Replies come from `src/components/chat/script.ts`, a deterministic keyword
responder. **No language model is connected.** That was the point — the UI can
be reviewed without an API key, a bill, or a model inventing prices for a real
business.

To go live, follow the commented plan in `src/app/api/chat/route.ts`. The
`Conversation` and `ChatMessage` tables are already modelled so transcripts can
surface in the admin.

---

## Photos

All 34 images were pulled from the client's Facebook page. They live in
`public/gallery/`, with the originals kept in `scraped/photos/`.

**Only 5 are published.** The library is job documentation, not marketing
photography — it includes a stained urinal, a toner cartridge in a bin, a
default Facebook avatar, and two duplicate cover banners. Everything
unreviewed is imported but hidden. Curate it in Admin → Gallery.

**Real photography is the single biggest gap before launch.**

---

## Before this goes live

1. **Fix hosting.** DNS sits on Google Cloud DNS (`ns-cloud-c*.googledomains.com`)
   with A records pointing at Google Sites IPs (`216.239.3x.21`) that now return
   a Google 404. The domain is registered with Squarespace, inherited from the
   Google Domains shutdown. Repoint the records at wherever this deploys.
2. **Swap SQLite for Postgres.** Change `provider` in `prisma/schema.prisma`
   and set `DATABASE_URL`. No model changes needed — but SQLite will not work
   on a serverless host.
3. **Set a real `SESSION_SECRET`** and change the seeded admin password.
4. **Confirm the placeholders** in `src/lib/site.ts`. Opening hours and the
   2020 founding year are assumptions, not verified facts.
5. **Replace the testimonial placeholders.** Three unpublished template rows
   exist. They are not real reviews and must never be published as written.
6. **Delete the sample leads** — Admin → Settings → Delete sample leads.
7. **Wire lead notifications.** `POST /api/leads` carries a `TODO(notify)`;
   today a new lead only lands in the database.

---

## Notes

- Residential is **deep cleans and move-out turnovers only** — no recurring
  weekly or biweekly housekeeping. This is enforced in the service data and
  stated on `/services` and in the chatbot script.
- Design tokens live in `src/app/globals.css` under `@theme`. Light and dark
  are both first-class, and the theme is applied pre-paint to avoid a flash.
- The logo in `src/components/site/Logo.tsx` is original work — the client's
  Facebook avatar is a default letter tile, so there was nothing to work from.
