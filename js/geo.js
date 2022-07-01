import datas from "./getDatas.js";

let slideIndex = 1;
let images = [
    "../assets/image/videoPoi.gif",
    "../assets/image/videoRadar.gif",
    "../assets/image/videoAccueil.gif"
];

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
                let dis = datas.getDistance(place.latitude, place.longitude, position.coords.latitude, position.coords.longitude);
                //console.log(dis + " " + place.name + " ");
                if (dis <= 1){
                    image.setAttribute("width", (dis * 4).toString());
                    image.setAttribute("height", (dis * 4).toString());
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
        image.setAttribute('look-at', "[camera]");
        image.setAttribute('data-id', place.id);
        image.setAttribute('data-latitude', place.latitude);
        image.setAttribute('data-longitude', place.longitude);
        image.setAttribute('data-titre', place.name);
        image.setAttribute('data-description', place.description);
        image.setAttribute('data-image', place.image);
        image.setAttribute('href', "javascript:void(0)");
        image.setAttribute('scale', '120 120 120');
        image.setAttribute('side', "front");
        image.setAttribute('opacity', "0.7");
        image.setAttribute('open-window-on-click', "");
        image.setAttribute('cursor-listener', "");

        //Lorsque cursor cible un POI, son couleur va changer en rouge
        image.addEventListener('mouseenter', changeColor);
        image.addEventListener('mouseleave', changeBack);
        let cursor = document.querySelector('#cursor');
        function changeColor () {
            cursor.setAttribute('material', 'color: #bbf085; shader: flat');
        }

        function changeBack () {
            cursor.setAttribute('material', 'color: red; shader: flat');
        }

        image.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'));
        });
        scene.appendChild(image);
    });
}

function getCurPosition(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

function closeModal(){
    document.querySelector(".d-modal").style.display = "none";
    localStorage.setItem('closeModal', "true");
    // effacer flous
    let others = document.querySelectorAll('body > *');
    [].forEach.call(others, function(elem){
        elem.style.filter = 'initial';
    });
}

function displayContenu(n){
    let description = document.querySelector(".description");
    while (description.hasChildNodes()) {
        description.removeChild(description.firstChild);
    }
    if (n === images.length){
        document.querySelector(".d-btn").style.display = "inline-block";
        let p1 = document.createElement("p");
        p1.innerHTML = "I. Découvrez les 5 Université de Lorraine les plus proches dans l'accueil<br>II. Voyez plus informations sur Découvrir";
        description.appendChild(p1);
    }else if (n === 1){
        let p1 = document.createElement("p");
        p1.innerHTML = "I. Utilisez votre caméra pour inspecter lentement ce qui vous entoure<br>II. Utilisez curseur pour cibler des UL<br>III. Cliquez sur la zone au-dessous de POI pour activer panneau<br>IV. Cliquez sur bouton AFFICHER PLUS pour voir plus informations";
        description.appendChild(p1);
    } else if (n === 2){
        let p1 = document.createElement("p");
        p1.innerHTML = "I. Tournez votre mobile, l’emplacement de chaque UL dans radar va changer en temps réel";
        description.appendChild(p1);
    }
    document.querySelector(".d-btn").addEventListener("click", closeModal);
}

function plusSlides(n) {
    showSlidesGeo(slideIndex += n);
}

function currentSlide(n) {
    showSlidesGeo(slideIndex = n);
}

function showSlidesGeo(n) {
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

//========================= init ==============================
(localStorage.getItem('closeModal') === "true")?closeModal():null;

document.querySelector(".d-modal-head-right").addEventListener("click", closeModal);

// images slide
datas.createSlide(images.length, images);
datas.createDot(images.length);
showSlidesGeo(slideIndex);
displayContenu(slideIndex);
document.querySelector(".prev").addEventListener('click', ()=>{
    plusSlides(-1);
    displayContenu(slideIndex);
    document.querySelector(".d-btn").addEventListener("click", closeModal);
})
document.querySelector(".next").addEventListener('click', ()=>{
    plusSlides(1);
    displayContenu(slideIndex);
    document.querySelector(".d-btn").addEventListener("click", closeModal);
})
for(let i = 0; i < document.querySelectorAll(".dot").length; i++){
    document.querySelectorAll(".dot")[i].addEventListener("click", ()=>{currentSlide(i+1);})
}


// Component pour s'agrandir POI on click.
AFRAME.registerComponent('cursor-listener', {
    init: function () {
        let widthOriginal, heightOriginal;
        this.el.addEventListener('mouseenter', function () {
            widthOriginal = this.getAttribute("width");
            heightOriginal = this.getAttribute("height");
            this.setAttribute("width", (parseFloat(this.getAttribute("width")) * 1.1).toString());
            this.setAttribute("height", (parseFloat(this.getAttribute("height")) * 1.1).toString());
            this.setAttribute('opacity', "1");
        });

        this.el.addEventListener('mouseleave', function () {
            this.setAttribute("width", widthOriginal);
            this.setAttribute("height", heightOriginal);
            this.setAttribute('opacity', "0.7");
        });
    }
});

//AFRAME
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

            getCurPosition()
                .then((position) => {
                    let distance = datas.getDistance(latitude, longitude, position.coords.latitude, position.coords.longitude);
                    //comparer la distance
                    if (distance < 1){
                        p3.innerHTML = "Distances: " +  (distance * 1000).toFixed(0) + "m"
                    }else{
                        p3.innerHTML = "Distances: " +  distance.toFixed(2) + "km";
                    }
                })
                .catch((err) => {
                    console.error(err.message);
                });

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
                datas.setCookie("id", this.el.dataset.id, 1);
                datas.setCookie("returnGeo", "true", 1);
                window.location.href = "poiDetail.html";
            });
        });
    }
});

// charger datas
datas.sendXhrPromise("../datas/places.json").then((places) => {
    generatePOIS(places);
})

