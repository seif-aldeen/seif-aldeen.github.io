# Portfolio audit and implementation record

Date: 2026-08-27

## Root causes found

1. The screenshot was opened from `H:\Portfolio_backup_2026-08-26`, not the active `H:\Portfolio` folder.
2. Opening the old site with a `file://` URL prevented `fetch()` from reading `portfolio-data.json`. The error path then displayed four hard-coded legacy projects.
3. Project data previously contained multi-megabyte base64 images, delaying parsing, cards, and the project count.
4. The 15.3 MB hero video competed with critical content on first load.
5. Content changes were coupled to manual file editing and full re-uploading.
6. Project wording did not consistently distinguish design, fabrication, bring-up, bench acceptance, and finished-product validation.

## Implemented

- Curated nine featured projects: OnPole, Neon Leon, GRTB001, Formula Student Suspension, BLDC Controller, Hand Gesture Car, Auxilio CTF Robot, RoboSoccer Robot, and Digital Clock.
- Added synchronized `portfolio-data.js` and `site-content.js` fallbacks so direct disk opening no longer shows the four-project legacy list.
- Kept JSON files as the canonical editable data and updated the online admin publisher to commit both JSON and fallback JavaScript files.
- Extracted embedded images into cacheable project asset files and reduced project data from roughly 6.5 MB to about 32 KB, including the richer milestone, review, and cover-framing metadata.
- Preserved the visual design and background video while deferring video loading until after critical content and respecting reduced-motion/data-saving preferences.
- Added project skeletons and a neutral project-count placeholder, preventing the misleading initial “0 projects” state.
- Replaced generated project artwork with Seif's supplied 3D top/bottom views, PCB routing evidence, rendered schematic pages, hardware photos, and Upwork review captures.
- Added per-project homepage cover framing controls for horizontal focus, vertical focus, zoom, and cover selection.
- Split the homepage into four Featured Case Studies plus a collapsible five-project archive, with category filters so no work disappears.
- Added project lifecycle badges, objectives, engineering decisions, sticky case-study navigation, media thumbnails, previous/next links, and per-project inquiry calls to action.
- Changed externally hosted project videos to click-to-play cards, preventing heavy embeds from loading during the initial visit.
- Added Upwork proof (100% Job Success, Rising Talent, four jobs, 0-4 hour response time) and two project-linked 5.0 testimonials without exposing earnings.
- Added admin Featured/Hidden/Approval Pending controls, status editing, filters, drag reordering, draft duplication, and a publication warning for unapproved visible projects.
- Linked the 5.0 Upwork reviews to OnPole and Neon Leon on both their homepage cards and detail pages.
- Added the client-accepted Neon Leon demonstration as externally hosted media rather than bundling another heavy local video.
- Updated About, skills, experience, metadata, sitemap, accessibility targets, and responsive navigation.
- Added a browser-based admin mode at `/admin.html`; a fine-grained GitHub token stays in memory only.

## Validation status preserved

- **OnPole:** design milestones approved and board release entered production; physical bring-up and measured RF/wearable validation pending.
- **GRTB001:** Release 2 pre-fabrication package complete; fabricated-PCBA validation and calibration pending.
- **Neon Leon:** complete client-accepted bench prototype; not a finished mechanical product.

## Media approval boundary

Selected 3D, assembly, hardware, routing, schematic, and Upwork-review views supplied by Seif are included locally. BOMs, Gerbers, source packages, credentials, private earnings, and other controlled files remain excluded. Confirm client publication approval for the selected visuals before any public deployment.

## Local verification

- Desktop: nine cards rendered (four featured and five under More Engineering Projects), correct project counter, no horizontal overflow, no console errors, and all 50 referenced media items present.
- Mobile 390 × 844: nine cards rendered, 44 × 44 menu target, navigation expanded correctly, no horizontal overflow, and no broken content images.
- All nine project-detail URLs loaded with lifecycle status, overview, objective, role, highlights, milestones, engineering decisions, deliverables, challenges, results, technologies, media gallery, SEO metadata, and project navigation.
- Admin mode exposed edit controls for all nine projects, cover framing, filters, visibility, ratings, reviews, detailed fields, media galleries, duplication, and editable page sections.
- `script.js` passed syntax validation.

No GitHub push or deployment was performed.
