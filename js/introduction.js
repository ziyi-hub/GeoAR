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
        alert("support deferred prompt");
    }
});

// Ouvrir la fenêtre de supression
function openModal() {
    document.querySelector(".d-modal").style.display="block"
}

// fermer la fenêtre de supression
function closeModal() {
    document.querySelector(".d-modal").style.display="none"
}

function getBrowserType(){
    let userAgent = navigator.userAgent;
    let browser='unknown';
    if (userAgent.indexOf("IE")!=-1) {
        browser="IE";
    }else if(userAgent.indexOf('Firefox')!=-1){
        browser="Firefox";
    }else if(userAgent.indexOf('OPR')!=-1){
        browser="Opera";
    }else if(userAgent.indexOf('Chrome')!=-1){
        browser="Chrome";
    }else if(userAgent.indexOf('Safari')!=-1){
        browser="Safari";
    }else if(userAgent.indexOf('Trident')!=-1){
        browser='IE 11';
    }
    return browser;
}

function changeParImage(){
    console.log(getBrowserType());
    let modalbody = document.querySelector(".d-modal-body");
    while (modalbody.hasChildNodes()) {
        modalbody.removeChild(modalbody.firstChild);
    }

    let div = document.createElement("div");
    let img1 = document.createElement("img"); 
    let p = document.createElement("h6");
    let button = document.createElement("button");
    
    div.setAttribute("id", "installation");
    div.className = "desc";
    
    img1.setAttribute("src", "./assets/image/installation_1.png");
    p.innerHTML = "1. Cliquez sur le bouton de partage<br/>2. Cliquez sur l'écran d'accueil<br>3. Cliquez sur Ajouter";
    button.className = "center btn btn-lg btn-primary btn-continue";
    button.innerHTML = "Continuer";
    button.style.width = "100%";
    
    div.appendChild(img1);
    div.appendChild(p);
    div.appendChild(button);
    
    modalbody.appendChild(div);
    modalbody.style.textAlign = "initial";
    
    button.addEventListener("click", ()=>{
        closeModal();
    })
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