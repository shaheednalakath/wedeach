# Shaheed ❤️ Shahana — Wedding Website

A static, premium wedding website: dark glassmorphism theme with gold and
ivory accents, built with plain HTML5, CSS3, and vanilla JavaScript only
(no frameworks, no build step, no backend).

## Project structure

```
WeddingWebsite/
├── index.html          Home — hero, countdown, previews
├── gallery.html         Masonry photo gallery (Google Drive powered)
├── videos.html          Video wall with in-page playback
├── story.html            Timeline: first meeting → engagement → wedding
├── contact.html          Venue, map, phone, email
├── css/
│   └── style.css         All design tokens + styles for every page
├── js/
│   ├── config.js          ← put your Google Drive API key & folder IDs here
│   ├── app.js              Shared: nav, countdown, scroll reveal, hearts
│   ├── gallery.js          Google Drive fetch + masonry + search + lightbox
│   └── videos.js           Google Drive fetch + video cards + modal player
└── assets/
    ├── images/            Your own photos (hero.jpg, previews, etc.)
    ├── videos/            (optional local video fallbacks)
    └── icons/             favicon.svg
```

## 1. Connect Google Drive photos & videos

The gallery and video pages work out of the box — until you connect Drive
they show a friendly "not connected yet" message instead of an error.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/),
   create (or reuse) a project, then open **APIs & Services → Library**
   and enable the **Google Drive API**.
2. Open **APIs & Services → Credentials → Create Credentials → API key**.
   Restrict it to the Drive API for safety.
3. In Google Drive, create two folders — one for photos, one for videos —
   and set sharing to **"Anyone with the link — Viewer"**.
4. Copy each folder's ID from its URL:
   `https://drive.google.com/drive/folders/`**`THIS_PART_IS_THE_ID`**
5. Open `js/config.js` and fill in:

   ```js
   googleDrive: {
     apiKey: "YOUR_API_KEY",
     photosFolderId: "YOUR_PHOTOS_FOLDER_ID",
     videosFolderId: "YOUR_VIDEOS_FOLDER_ID",
     pageSize: 100,
   },
   ```

That's it — refresh `gallery.html` / `videos.html` and every file in those
folders appears automatically, with lazy loading, search, and playback
already wired up. Add or remove files in Drive any time; no code changes
needed.

## 2. Personalize the content

Everything else the couple would want to change lives in one place,
`js/config.js`:

- `couple` — names and hero tagline
- `weddingDateISO` — target date/time for the countdown
- `venue` — name, address, phone, email, Google Maps link
- `social` — Instagram / Facebook / WhatsApp / YouTube links

Replace the placeholder hero and preview images in `index.html` (currently
`picsum.photos` placeholders) with real photos from `assets/images/`.

## 3. Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**, set the source to the `main` branch (root).
3. Your site will be live at `https://<username>.github.io/<repo>/`.

No build step, no `npm install` — it's ready as-is.

## Notes on future features

The codebase is intentionally modular so these can be added later without
restructuring:

- **Firebase Authentication** — hook into `app.js`'s init flow; gate pages
  or albums behind `onAuthStateChanged`.
- **Likes / emoji reactions / comments / guestbook** — each photo and video
  card already carries a stable Drive file `id`; use it as the document key
  in Firestore or any backend you add.
- **Password-protected albums** — `gallery.js`'s `fetchDrivePhotos()` can be
  pointed at a different folder ID per album, gated by a simple passcode
  check before the fetch runs.
- **Multiple albums** — the gallery/video fetch logic is folder-ID driven,
  so additional albums are just additional folder IDs and a small tab UI.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses
`IntersectionObserver`, `backdrop-filter`, and CSS `columns` for the
masonry layout, with graceful fallbacks where practical.
