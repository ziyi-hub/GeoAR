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
    document.querySelector(".alert-system").style.display="none";
    document.querySelector(".alert-img").style.display="none";
}

/**
 * Retourner dans la popup de demande de système
 */

function backSystem(){
    document.querySelector(".alert-system").style.display = "block";
    document.querySelector(".alert-warning").style.display = "none";
    document.querySelector(".alert-img").style.display = "none";
}

/**
 * Rediriger dans la popup warning
 */

function displayModel(){
    document.querySelector(".alert-system").style.display = "block";
    document.querySelector(".alert-warning").style.display = "none";
    document.querySelector(".alert-img").style.display = "none";
}

/**
 * Rediriger dans la popup d'installation d'image Android
 */
function displayiOS(){
    document.querySelector(".alert-warning").style.display = "none";
    document.querySelector(".alert-system").style.display = "none";
    document.querySelector(".alert-img").style.display = "block";
    let navigator = getBrowserType();
    console.log(navigator);
    switch(navigator) {
        case "Safari":
            document.querySelector(".install-img").setAttribute("src", "./assets/image/installation_1.png");
            document.querySelector(".btn-continue").addEventListener("click", ()=>{
                closeModal();
            })
            break;
        default:
            document.querySelector("#alert-info").style.display = "none";
            document.querySelector(".body-img").innerHTML = "Votre navigateur " + navigator + " non pris en charge, vous devriez ouvrir avec Safari";
            break;
    }
}

/**
 * Rediriger dans la popup d'installation d'image Android
 */
function displayAndroid(){
    document.querySelector(".alert-warning").style.display = "none";
    document.querySelector(".alert-system").style.display = "none";
    document.querySelector(".alert-img").style.display = "block";
    let navigator = getBrowserType();
    console.log(navigator);
    switch(navigator) {
        case "Chrome":
            document.querySelector(".install-img").setAttribute("src", "./assets/image/installation_2.JPG");
            document.querySelector(".btn-continue").addEventListener("click", ()=>{
                closeModal();
            });
            break;
        default:
            document.querySelector("#alert-info").style.display = "none";
            document.querySelector(".body-img").innerHTML = "Votre navigateur " + navigator + " non pris en charge, vous devriez ouvrir avec Chrome";
            break;
    }
}

function getBrowserType(){
    let userAgent = navigator.userAgent;
    let browser='unknown';
    if(userAgent.indexOf('Firefox')!=-1){
        browser="Firefox";
    }else if(userAgent.indexOf('OPR')!=-1){
        browser="Opera";
    }else if(userAgent.indexOf('Chrome')!=-1){
        browser="Chrome";
    }else if(userAgent.indexOf('Safari')!=-1){
        browser="Safari";
    }
    return browser;
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

window.addEventListener('appinstalled', () => {
    // Clear the deferredPrompt so it can be garbage collected
    deferredPrompt = null;
    // Optionally, send analytics event to indicate successful install
    alert('UL Maps was installed');
});