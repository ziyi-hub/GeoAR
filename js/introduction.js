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
    /*document.querySelector('#install').style.display = 'block';*/
    if (!deferredPrompt) {
        alert("unsupported deferred prompt");
        return;
    }else{
        alert("support deferred prompt");
    }
});

let btnAdd = document.querySelector("#install");
btnAdd.addEventListener('click', async () => {
    // hide our user interface that shows our A2HS button
    //btnAdd.style.display = 'none';
    // Show the prompt
    if (!deferredPrompt) {
        alert("unsupported deferred prompt");
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