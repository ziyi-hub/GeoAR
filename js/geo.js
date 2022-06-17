/**
 * il permet de récupérer des datas
 * @param url url d'un fichier data
 * @return {Promise<String[]>}
 */
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

/**
 * il permet de calculer la distance de l'Université de Lorraine
 * @param lat1 latitude de l'Université de Lorraine
 * @param lng1 longitude de l'Université de Lorraine
 * @param lat2 latitude de ma position courant
 * @param lng2 longitude de ma position courant
 * @return {number}
 */
function getDistance(lat1, lng1, lat2, lng2){
    let radLat1 = lat1 * Math.PI/ 180.0 ;
    let radLat2 = lat2 * Math.PI/ 180.0 ;
    let a = radLat1 - radLat2;
    let b = lng1 * Math.PI/ 180.0 - lng2 * Math.PI/ 180.0 ;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137; //Earth radius
    return Math.round(s * 10000) / 10000;
}

/**
 * il permet d'enregistrer un valeur dans un cookie
 * @param cname nom de cookie
 * @param cvalue valeur de cookie
 * @param exdays date d'expiration
 */
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * il permet de générer des points d'intérêt
 * @param places array[]
 */
function generatePOIS(places){
    const scene = document.querySelector('a-scene');
    places.forEach((place) => {
        // add place name
        const image = document.createElement('a-image');
        image.setAttribute('gps-entity-place', `latitude: ${place.latitude}; longitude: ${place.longitude};`);

        // actualise POI toutes les dix secondes
        window.setInterval(()=>{
            navigator.geolocation.getCurrentPosition(function (position) {
                let dis = getDistance(place.latitude, place.longitude, position.coords.latitude, position.coords.longitude);
                console.log(dis + " " + place.name + " ");
                if (dis <= 1){
                    image.setAttribute("width", ((dis * 0.4) / 0.1).toString());
                    image.setAttribute("height", ((dis * 0.4) / 0.1).toString());
                }
                else if(1 < dis < 5){
                    //s'agrandit 4 fois de taille original
                    image.setAttribute("width", ((dis * 4) / 1.8).toString());
                    image.setAttribute("height", ((dis * 4) / 1.8).toString());
                }else{
                    image.setAttribute("width", "6");
                    image.setAttribute("height", "6");
                }
            });
        }, 10000);
        
        image.setAttribute('src', place.image);
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
                    this.el.addEventListener('click', () => {
                        // effacer informations dans panneau
                        let content = document.querySelector(".panel");
                        while (content.hasChildNodes()) {
                            content.removeChild(content.firstChild);
                        }
                        //console.log(this.el);

                        //afficher panneau
                        content.style.display = "block";
                        content.style.position = "absolute";
                        content.style.right = "0";
                        content.style.width = "320px";

                        //déclarer noeuds
                        let p = document.createElement("p");
                        let p2 = document.createElement("p");
                        let p3 = document.createElement("p");
                        let close = document.createElement("span");
                        let button = document.createElement("button");
                        let img = document.createElement("img");
                        let latitude = this.el.dataset.latitude;
                        let longitude = this.el.dataset.longitude;

                        //initialise class
                        img.className = "fit-picture";
                        img.src = this.el.dataset.image;
                        img.alt = this.el.dataset.titre;
                        button.className = "mdl-button mdl-button--raised mdl-button--accent";
                        button.innerHTML = "Afficher plus";
                        p.className = "text-large";
                        p.innerHTML = this.el.dataset.titre;
                        p2.innerHTML = this.el.dataset.description;
                        let distance = getDistance(latitude, longitude, position.coords.latitude, position.coords.longitude);

                        //comparer la distance
                        if (distance < 1){
                            p3.innerHTML = "Distances: " +  (distance * 1000).toFixed(0) + "m"
                        }else{
                            p3.innerHTML = "Distances: " +  distance.toFixed(2) + "km";
                        }

                        //button ferme
                        close.className = "text-large close";
                        close.innerHTML = "&#x2715;";

                        close.addEventListener("click", ()=>{
                            content.style.display = "none";
                        })

                        //ajout des noeuds
                        document.querySelector(".panel").appendChild(close);
                        document.querySelector(".panel").appendChild(p);
                        document.querySelector(".panel").appendChild(p2);
                        document.querySelector(".panel").appendChild(p3);
                        document.querySelector(".panel").appendChild(button);
                        document.querySelector(".panel").appendChild(img);

                        //transférer datas dans page poiDetail
                        document.querySelector('.mdl-button').addEventListener("click", ()=>{
                            setCookie("id", this.el.dataset.id, 1);
                            setCookie("returnGeo", "true", 1);
                            window.location.href = "poiDetail.html";
                        });
                    });
                }
            });
            
            // charger datas
            sendXhrPromise("../datas/places.json").then((places) => {
                generatePOIS(places);
            })
        },
        (err) => console.error('Error in retrieving position', err),
        {enableHighAccuracy: true, maximumAge: 0, timeout: 27000,}
    );
};
