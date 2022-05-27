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
    let id = getCookie('id');

    request.open('GET','https://ziyi-hub.github.io/GeoAR/datas/places.json', false);
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            places = JSON.parse(this.responseText).find(place => parseInt(place.id) == id);
        }
    };
    request.send();
    return places;
}
let place = loadPlaces();
images = place.carousel;


function initMap(content) {
    let mapProp = {
        center: new google.maps.LatLng(parseFloat(place.latitude), parseFloat(place.longitude)),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

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


let isMap = true;

document.querySelector(".mdl-button").addEventListener("click", ()=>{
    isMap = !isMap;
    if(!isMap){
        /**
         * cacher map et afficher description textuelle
         * @type {string}
         */
        document.querySelector("#infos").style.visibility = "visible";
        document.querySelector(".titre").innerHTML = `${place.name}`;
        document.querySelector(".description").innerHTML = `${place.description}`;
        document.querySelector(".adresse").innerHTML = `${place.adresse}`;
        document.querySelector(".site").innerHTML = `${place.site}`;
        createSlide(place.carousel.length);
        createDot(place.carousel.length);
        
        document.querySelector("#googleMap").style.visibility = "hidden";
        document.querySelector(".icon-float").innerHTML = "location_on";
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
        document.querySelector(".icon-float").innerHTML = "event_note";
        document.querySelector(".mdl-button").style.position = "absolute";
    }
})
