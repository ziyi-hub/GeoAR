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
 * Rediriger dans la popup d'installation d'image Android
 */
function displayiOS(){
    document.querySelector(".install-img").setAttribute("src", "./assets/image/installation_1.png");
}

/**
 * Rediriger dans la popup d'installation d'image Android
 */
function displayAndroid(){
    document.querySelector(".install-img").setAttribute("src", "./assets/image/installation_2.JPG");
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
