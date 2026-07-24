// /* ==========================================================================
//    videos.js
//    Loads videos from a public Google Drive folder via the Drive API v3,
//    renders responsive video cards with thumbnails, and plays the chosen
//    clip inline in a full-screen modal (no download link exposed).

//    Works with zero configuration: until SITE_CONFIG.googleDrive.apiKey
//    and .videosFolderId are filled in (see js/config.js), the page shows
//    a friendly "connect your videos" state instead of erroring out.
//    ========================================================================== */

// (function () {
//   "use strict";

//   const grid = document.querySelector("[data-video-grid]");
//   const stateBox = document.querySelector("[data-videos-state]");
//   if (!grid) return;

//   /* ---- Drive fetch -------------------------------------------------------- */
//   async function fetchDriveVideos() {
//     const { apiKey, videosFolderId, pageSize } = SITE_CONFIG.googleDrive;

//     if (!apiKey || !videosFolderId) {
//       return { configured: false, items: [] };
//     }

//     const fields = "nextPageToken,files(id,name,mimeType,thumbnailLink,videoMediaMetadata)";
//     const q = encodeURIComponent(`'${videosFolderId}' in parents and mimeType contains 'video/' and trashed = false`);
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
//         const seconds = f.videoMediaMetadata && f.videoMediaMetadata.durationMillis
//           ? Math.round(Number(f.videoMediaMetadata.durationMillis) / 1000)
//           : null;
//         items.push({
//           id: f.id,
//           name: f.name.replace(/\.[^/.]+$/, ""),
//           // Drive's inline preview endpoint plays natively in an <iframe>,
//           // avoiding any download affordance:
//           embedUrl: `https://drive.google.com/file/d/${f.id}/preview`,
//           thumbUrl: f.thumbnailLink ? f.thumbnailLink.replace(/=s\d+$/, "=s800") : "",
//           duration: seconds,
//         });
//       });
//       pageToken = data.nextPageToken || null;
//     } while (pageToken);

//     return { configured: true, items };
//   }

//   function formatDuration(seconds) {
//     if (!seconds && seconds !== 0) return "";
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}:${String(s).padStart(2, "0")}`;
//   }

//   /* ---- Rendering -------------------------------------------------------- */
//   function renderSkeletons(count) {
//     grid.innerHTML = "";
//     for (let i = 0; i < count; i++) {
//       const el = document.createElement("div");
//       el.className = "video-card";
//       el.innerHTML = '<div class="media-skeleton" style="aspect-ratio:16/10"></div>';
//       grid.appendChild(el);
//     }
//   }

//   function renderState(kind) {
//     grid.innerHTML = "";
//     if (!stateBox) return;
//     stateBox.style.display = "block";

//     const states = {
//       unconfigured: {
//         title: "Your video wall is ready to connect",
//         body:
//           "Add a Google Drive API key and the video folder ID in js/config.js, and every clip in that folder will appear here automatically.",
//         code: "js/config.js → SITE_CONFIG.googleDrive",
//       },
//       empty: {
//         title: "No videos yet",
//         body: "Once videos are added to the connected Drive folder, they'll show up here.",
//         code: "",
//       },
//       error: {
//         title: "We couldn't reach the videos",
//         body: "Please check the API key, folder sharing permissions, and your connection, then refresh the page.",
//         code: "",
//       },
//     };
//     const s = states[kind] || states.error;
//     stateBox.innerHTML = `
//       <div class="seal"><span aria-hidden="true">S&amp;S</span></div>
//       <h3>${s.title}</h3>
//       <p>${s.body}</p>
//       ${s.code ? `<code>${s.code}</code>` : ""}
//     `;
//   }

//   function hideState() {
//     if (stateBox) stateBox.style.display = "none";
//   }

//   const PLAY_ICON =
//     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/></svg>';

//   function renderVideos(videos) {
//     grid.innerHTML = "";
//     hideState();

//     if (!videos.length) {
//       renderState("empty");
//       return;
//     }

//     const frag = document.createDocumentFragment();
//     videos.forEach((video) => {
//       const card = document.createElement("article");
//       card.className = "video-card";

//       const thumb = document.createElement("div");
//       thumb.className = "video-thumb";
//       thumb.innerHTML = `
//         ${video.thumbUrl ? `<img loading="lazy" src="${video.thumbUrl}" alt="${video.name}">` : ""}
//         <div class="play-btn"><span>${PLAY_ICON}</span></div>
//       `;
//       thumb.addEventListener("click", () => openModal(video));

//       const meta = document.createElement("div");
//       meta.className = "video-meta";
//       meta.innerHTML = `
//         <h4>${video.name}</h4>
//         <p>${video.duration != null ? formatDuration(video.duration) : "Tap to play"}</p>
//       `;

//       card.appendChild(thumb);
//       card.appendChild(meta);
//       frag.appendChild(card);
//     });
//     grid.appendChild(frag);
//   }

//   /* ---- Modal playback ------------------------------------------------------------ */
//   const modal = document.querySelector("[data-video-modal]");
//   const modalStage = modal ? modal.querySelector("[data-video-modal-stage]") : null;

//   function openModal(video) {
//     if (!modal || !modalStage) return;
//     modalStage.innerHTML = `<iframe src="${video.embedUrl}" width="100%" height="100%" allow="autoplay; fullscreen" allowfullscreen style="border:0;border-radius:8px;aspect-ratio:16/9;background:#000;"></iframe>`;
//     modal.classList.add("is-open");
//     document.body.style.overflow = "hidden";
//   }

//   function closeModal() {
//     if (!modal || !modalStage) return;
//     modal.classList.remove("is-open");
//     modalStage.innerHTML = ""; // stop playback
//     document.body.style.overflow = "";
//   }

//   if (modal) {
//     modal.querySelector("[data-video-modal-close]")?.addEventListener("click", closeModal);
//     modal.addEventListener("click", (e) => {
//       if (e.target === modal) closeModal();
//     });
//     document.addEventListener("keydown", (e) => {
//       if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
//     });
//   }

//   /* ---- Init ------------------------------------------------------------ */
//   async function init() {
//     renderSkeletons(6);
//     try {
//       const { configured, items } = await fetchDriveVideos();
//       if (!configured) {
//         renderState("unconfigured");
//         return;
//       }
//       if (!items.length) {
//         renderState("empty");
//         return;
//       }
//       renderVideos(items);
//     } catch (err) {
//       console.error("Videos load failed:", err);
//       renderState("error");
//     }
//   }

//   document.addEventListener("DOMContentLoaded", init);
// })();
