// /* ==========================================================================
//    gallery.js
//    Loads photos from a public Google Drive folder via the Drive API v3,
//    renders them into a masonry grid with lazy loading, wires up the
//    name search, and drives a full-screen lightbox with keyboard,
//    button, and swipe navigation.

//    Works with zero configuration: until SITE_CONFIG.googleDrive.apiKey
//    and .photosFolderId are filled in (see js/config.js), the page shows
//    a friendly "connect your gallery" state instead of erroring out.
//    ========================================================================== */

// (function () {
//   "use strict";

//   const grid = document.querySelector("[data-masonry]");
//   const stateBox = document.querySelector("[data-gallery-state]");
//   const searchInput = document.querySelector("[data-gallery-search]");
//   const countLabel = document.querySelector("[data-gallery-count]");
//   if (!grid) return;

//   let allPhotos = [];   // full data set from Drive
//   let visiblePhotos = []; // after search filter -- drives the lightbox order

//   /* ---- Drive fetch -------------------------------------------------------- */
//   async function fetchDrivePhotos() {
//     const { apiKey, photosFolderId, pageSize } = SITE_CONFIG.googleDrive;

//     if (!apiKey || !photosFolderId) {
//       return { configured: false, items: [] };
//     }

//     const fields = "nextPageToken,files(id,name,mimeType,thumbnailLink,webContentLink,imageMediaMetadata)";
//     const q = encodeURIComponent(`'${photosFolderId}' in parents and mimeType contains 'image/' and trashed = false`);
//     let url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${encodeURIComponent(
//       fields
//     )}&pageSize=${pageSize}&key=${apiKey}`;

//     const items = [];
//     let pageToken = null;

//     do {
//       const res = await fetch(pageToken ? `${url}&pageToken=${pageToken}` : url);
//       if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
//       const data = await res.json();
//       (data.files || []).forEach((f) => {
//         items.push({
//           id: f.id,
//           name: f.name.replace(/\.[^/.]+$/, ""),
//           // Large preview for the lightbox, Drive serves a resized JPEG:
//           fullUrl: `https://drive.google.com/uc?export=view&id=${f.id}`,
//           // Thumbnail for the grid (fast + lazy-loadable), bumped to 800px:
//           thumbUrl: f.thumbnailLink ? f.thumbnailLink.replace(/=s\d+$/, "=s800") : `https://drive.google.com/uc?export=view&id=${f.id}`,
//         });
//       });
//       pageToken = data.nextPageToken || null;
//     } while (pageToken);

//     return { configured: true, items };
//   }

//   /* ---- Rendering -------------------------------------------------------- */
//   function renderSkeletons(count) {
//     grid.innerHTML = "";
//     for (let i = 0; i < count; i++) {
//       const el = document.createElement("div");
//       el.className = "masonry-item";
//       el.innerHTML = '<div class="media-skeleton"></div>';
//       grid.appendChild(el);
//     }
//   }

//   function renderState(kind) {
//     grid.innerHTML = "";
//     if (!stateBox) return;
//     stateBox.style.display = "block";

//     const states = {
//       unconfigured: {
//         title: "Your gallery is ready to connect",
//         body:
//           "Add a Google Drive API key and the photo folder ID in js/config.js, and every picture in that folder will appear here automatically.",
//         code: "js/config.js -> SITE_CONFIG.googleDrive",
//       },
//       empty: {
//         title: "No photos yet",
//         body: "Once photos are added to the connected Drive folder, they'll show up here.",
//         code: "",
//       },
//       error: {
//         title: "We couldn't reach the gallery",
//         body: "Please check the API key, folder sharing permissions, and your connection, then refresh the page.",
//         code: "",
//       },
//       "no-results": {
//         title: "No matches",
//         body: "Try a different search term.",
//         code: "",
//       },
//     };
//     const s = states[kind] || states.error;
//     stateBox.innerHTML = `
//       <div class="seal"><span aria-hidden="true">R&amp;S</span></div>
//       <h3>${s.title}</h3>
//       <p>${s.body}</p>
//       ${s.code ? `<code>${s.code}</code>` : ""}
//     `;
//   }

//   function hideState() {
//     if (stateBox) stateBox.style.display = "none";
//   }

//   function renderPhotos(photos) {
//     grid.innerHTML = "";
//     hideState();

//     if (!photos.length) {
//       renderState("no-results");
//       return;
//     }

//     const frag = document.createDocumentFragment();
//     photos.forEach((photo, index) => {
//       const item = document.createElement("figure");
//       item.className = "masonry-item";
//       item.setAttribute("data-index", String(index));

//       const img = document.createElement("img");
//       img.loading = "lazy";
//       img.decoding = "async";
//       img.alt = photo.name || "Wedding photo";
//       img.dataset.src = photo.thumbUrl;
//       img.addEventListener("load", () => img.classList.add("is-loaded"));

//       const cap = document.createElement("figcaption");
//       cap.className = "cap";
//       cap.textContent = photo.name || "";

//       item.appendChild(img);
//       item.appendChild(cap);
//       item.addEventListener("click", () => openLightbox(index));
//       frag.appendChild(item);
//     });
//     grid.appendChild(frag);
//     lazyLoadImages();

//     if (countLabel) {
//       countLabel.textContent = `${photos.length} photo${photos.length === 1 ? "" : "s"}`;
//     }
//   }

//   function lazyLoadImages() {
//     const imgs = grid.querySelectorAll("img[data-src]");
//     if (!("IntersectionObserver" in window)) {
//       imgs.forEach((img) => {
//         img.src = img.dataset.src;
//         img.removeAttribute("data-src");
//       });
//       return;
//     }
//     const io = new IntersectionObserver(
//       (entries, observer) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const img = entry.target;
//             img.src = img.dataset.src;
//             img.removeAttribute("data-src");
//             observer.unobserve(img);
//           }
//         });
//       },
//       { rootMargin: "200px 0px" }
//     );
//     imgs.forEach((img) => io.observe(img));
//   }

//   /* ---- Search ------------------------------------------------------------ */
//   function applySearch(term) {
//     const q = term.trim().toLowerCase();
//     visiblePhotos = !q ? allPhotos.slice() : allPhotos.filter((p) => p.name.toLowerCase().includes(q));
//     renderPhotos(visiblePhotos);
//   }

//   if (searchInput) {
//     let debounceTimer;
//     searchInput.addEventListener("input", (e) => {
//       clearTimeout(debounceTimer);
//       const value = e.target.value;
//       debounceTimer = setTimeout(() => applySearch(value), 180);
//     });
//   }

//   /* ---- Lightbox ------------------------------------------------------------ */
//   const lightbox = document.querySelector("[data-lightbox]");
//   const lbImage = lightbox ? lightbox.querySelector("[data-lightbox-image]") : null;
//   const lbCaption = lightbox ? lightbox.querySelector("[data-lightbox-caption]") : null;
//   let currentIndex = 0;

//   function openLightbox(index) {
//     if (!lightbox || !lbImage) return;
//     currentIndex = index;
//     updateLightboxImage();
//     lightbox.classList.add("is-open");
//     lightbox.setAttribute("aria-hidden", "false");
//     document.body.style.overflow = "hidden";
//   }

//   function closeLightbox() {
//     if (!lightbox) return;
//     lightbox.classList.remove("is-open");
//     lightbox.setAttribute("aria-hidden", "true");
//     document.body.style.overflow = "";
//   }

//   function updateLightboxImage() {
//     const photo = visiblePhotos[currentIndex];
//     if (!photo || !lbImage) return;
//     lbImage.style.animation = "none";
//     // eslint-disable-next-line no-unused-expressions
//     lbImage.offsetHeight; // force reflow to restart the entrance animation
//     lbImage.style.animation = "";
//     lbImage.src = photo.fullUrl;
//     lbImage.alt = photo.name || "Wedding photo";
//     if (lbCaption) lbCaption.textContent = photo.name || "";
//   }

//   function showNext() {
//     if (!visiblePhotos.length) return;
//     currentIndex = (currentIndex + 1) % visiblePhotos.length;
//     updateLightboxImage();
//   }
//   function showPrev() {
//     if (!visiblePhotos.length) return;
//     currentIndex = (currentIndex - 1 + visiblePhotos.length) % visiblePhotos.length;
//     updateLightboxImage();
//   }

//   if (lightbox) {
//     lightbox.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
//     lightbox.querySelector("[data-lightbox-next]")?.addEventListener("click", showNext);
//     lightbox.querySelector("[data-lightbox-prev]")?.addEventListener("click", showPrev);
//     lightbox.addEventListener("click", (e) => {
//       if (e.target === lightbox) closeLightbox();
//     });
//     document.addEventListener("keydown", (e) => {
//       if (!lightbox.classList.contains("is-open")) return;
//       if (e.key === "Escape") closeLightbox();
//       if (e.key === "ArrowRight") showNext();
//       if (e.key === "ArrowLeft") showPrev();
//     });

//     // Mobile swipe support
//     let touchStartX = 0;
//     const stage = lightbox.querySelector(".lightbox-stage");
//     stage?.addEventListener(
//       "touchstart",
//       (e) => (touchStartX = e.changedTouches[0].clientX),
//       { passive: true }
//     );
//     stage?.addEventListener(
//       "touchend",
//       (e) => {
//         const dx = e.changedTouches[0].clientX - touchStartX;
//         if (Math.abs(dx) > 40) (dx < 0 ? showNext() : showPrev());
//       },
//       { passive: true }
//     );
//   }

//   /* ---- Init ------------------------------------------------------------ */
//   async function init() {
//     renderSkeletons(8);
//     try {
//       const { configured, items } = await fetchDrivePhotos();
//       if (!configured) {
//         renderState("unconfigured");
//         return;
//       }
//       allPhotos = items;
//       visiblePhotos = items.slice();
//       if (!items.length) {
//         renderState("empty");
//         if (countLabel) countLabel.textContent = "0 photos";
//         return;
//       }
//       renderPhotos(visiblePhotos);
//     } catch (err) {
//       console.error("Gallery load failed:", err);
//       renderState("error");
//     }
//   }

//   document.addEventListener("DOMContentLoaded", init);
// })();