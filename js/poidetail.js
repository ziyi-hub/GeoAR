let place = loadPlaces();
let images = place.carousel;

/**
 * Il permet de récupérer un élément dans cookie transmettant
 * @param cname nom de cookie
 * @return {string} valeur retourné
 */
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

/**
 * On parcourt toutes les données, si le id de chaque université correspond au id transmettant, alors renvoie tous les éléments de cette université
 * @return {*}
 */
function loadPlaces() {
    let places;
    let request = new XMLHttpRequest();
    let id = getCookie('id');

    request.open('GET','../datas/places.json', false);
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            places = JSON.parse(this.responseText).find(place => parseInt(place.id) == id);
        }
    };
    request.send();
    return places;
}

/**
 * Il permet de initialiser Google Maps
 * @param content
 */
function initMap(content) {
    let mapProp = {
        center: new google.maps.LatLng(parseFloat(place.latitude), parseFloat(place.longitude)),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    let map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    let myLatLng = {lat: parseFloat(place.latitude), lng: parseFloat(place.longitude)};
    let marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
    });

    let infoWindow = new google.maps.InfoWindow();
    
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent("<h6>" + content + "</h6>");
        infoWindow.open(map,marker);
    });
}

google.maps.event.addDomListener(window, 'load', initMap(place.name));

/**
 * Il permet de créer des images coulissantes
 * @param nbImage
 */
function createSlide(nbImage){
    let slideContainer = document.querySelector(".slide-container");

    while (slideContainer.hasChildNodes()) {
        slideContainer.removeChild(slideContainer.firstChild);
    }
    
    let prev = document.createElement("a");
    prev.className = "prev";
    prev.innerHTML = "&#10094;";

    let next = document.createElement("a");
    next.className = "next";
    next.innerHTML = "&#10095;";
    
    for (let i = 0; i < nbImage; i++){
        let customSlider = document.createElement("div");
        customSlider.className = "custom-slider fade";
        
        let slideIndex = document.createElement("div");
        slideIndex.className = "slide-index";
        slideIndex.innerHTML = `${i + 1}/${nbImage}`;

        let slideImg = document.createElement("img");
        slideImg.className = "slide-img";
        slideImg.src = images[i];
        
        customSlider.appendChild(slideIndex);
        customSlider.appendChild(slideImg);
        slideContainer.appendChild(customSlider);
    }
    slideContainer.appendChild(prev);
    slideContainer.appendChild(next);
}

/**
 * Il permet de créer des indicateur de position de l'image courantes
 * @param nbImage
 */
function createDot(nbImage){
    let slideDot = document.querySelector(".slide-dot");

    while (slideDot.hasChildNodes()) {
        slideDot.removeChild(slideDot.firstChild);
    }
    
    for (let i = 0; i < nbImage; i++){
        let span = document.createElement("span");
        span.className = "dot";
        slideDot.appendChild(span);
    }
}

document.querySelector(".titre").innerHTML = `${place.name}`;
document.querySelector(".description").innerHTML = `${place.description}`;
document.querySelector(".adresse").innerHTML = `${place.adresse}`;
document.querySelector(".site").innerHTML = `${place.site}`;
createSlide(place.carousel.length);
createDot(place.carousel.length);

let slideIndex = 1;
showSlides(slideIndex);

/**
 * Il permet de passer tutoriel suivant
 * @param n
 */
function plusSlides(n) {
    showSlides(slideIndex += n);
}

/**
 * Il permet de afficher tutoriel courant
 * @param n
 */
function currentSlide(n) {
    showSlides(slideIndex = n);
}

/**
 * Lorsque l'utilisateur passer tutoriel, son point d'indicateur correspondant va afficher en gris foncé, sinon en gris claire
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

document.querySelector(".prev").addEventListener('click', ()=>{plusSlides(-1)})

document.querySelector(".next").addEventListener('click', ()=>{plusSlides(1)})

for(let i = 0; i < document.querySelectorAll(".dot").length; i++){
    document.querySelectorAll(".dot")[i].addEventListener("click", ()=>{currentSlide(i+1);})
}

/**
 * il permet de revenir au page précédent correspondant
 */
document.querySelector(".btn-close").addEventListener("click", ()=>{
    let returnGeo = getCookie('returnGeo');
    if (returnGeo === "true"){
        window.location.href = "geo.html";
    }else{
        window.location.href = "decouvrir.html";
    }
});
