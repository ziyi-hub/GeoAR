alert(document.cookie);


function initialize() {
    let mapProp = {
        center:new google.maps.LatLng(48.684457, 6.163311),
        zoom:4,
        mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    let myLatLng = {lat: 48.684457, lng: 6.163311};
    let marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
    });

    let myLatLng2 = {lat: 50.684457, lng: 7.163311};
    let marker2 = new google.maps.Marker({
        position: myLatLng2,
        map: map,
    });

}

google.maps.event.addDomListener(window, 'load', initialize);

let isMap = true;

document.querySelector(".mdl-button").addEventListener("click", ()=>{
    isMap = !isMap;
    if(!isMap){
        document.querySelector("#infos").style.visibility = "visible";
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
         * cacher informations et afficher map
         * @type {string}
         */
        document.querySelector("#infos").style.visibility = "hidden";
        document.querySelector("#googleMap").style.visibility = "visible";
        document.querySelector(".material-icons").innerHTML = "event_note";
        document.querySelector(".mdl-button").style.position = "absolute";
    }
})
