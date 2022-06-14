function sendXhrPromise(url){
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.send();

        //Les données arrivent correctement
        xhr.addEventListener("load", function (response){
            resolve(response.target.response);
        });

        //On a un code d'erreur du serveur
        xhr.addEventListener("error", function (response){
            reject("data transfert error : " + response);
        });
    })
}


function getDistance(lat1, lng1, lat2, lng2){
    let radLat1 = lat1 * Math.PI/ 180.0 ;
    let radLat2 = lat2 * Math.PI/ 180.0 ;
    let a = radLat1 - radLat2;
    let b = lng1 * Math.PI/ 180.0 - lng2 * Math.PI/ 180.0 ;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137; //Earth radius
    return Math.round(s * 10000) / 10000;
}


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function generatePOIS(places){
    const scene = document.querySelector('a-scene');
    places.forEach((place) => {
        // add place name
        const image = document.createElement('a-image');
        image.setAttribute('gps-entity-place', `latitude: ${place.latitude}; longitude: ${place.longitude};`);
        image.setAttribute('src', place.image);
        navigator.geolocation.getCurrentPosition(function (position) {
            let dis = getDistance(place.latitude, place.longitude, position.coords.latitude, position.coords.longitude);
            if(dis > 1){
                image.setAttribute("width", "10");
                image.setAttribute("height", "10");
            }else{
                image.setAttribute("width", "0.5");
                image.setAttribute("height", "0.5");
            }
        });
        image.setAttribute('alt', place.name);
        image.setAttribute('data-id', place.id);
        image.setAttribute('data-latitude', place.latitude);
        image.setAttribute('data-longitude', place.longitude);
        image.setAttribute('data-titre', place.name);
        image.setAttribute('data-description', place.description);
        image.setAttribute('data-image', place.image);

        image.setAttribute('href', "javascript:void(0)");
        image.setAttribute('scale', '120 120 120');
        image.setAttribute('open-window-on-click', "")

        image.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });
        scene.appendChild(image);
    });
}


window.onload = () => {

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

            AFRAME.registerComponent('open-window-on-click', {
                init: function () {
                    let scene = document.querySelector('a-scene');
                    scene.querySelectorAll("a-image").forEach(link => {
                        link.onclick = (ev) => {

                            ev.stopPropagation();
                            ev.preventDefault();

                            let content = document.querySelector(".panel");
                            while (content.hasChildNodes()) {
                                content.removeChild(content.firstChild);
                            }

                            content.style.display = "block";
                            content.style.position = "absolute";
                            content.style.right = "0";
                            content.style.width = "320px";

                            let p = document.createElement("p");
                            let p2 = document.createElement("p");
                            let p3 = document.createElement("p");
                            let close = document.createElement("span");
                            let button = document.createElement("button");
                            let img = document.createElement("img");
                            let latitude = link.dataset.latitude;
                            let longitude = link.dataset.longitude;

                            img.className = "fit-picture";
                            img.src = link.dataset.image;
                            img.alt = link.dataset.titre;
                            button.className = "mdl-button mdl-button--raised mdl-button--accent";
                            button.innerHTML = "Afficher plus";
                            p.className = "text-large";
                            p.innerHTML = link.dataset.titre;
                            p2.innerHTML = link.dataset.description;
                            let distance = getDistance(latitude, longitude, position.coords.latitude, position.coords.longitude);
                            if (distance < 1){
                                p3.innerHTML = "Distances: " +  (distance * 1000).toFixed(0) + "m"
                            }else{
                                p3.innerHTML = "Distances: " +  distance.toFixed(2) + "km";
                            }
                            
                            close.className = "text-large close";
                            close.innerHTML = "&#x2715;";

                            close.addEventListener("click", ()=>{
                                content.style.display = "none";
                            })

                            document.querySelector(".panel").appendChild(close);
                            document.querySelector(".panel").appendChild(p);
                            document.querySelector(".panel").appendChild(p2);
                            document.querySelector(".panel").appendChild(p3);
                            document.querySelector(".panel").appendChild(button);
                            document.querySelector(".panel").appendChild(img);

                            document.querySelector('.mdl-button').addEventListener("click", ()=>{
                                setCookie("id", link.dataset.id, 1);
                                setCookie("returnGeo", "true", 1);
                                window.location.href = "poiDetail.html";
                            })
                        }
                    })
                }
            });

            // than use it to load from remote APIs some places nearby
            sendXhrPromise("../datas/places.json").then((places) => {generatePOIS(places);})
        },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
