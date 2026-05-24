# Seif Aldeen Portfolio

Static portfolio website for GitHub Pages.

## Quick Start

Open `index.html` in your browser.

## Dev Mode (Built-in Page Editor)

**No coding required to add/edit projects or images.**

1. Open the site and append `?dev=true` to the URL (e.g., `index.html?dev=true`)
2. A **Dev Mode** toolbar appears at the bottom with options to Export/Import data
3. Hover over any project card and click **Edit** to modify its content
4. In the editor modal you can:
   - Edit title, description, category, tags
   - **Add images** by pasting image URLs
   - **Drag & drop** to reorder images
   - Remove images with the X button
   - Edit detailed overview and role text
5. **Add new projects** using the "+ Add Project" card
6. **Export** your data as a JSON backup file
7. **Import** a previously exported JSON file to restore data
8. All changes are saved automatically to your browser's localStorage

> **Note:** For production, upload your images to a hosting service (Imgur, Google Photos, GitHub, etc.) and paste the URLs into the editor.

## Project Detail Pages

Each project card links to `project-template.html?id=<project-id>`. The detail page dynamically loads content from the saved data and displays a photo gallery.

## Files

- `index.html` — main portfolio page
- `project-template.html` — dynamic project detail page
- `styles.css` — visual design, responsive layout, admin panel styles
- `script.js` — data layer, renderer, dev mode admin panel with drag-drop
- `assets/` — resume PDF, hero image, profile photo

## Publish With GitHub Pages

1. Create a GitHub repository named `seifaldeen.github.io` (or `yourusername.github.io`)
2. Upload these files to the repository
3. Go to **Settings** → **Pages**
4. Set source to **Deploy from a branch**
5. Choose `main` and `/root`
6. Your site appears at `https://seifaldeen.github.io`
