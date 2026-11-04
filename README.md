# cowforsale 🐄

A birthday scrapbook for Nandini: real photos, affectionate roasting, different scroll reveals, a cursor-chasing cow, touch wandering, reduced-motion support and cow confetti. Plain HTML, CSS and JavaScript; no dependencies or backend.

## Preview

With Node.js 22 or newer, run `npm run dev` from this folder, then open **http://127.0.0.1:4173**. On Windows PowerShell, use **`npm.cmd run dev`** if execution policy blocks `npm.ps1`. Opening `index.html` directly will not load the content file; use the server.

## Personalize

Edit **`content.json`** for all photo paths, alt descriptions, captions, memories, personal messages, specimen details and cow speech bubbles.

- Put new photos in `assets/photos/`, then update the corresponding `src`, for example `assets/photos/Our silly photo.webp`. Spaces work. Match capitalization exactly and use forward slashes.
- An empty `src` shows a designed placeholder. Images that fail to load also fall back to placeholders in the browser.
- The two memories now use the real hostel-drama and catch-up lore supplied by Soorya. Additional draft memories can use `sample: true` to show a visible placeholder label; switch it to `false` after adding a real story.
- Personalize `letter`, `signature` and `birthdayMessage`. The requested opening headline is already exact.
- Section headings and navigation are in `index.html`; the visual design is in `styles.css`.

Original PNG screenshots remain untouched at the repository root. The eight optimized WebP copies in `assets/photos/` total about 300 KB; the sideways photo is corrected only in its copy. The ID-card screenshot is excluded from Git using `.gitignore`; only its cropped portrait is used on the site. Keep the full card local. To regenerate the copies, install Pillow (`python -m pip install Pillow`) and run `python scripts/prepare_photos.py`. The ID crop is optional if that local original is absent after cloning. Optimized copies are already included. Export new photos as WebP where possible, ideally under 300 KB each.

Fonts load from Google Fonts with local fallbacks. All other assets come from this site.

## Verify and build

```sh
npm run check
npm run build
node --check app.js
```

Use `npm.cmd` on Windows if needed. The build creates `dist/` containing only the website, excluding original screenshots and development files. Checks validate the exact opening headline, photo references, sample flags, local assets, unique IDs and anchor destinations.

## GitHub Pages — manual publishing only

Pushing **does not deploy the website**. The workflow is manual, so the birthday surprise stays unpublished until you choose to deploy it.

1. On GitHub, open **Settings → Pages**, then select **GitHub Actions** as the source.
2. Open **Actions → Publish birthday website (manual) → Run workflow**.
3. Select `main` and run it. Wait for build and deploy to succeed.
4. The deployment job shows the Pages URL, usually `https://OWNER.github.io/REPOSITORY/`.

After future edits, check/build, commit, push and run the workflow again. Relative URLs work under a repository subdirectory or custom domain. No secrets are required. `.nojekyll` is included.

## Interaction and accessibility

The cursor cow uses `pointer-events: none` so buttons and text remain usable. It follows with a delay and waddle on desktop. Move within 55 pixels of the corner Assam sticker to make it blush; moving away restores its usual face. On touch devices, tap the sticker for a brief blush. Keyboard focus also triggers the reaction. The speech and accessible reaction text are editable in `content.json` as `assamBubble` and `assamReaction`.

Reduced motion disables the wandering cow, scroll animations and falling confetti; Assam still triggers a stationary blushing cow beside the sticker, and the celebration button still displays a message. Keyboard focus styles, native buttons, a skip link, image descriptions and live celebration status are included. Confetti cleans itself up after six seconds. There is no sound.

The Assam outline is adapted from SlowPhoton's Wikimedia Commons map under CC BY-SA 3.0; links and adaptation details are in `assets/ATTRIBUTION.md` and the website footer. Its source SVG is kept under `scripts/` and is excluded from the site build.

Photos and source are publicly viewable in a public repository, even before Pages is deployed.
