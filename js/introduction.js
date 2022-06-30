import datas from "./getDatas.js";

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
    // Update UI notify the user they can add to home screen
    document.querySelector('#install').style.display = 'none';
    localStorage.setItem('appinstalled', "true");
    // Optionally, send analytics event to indicate successful install
    alert('Merci d\'avoir installé notre application!');
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
    document.querySelector(".btn-ios").style.backgroundColor = "#325ce1";
    document.querySelector(".btn-ios").style.color = "#fff";
    document.querySelector(".btn-ios").style.border = "1px solid #325ce1";
    document.querySelector(".btn-android").style.backgroundColor = "#fafafa";
    document.querySelector(".btn-android").style.color = "#999";
    document.querySelector(".btn-android").style.border = "1px solid #d9d9d9";
}

/**
 * Passer l'image précédente et l'image suivante
 */
function displaySlides(){
    datas.createSlide(images.length, images);
    datas.createDot(images.length);
    datas.showSlidesIntro(slideIndex);
    document.querySelector(".prev").addEventListener('click', ()=>{
        datas.plusSlides(-1);
    })
    document.querySelector(".next").addEventListener('click', ()=>{
        datas.plusSlides(1);
    })
    for(let i = 0; i < document.querySelectorAll(".dot").length; i++){
        document.querySelectorAll(".dot")[i].addEventListener("click", ()=>{datas.currentSlide(i+1);})
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
    document.querySelector(".btn-android").style.backgroundColor = "#325ce1";
    document.querySelector(".btn-android").style.color = "#fff";
    document.querySelector(".btn-android").style.border = "1px solid #325ce1";
    document.querySelector(".btn-ios").style.backgroundColor = "#fafafa";
    document.querySelector(".btn-ios").style.color = "#999";
    document.querySelector(".btn-ios").style.border = "1px solid #d9d9d9";
}

if(localStorage.getItem('appinstalled') === "true"){
    document.querySelector('#install').style.display = 'none';
}else{
    document.querySelector('#install').style.display = 'block';
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

