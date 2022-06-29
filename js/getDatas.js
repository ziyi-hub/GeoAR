let slideIndex = 1;

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

function createSlide(nbImage, images){
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

function plusSlides(n) {
    showSlidesIntro(slideIndex += n);
}

function currentSlide(n) {
    showSlidesIntro(slideIndex = n);
}

function showSlidesIntro(n) {
    let i;
    let slides = document.getElementsByClassName("custom-slider");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active2", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active2";
}

export default {
    sendXhrPromise: sendXhrPromise,
    setCookie: setCookie,
    getDistance: getDistance,
    createSlide: createSlide,
    createDot: createDot,
    plusSlides: plusSlides,
    currentSlide: currentSlide,
    showSlidesIntro: showSlidesIntro,
}