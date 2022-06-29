let images = [];
let slideIndex = 1;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceWorker.js')
        .then(function(reg){
            console.log("service worker registered")
        })
        .catch(function(err) {
            console.log(err)
        });
} else {
    console.log("Could not find serviceWorker in navigator")
}

let deferredPrompt;
//Si votre application Web progressive répond aux critères d'installation requis , le navigateur déclenche beforeinstallpromptl'événement
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can add to home screen
    if (!deferredPrompt) {
        alert("unsupported deferred prompt");
        return;
    }else{
        //alert("support deferred prompt");
    }
});

//Cette fonctionnalité ne détecte pas installation manuel
window.addEventListener('appinstalled', () => {
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    // Optionally, send analytics event to indicate successful install
    alert('UL Maps bien installé');
});

/**
 * Ouvrir la popup de supression
 */
function openModal() {
    document.querySelector(".alert-warning").style.display="block";
}

/**
 * fermer la popup de supression
 */
function closeModal() {
    document.querySelector(".alert-warning").style.display="none";
    document.querySelector(".alert-img").style.display="none";
}

function displayImg(){
    document.querySelector(".alert-warning").style.display = "none";
    document.querySelector(".alert-img").style.display = "block";
}

/**
 * vider array images
 */
function empty() {
    images.length = 0;
}

/**
 * Rediriger dans la popup d'installation d'image Android
 */
function displayiOS(){
    empty();
    images.push(
        "assets/image/installation_ios_1.png",
        "assets/image/installation_ios_2.png",
    );
    displaySlides();
}

function displaySlides(){
    // images slide
    createSlide(images.length);
    createDot(images.length);
    showSlides(slideIndex);
    document.querySelector(".prev").addEventListener('click', ()=>{
        plusSlides(-1);
    })
    document.querySelector(".next").addEventListener('click', ()=>{
        plusSlides(1);
    })
    for(let i = 0; i < document.querySelectorAll(".dot").length; i++){
        document.querySelectorAll(".dot")[i].addEventListener("click", ()=>{currentSlide(i+1);})
    }
}

/**
 * Rediriger dans la popup d'installation d'image Android
 */
function displayAndroid(){
    empty();
    images.push(
        "assets/image/installation_android_1.png",
        "assets/image/installation_android_2.png",
    );
    displaySlides();
}

let btnAdd = document.querySelector("#install");
btnAdd.addEventListener('click', async () => {
    // hide our user interface that shows our A2HS button
    // Show the prompt
    if (!deferredPrompt) {
        //alert("unsupported deferred prompt");
        openModal();
        return;
    }
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    await deferredPrompt.userChoice
        .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
});

let close = document.querySelector(".d-modal-head-right");
let btnDisplay = document.querySelector(".btn-display");
let btnAnnuler = document.querySelector(".btn-annuler");
let closeImg = document.querySelector(".close-img");
let btniOS = document.querySelector(".btn-ios");
let btnAndroid = document.querySelector(".btn-android");

close.addEventListener("click", closeModal);
btnDisplay.addEventListener("click", ()=>{displayImg(); displayAndroid();});
btnAnnuler.addEventListener("click", closeModal);
closeImg.addEventListener("click", closeModal);
btniOS.addEventListener("click", displayiOS);
btnAndroid.addEventListener("click", displayAndroid);



//====================== image slide ===========================

function createSlide(nbImage){
    let slideContainer = document.querySelector(".slide-container");

    while (slideContainer.hasChildNodes()) {
        slideContainer.removeChild(slideContainer.firstChild);
    }

    let prev = document.createElement("a");
    prev.className = "prev";
    prev.innerHTML = "&#10094;";

    let next = document.createElement("a");
    next.className = "next";
    next.innerHTML = "&#10095;";

    for (let i = 0; i < nbImage; i++){
        let customSlider = document.createElement("div");
        customSlider.className = "custom-slider fade";

        let slideIndex = document.createElement("div");
        slideIndex.className = "slide-index";
        slideIndex.innerHTML = `${i + 1}/${nbImage}`;

        let slideImg = document.createElement("img");
        slideImg.className = "slide-img";
        slideImg.src = images[i];

        customSlider.appendChild(slideIndex);
        customSlider.appendChild(slideImg);
        slideContainer.appendChild(customSlider);
    }
    slideContainer.appendChild(prev);
    slideContainer.appendChild(next);
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function createDot(nbImage){
    let slideDot = document.querySelector(".slide-dot");

    while (slideDot.hasChildNodes()) {
        slideDot.removeChild(slideDot.firstChild);
    }

    for (let i = 0; i < nbImage; i++){
        let span = document.createElement("span");
        span.className = "dot";
        slideDot.appendChild(span);
    }
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("custom-slider");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active2", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active2";
}
