const loadPlaces = function () {

    let PLACES;
    let request = new XMLHttpRequest();

    request.open('GET','https://ziyi-hub.github.io/GeoAR/datas/places.json', false);
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            PLACES = JSON.parse(this.responseText);
        }
    };
    request.send();
    return Promise.resolve(PLACES);
};

function getDistance(lat1, lng1, lat2, lng2){
    let radLat1 = lat1 * Math.PI/ 180.0 ;
    let radLat2 = lat2 * Math.PI/ 180.0 ;
    let a = radLat1 - radLat2;
    let b = lng1 * Math.PI/ 180.0 - lng2 * Math.PI/ 180.0 ;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137; //Earth radius
    s = Math.round(s * 10000) / 10000;
    return s;
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


AFRAME.registerComponent('change-color-on-click', {
    init: function () {
        let scene = document.querySelector('a-scene');
        let latCur;
        let lngCur;
        
        scene.querySelectorAll("a-link").forEach(link => {
            link.onclick = (ev) => {
                
                ev.stopPropagation();
                ev.preventDefault();
                
                if (navigator.geolocation)
                {
                    navigator.geolocation.getCurrentPosition((position)=>{
                        latCur = position.coords.latitude;
                        lngCur = position.coords.longitude;
                    });
                } else{
                    alert("Geolocation is not supported by this browser.");
                }
                
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
                img.alt = link.dataset.image;
                button.className = "mdl-button mdl-button--raised mdl-button--accent";
                button.innerHTML = "Afficher plus";
                p.className = "text-large";
                p.innerHTML = link.dataset.titre;
                p2.innerHTML = link.dataset.description;
                p3.innerHTML = "Distances: " + getDistance(latitude, longitude, latCur, lngCur) + " km";
                close.className = "text-large close";
                close.innerHTML = "&#x2718;";
                
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
                    setCookie("titre", link.dataset.titre, 1);
                    setCookie("description", link.dataset.description, 1);
                    setCookie("latitude", latitude, 1);
                    setCookie("longitude", longitude, 1);
                    setCookie("adresse", link.dataset.adresse, 1);
                    setCookie("site", link.dataset.site, 1);
                    window.location.href = "poiDetail.html";
                })
            }
        })
    }
});


window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

            // than use it to load from remote APIs some places nearby
            loadPlaces()
                .then((places) => {
                    places.forEach((place) => {
                        const latitude = place.latitude;
                        const longitude = place.longitude;

                        // add place name
                        const text = document.createElement('a-link');
                        text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                        text.setAttribute('data-latitude', place.latitude);
                        text.setAttribute('data-longitude', place.longitude);
                        text.setAttribute('data-titre', place.name);
                        text.setAttribute('data-description', place.description);
                        text.setAttribute('data-image', place.image);
                        text.setAttribute('data-adresse', place.adresse);
                        text.setAttribute('data-site', place.site);
                        text.setAttribute('data-carousel', place.carousel);

                        text.setAttribute('href', "javascript:void(0)");
                        text.setAttribute('scale', '120 120 120');
                        text.setAttribute('change-color-on-click', "")

                        text.addEventListener('loaded', () => {
                            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                        });

                        /*
                        const text = document.createElement('a-image');
                        text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                        text.setAttribute('name', place.name);
                        text.setAttribute('data-description', place.description);
                        text.setAttribute('src', place.image);
                        text.setAttribute('scale', '20, 20');
                        */
                        scene.appendChild(text);
                    });
                })
        },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
