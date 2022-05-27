function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function loadPlaces() {

    let places;
    let request = new XMLHttpRequest();

    request.open('GET','https://ziyi-hub.github.io/GeoAR/datas/places.json', false);
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            places = JSON.parse(this.responseText);
        }
    };
    request.send();
    return Promise.resolve(places);
}

let id = getCookie('id');
let titre = getCookie("titre");
let description = getCookie("description");
let latitude = getCookie("latitude");
let longitude = getCookie("longitude");
let adresse = getCookie("adresse");
let site = getCookie("site");
//loadPlaces().then((places) => {places.forEach((place) => {console.log(parseInt(place.id) == id);});})
let places = loadPlaces();
//let place = places.find(place => parseInt(place.id) == id)
console.log(places);


function initialize() {
    let mapProp = {
        center: new google.maps.LatLng(48.684457, 6.163311),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    let myLatLng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
    let marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

let isMap = true;

document.querySelector(".mdl-button").addEventListener("click", ()=>{
    isMap = !isMap;
    if(!isMap){
        /**
         * cacher map et afficher description textuelle
         * @type {string}
         */
        document.querySelector("#infos").style.visibility = "visible";
        document.querySelector(".titre").innerHTML = `${titre}`;
        document.querySelector(".description").innerHTML = `${description}`;
        document.querySelector(".adresse").innerHTML = `${adresse}`;
        document.querySelector(".site").innerHTML = `${site}`;
        
        document.querySelector("#googleMap").style.visibility = "hidden";
        document.querySelector(".material-icons").innerHTML = "location_on";
        document.querySelector(".mdl-button").style.position = "fixed";

        /**
         * initialize index
         * @type {number}
         */
        let slideIndex = 1;
        showSlides(slideIndex);

        /**
         * passer slide suivant
         * @param n
         */
        function plusSlides(n) {
            showSlides(slideIndex += n);
        }

        /**
         * slide current
         * @param n
         */
        function currentSlide(n) {
            showSlides(slideIndex = n);
        }

        /**
         * créer dom slider et dot
         * @param n
         */
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
                dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[slideIndex-1].style.display = "block";
            dots[slideIndex-1].className += " active";
        }

        /**
         * passer precedent
         */
        document.querySelector(".prev").addEventListener('click', ()=>{plusSlides(-1)})

        /**
         * passer suivant
         */
        document.querySelector(".next").addEventListener('click', ()=>{plusSlides(1)})

        /**
         * passer sur dot
         */
        for(let i = 0; i < document.querySelectorAll(".dot").length; i++){
            document.querySelectorAll(".dot")[i].addEventListener("click", ()=>{currentSlide(i+1);})
        }
    }else{
        /**
         * cacher description textuelle et afficher map
         * @type {string}
         */
        document.querySelector("#infos").style.visibility = "hidden";
        document.querySelector("#googleMap").style.visibility = "visible";
        document.querySelector(".material-icons").innerHTML = "event_note";
        document.querySelector(".mdl-button").style.position = "absolute";
    }
})
