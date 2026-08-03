# n1 ❤️ n2 — Premium Wedding Website

A modern, elegant, and fully responsive **static wedding website** built with **HTML5, CSS3, and Vanilla JavaScript**. It features a luxurious dark glassmorphism design with gold and ivory accents, automatic Google Drive-powered photo and video galleries, a live wedding countdown, timeline, venue details, and more.

No frameworks, no backend, and no build tools are required—simply upload the project to GitHub Pages or any static web hosting service.

---

# ✨ Features

* 💍 Elegant dark glassmorphism design
* ✨ Gold & ivory luxury theme
* 📱 Fully responsive for mobile, tablet, and desktop
* ⏳ Live wedding countdown
* 📸 Google Drive-powered photo gallery
* 🎥 Google Drive-powered video gallery
* 🔍 Photo search functionality
* 🖼️ Masonry gallery layout
* 🔍 Fullscreen lightbox viewer
* ▶️ In-page video playback
* ❤️ Animated floating hearts
* 🎞️ Scroll reveal animations
* 📖 Wedding story timeline
* 📍 Venue & Google Maps integration
* 📞 Contact information page
* 🚀 GitHub Pages ready
* ⚡ Fast loading with lazy-loaded media
* 🔧 Easy customization from a single configuration file

---

# 📁 Project Structure

```text
WeddingWebsite/
│
├── index.html              # Home page
├── gallery.html            # Photo gallery
├── videos.html             # Video gallery
├── story.html              # Wedding story timeline
├── contact.html            # Contact & venue
│
├── css/
│   └── style.css           # Global styles
│
├── js/
│   ├── config.js           # Website configuration
│   ├── app.js              # Shared functionality
│   ├── gallery.js          # Google Drive photo gallery
│   └── videos.js           # Google Drive video gallery
│
└── assets/
    ├── images/
    ├── videos/
    └── icons/
```

---

# 🚀 Getting Started

Clone or download the project.

```bash
git clone https://github.com/yourusername/WeddingWebsite.git
```

Open `index.html` in your browser, or deploy it to any static hosting provider.

No installation is required.

No dependencies are required.

No build process is required.

---

# ⚙️ Configuration

Almost everything can be customized from a single file.

```
js/config.js
```

Update the following values:

```javascript
const CONFIG = {
  couple: {
    bride: "Bride Name",
    groom: "Groom Name",
    tagline: "Together Forever"
  },

  weddingDateISO: "2026-12-15T10:00:00",

  venue: {
    name: "",
    address: "",
    phone: "",
    email: "",
    maps: ""
  },

  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    whatsapp: ""
  },

  googleDrive: {
    apiKey: "",
    photosFolderId: "",
    videosFolderId: "",
    pageSize: 100
  }
};
```

---

# 📸 Connecting Google Drive

The gallery and video pages automatically display files from Google Drive.

Until connected, the pages will show a friendly "Not Connected" message instead of an error.

## Step 1 — Create a Google Cloud Project

Visit Google Cloud Console.

Create a new project or use an existing one.

Enable the **Google Drive API**.

---

## Step 2 — Create an API Key

Navigate to

```
APIs & Services
→ Credentials
→ Create Credentials
→ API Key
```

For better security, restrict the key to the **Google Drive API**.

---

## Step 3 — Create Drive Folders

Create two folders:

```
Photos

Videos
```

Set both folders to

```
Anyone with the link
Viewer
```

---

## Step 4 — Copy Folder IDs

Example URL

```
https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUvWxYz
```

Folder ID

```
1AbCdEfGhIjKlMnOpQrStUvWxYz
```

---

## Step 5 — Update Configuration

Open

```
js/config.js
```

Replace

```javascript
googleDrive: {
    apiKey: "YOUR_API_KEY",
    photosFolderId: "YOUR_PHOTOS_FOLDER_ID",
    videosFolderId: "YOUR_VIDEOS_FOLDER_ID",
    pageSize: 100
}
```

Refresh

```
gallery.html
```

and

```
videos.html
```

Your media will appear automatically.

Adding or removing files in Google Drive updates the website automatically without modifying any code.

---

# 🖼️ Customizing Images

Replace the placeholder images inside

```
assets/images/
```

Recommended images:

```
hero.jpg

hero-mobile.jpg

preview-1.jpg

preview-2.jpg

preview-3.jpg
```

---

# 🎨 Customizing Colors

Main colors are defined in

```
css/style.css
```

Example

```css
:root {
    --background: #0f0f0f;
    --glass: rgba(255,255,255,.08);
    --gold: #d4af37;
    --ivory: #f8f5ef;
}
```

---

# 🚀 Deployment

## GitHub Pages

1. Push the project to GitHub.
2. Open the repository settings.
3. Navigate to **Pages**.
4. Select the **main** branch as the source.
5. Save the settings.

Your website will be available at:

```
https://username.github.io/repository-name/
```

---

# 🌟 Future Enhancements

The project is modular and can be extended with:

* Firebase Authentication
* RSVP system
* Guestbook
* Likes & Emoji Reactions
* Comments
* Password-protected albums
* Multiple photo albums
* Wedding schedule
* Background music
* Invitation QR code
* Digital gift registry
* Progressive Web App (PWA)
* Offline support
* Dark/Light mode

---

# 🌐 Browser Support

Supported in all modern browsers:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari
* Brave
* Opera

---

# 📄 License

This project is released under the **MIT License**.

You are free to use, modify, and distribute it for personal or commercial projects.

---

# ❤️ Credits

Designed and developed using **HTML5**, **CSS3**, and **Vanilla JavaScript** with a focus on performance, simplicity, and elegant user experience.

Built to be lightweight, easy to customize, and deployable on any static hosting platform without additional tooling.
