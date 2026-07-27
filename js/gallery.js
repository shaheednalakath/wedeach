/* ==========================================================
   gallery.js
   Static Gallery (No Google Drive Required)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // --------------------------------------------------------
    // Add your images here
    // --------------------------------------------------------

    const photos = [
        {
            name: "Photo 1",
            src: "assets/images/p1.jpeg"
        },
        {
            name: "Photo 2",
            src: "assets/images/p2.jpeg"
        },
        {
            name: "Photo 3",
            src: "assets/images/p3.jpeg"
        },
        {
            name: "Photo 4",
            src: "assets/images/p4.jpeg"
        },
        {
            name: "Photo 5",
            src: "assets/images/p5.jpeg"
        },
         {
            name: "Photo 6",
            src: "assets/images/p6.jpeg"
         },
        {
            name: "Photo 7",
            src: "assets/images/p7.jpeg"
        },
        {
            name: "Photo 8",
            src: "assets/images/p8.jpeg"
        },
        {
            name: "Photo 9",
            src: "assets/images/p9.jpeg"
        }
   
    ];

    const gallery = document.querySelector("[data-masonry]");
    const count = document.querySelector("[data-gallery-count]");
    const state = document.querySelector("[data-gallery-state]");
    const search = document.querySelector("[data-gallery-search]");

    const lightbox = document.querySelector("[data-lightbox]");
    const lightboxImage = document.querySelector("[data-lightbox-image]");
    const lightboxCaption = document.querySelector("[data-lightbox-caption]");
    const closeBtn = document.querySelector("[data-lightbox-close]");
    const prevBtn = document.querySelector("[data-lightbox-prev]");
    const nextBtn = document.querySelector("[data-lightbox-next]");

    let filtered = [...photos];
    let currentIndex = 0;

    //-------------------------------------------------------
    // Render Gallery
    //-------------------------------------------------------

    function renderGallery(images){

        gallery.innerHTML = "";

        if(images.length===0){

            state.style.display="block";

            state.innerHTML="<h3>No Photos Found</h3>";

            count.textContent="0 Photos";

            return;

        }

        state.style.display="none";

        count.textContent=`${images.length} Photo${images.length>1?"s":""}`;

        images.forEach((photo,index)=>{

            const card=document.createElement("a");

            card.href="#";

            card.className="gallery-item";

            card.innerHTML=`
                <img
                    src="${photo.src}"
                    alt="${photo.name}"
                    loading="lazy">
            `;

            card.addEventListener("click",(e)=>{

                e.preventDefault();

                currentIndex=index;

                openLightbox();

            });

            gallery.appendChild(card);

        });

    }

    //-------------------------------------------------------
    // Search
    //-------------------------------------------------------

    search.addEventListener("input",()=>{

        const value=search.value.toLowerCase();

        filtered=photos.filter(photo=>

            photo.name.toLowerCase().includes(value)

        );

        renderGallery(filtered);

    });

    //-------------------------------------------------------
    // Lightbox
    //-------------------------------------------------------

    function openLightbox(){

        lightboxImage.src=filtered[currentIndex].src;

        lightboxCaption.textContent=filtered[currentIndex].name;

        lightbox.classList.add("show");

        lightbox.setAttribute("aria-hidden","false");

        document.body.style.overflow="hidden";

    }

    function closeLightbox(){

        lightbox.classList.remove("show");

        lightbox.setAttribute("aria-hidden","true");

        document.body.style.overflow="";

    }

    function nextPhoto(){

        currentIndex++;

        if(currentIndex>=filtered.length){

            currentIndex=0;

        }

        openLightbox();

    }

    function prevPhoto(){

        currentIndex--;

        if(currentIndex<0){

            currentIndex=filtered.length-1;

        }

        openLightbox();

    }

    closeBtn.onclick=closeLightbox;

    nextBtn.onclick=nextPhoto;

    prevBtn.onclick=prevPhoto;

    //-------------------------------------------------------
    // Keyboard
    //-------------------------------------------------------

    document.addEventListener("keydown",(e)=>{

        if(!lightbox.classList.contains("show")) return;

        if(e.key==="Escape") closeLightbox();

        if(e.key==="ArrowRight") nextPhoto();

        if(e.key==="ArrowLeft") prevPhoto();

    });

    //-------------------------------------------------------
    // Swipe Support
    //-------------------------------------------------------

    let touchStart=0;

    let touchEnd=0;

    lightbox.addEventListener("touchstart",(e)=>{

        touchStart=e.changedTouches[0].screenX;

    });

    lightbox.addEventListener("touchend",(e)=>{

        touchEnd=e.changedTouches[0].screenX;

        if(touchStart-touchEnd>50){

            nextPhoto();

        }

        if(touchEnd-touchStart>50){

            prevPhoto();

        }

    });

    //-------------------------------------------------------
    // Initial Load
    //-------------------------------------------------------

    renderGallery(photos);

});
