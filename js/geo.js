const list = document.querySelectorAll(".list");
function activeLink(){
    list.forEach((item)=>
        item.classList.remove("active"));
    this.classList.add("active");
}
list.forEach((item) => item.addEventListener('click', activeLink));


const loadPlaces = function () {

    let PLACES;
    let request = new XMLHttpRequest();

    request.open('GET','../datas/places.json', false);
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            PLACES = JSON.parse(this.responseText);
        }
    };
    request.send();
    return Promise.resolve(PLACES);
};

let latCur;
let lngCur;

function getLocation()
{
    if (navigator.geolocation) 
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    } 
    else{
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position)
{
    let lng = position.coords.longitude;
    let lat = position.coords.latitude;
    //return [lat.toFixed(8), lng.toFixed(8)];
    latCur = lat.toFixed(8);
    lngCur = lng.toFixed(8)
}

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


AFRAME.registerComponent('change-color-on-click', {
    init: function () {
        let scene = document.querySelector('a-scene');
        scene.querySelectorAll("a-link").forEach(link => {
            link.onclick = () => {
                getLocation();                
                let content = document.querySelector(".panel");
                while (content.hasChildNodes()) {
                    content.removeChild(content.firstChild);
                }
                
                //const title = link.getAttribute("title");
                document.querySelector(".panel").style.display = "block";
                let p = document.createElement("p");
                let p2 = document.createElement("p");
                let p3 = document.createElement("p");
                let button = document.createElement("button");
                let img = document.createElement("img");
                let latitude = link.dataset.latitude;
                let longitude = link.dataset.longitude;
                
                img.className = "fit-picture";
                img.src = link.dataset.image;
                img.alt = link.dataset.image;
                button.className = "mdl-button mdl-button--raised mdl-button--accent";
                button.innerHTML = "Afficher plus";
                p.style.fontSize = "2em";
                p.innerHTML = link.dataset.titre;
                p2.innerHTML = link.dataset.description;
                p3.innerHTML = "Distances: " + getDistance(latitude, longitude, latCur, lngCur);
                
                document.querySelector(".panel").appendChild(p);
                document.querySelector(".panel").appendChild(p2);
                document.querySelector(".panel").appendChild(p3);
                document.querySelector(".panel").appendChild(button);
                document.querySelector(".panel").appendChild(img);
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
                        //text.setAttribute('href', place.image);
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
