const photos = document.getElementById("photos");
const videos = document.getElementById("videos");

photos.addEventListener("change", () => {

const list = document.getElementById("photoList");

list.innerHTML = "";

[...photos.files].forEach(file=>{

list.innerHTML += `<p>📷 ${file.name}</p>`;

});

});

videos.addEventListener("change", () => {

const list = document.getElementById("videoList");

list.innerHTML = "";

[...videos.files].forEach(file=>{

list.innerHTML += `<p>🎥 ${file.name}</p>`;

});

});

document.querySelector(".upload-btn").addEventListener("click",()=>{

alert("Upload functionality will be connected to Google Drive later.");

});