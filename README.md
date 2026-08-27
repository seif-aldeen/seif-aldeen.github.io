# Seif Aldeen Portfolio

Editable GitHub Pages portfolio. The existing visual design and hero background video are preserved.

## Online admin

Open `/admin.html` on the published site. The admin view lets you edit page sections, create/edit/duplicate/delete projects, add external media, upload compressed images, preview changes, reorder cards by dragging, and publish them to GitHub.

Each project editor also includes **Homepage Cover Framing** controls. Choose the cover image with the star in the media list, then adjust horizontal focus, vertical focus, and zoom while watching the 16:9 homepage preview.

Project publishing controls include Featured, Hidden, validation status, category filters, and Publication Approval Pending. New and duplicated projects start hidden. Publishing warns when a visible project is still awaiting approval.

To publish, connect a **fine-grained GitHub token** restricted to `seif-aldeen/seif-aldeen.github.io` with **Contents: Read and write**. Use a short expiration date. The token is held only in memory for the current browser tab; it is not saved to localStorage, IndexedDB, the repository, or the website.

Publishing creates GitHub commits. GitHub Pages then updates automatically, so there is no manual download/re-upload cycle.

## Content files

- `portfolio-data.json` contains project text and media references.
- `portfolio-data.js` is the synchronized direct-open fallback used when the site is opened from disk.
- `site-content.json` and `site-content.js` contain the matching online-edit and direct-open page-section data.
- Uploaded project images are stored under `assets/projects/<project-id>/` rather than embedded inside JSON.
- Optional rating and client-feedback fields connect an Upwork review to the correct project.
- Objective, engineering decisions, milestones, evidence, results, and lifecycle status form a consistent case-study structure.

The project JSON was reduced from roughly 6.5 MB by extracting embedded images into cacheable files. The featured list now contains nine projects without embedding image data inside JSON.

The homepage shows four Featured Case Studies and keeps the other five projects available inside More Engineering Projects. Visitors can filter by PCB Design, Embedded Systems, IoT, Mechanical Design, Power Electronics, Robotics, and Digital Electronics.

## Local preview

For the most accurate preview, serve the directory through a local web server. Opening `index.html` directly is also supported through the synchronized JavaScript fallback, so it no longer drops back to the old four-project list.

Project videos are click-to-play and are not embedded on initial page load. The hero video retains the original visual style, uses a static poster immediately, loads after critical content, and is skipped for reduced-motion or data-saving visitors.

## Lifecycle wording

- OnPole: entered board production; physical bring-up pending.
- GRTB001: pre-fabrication; physical PCBA validation pending.
- Neon Leon: client-accepted bench prototype; not a finished mechanical product.

Do not publish client credentials, private prices, BOMs, Gerbers, design sources, or unapproved client material.
