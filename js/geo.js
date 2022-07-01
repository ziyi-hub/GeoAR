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
/*
navigator.permissions.query({name: 'camera'})
    .then((permissionObj) => {
        console.log(permissionObj.state);
    })
    .catch((error) => {
        console.log('Got error :', error);
    })
*/
//window.onload = () => {
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
//};


//========================gos-camera2==========================
AFRAME.registerComponent('gps-camera2', {
    _watchPositionId: null,
    originCoords: null,
    currentCoords: null,
    lookControls: null,
    heading: null,

    schema: {
        positionMinAccuracy: {
            type: 'int',
            default: 100,
        },
        alert: {
            type: 'boolean',
            default: false,
        },
        minDistance: {
            type: 'int',
            default: 0,
        }
    },

    init: function () {
        if (this.el.components['look-controls'] === undefined) {
            return;
        }

        this.lookControls = this.el.components['look-controls'];

        // listen to deviceorientation event
        var eventName = this._getDeviceOrientationEventName();
        this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

        // if Safari
        if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
            // iOS 13+
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                var handler = function() {
                    console.log('Requesting device orientation permissions...')
                    DeviceOrientationEvent.requestPermission();
                    document.removeEventListener('touchend', handler);
                };
                document.addEventListener('touchend', function() { handler() }, false);
            }
        }

        window.addEventListener(eventName, this._onDeviceOrientation, false);

        this._watchPositionId = this._initWatchGPS(function (position) {
            this.currentCoords = position.coords;
            this._updatePosition();
        }.bind(this));
    },

    tick: function () {
        if (this.heading === null) {
            return;
        }
        this._updateRotation();
    },

    remove: function () {
        if (this._watchPositionId) {
            navigator.geolocation.clearWatch(this._watchPositionId);
        }
        this._watchPositionId = null;

        var eventName = this._getDeviceOrientationEventName();
        window.removeEventListener(eventName, this._onDeviceOrientation, false);
    },

    /**
     * Get device orientation event name, depends on browser implementation.
     * @returns {string} event name
     */
    _getDeviceOrientationEventName: function () {
        if ('ondeviceorientationabsolute' in window) {
            var eventName = 'deviceorientationabsolute'
        } else if ('ondeviceorientation' in window) {
            var eventName = 'deviceorientation'
        } else {
            var eventName = ''
            console.error('Compass not supported')
        }

        return eventName
    },

    /**
     * Get current user position.
     *
     * @param {function} onSuccess
     * @param {function} onError
     * @returns {Promise}
     */
    _initWatchGPS: function (onSuccess, onError) {
        if (!onError) {
            onError = function (err) {
                console.warn('ERROR(' + err.code + '): ' + err.message)

                if (err.code === 1) {
                    // User denied GeoLocation, let their know that
                    alert('Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website.');
                    return;
                }

                if (err.code === 3) {
                    alert('Cannot retrieve GPS position. Signal is absent.');
                    return;
                }
            };
        }

        if ('geolocation' in navigator === false) {
            onError({ code: 0, message: 'Geolocation is not supported by your browser' });
            return Promise.resolve();
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
        return navigator.geolocation.watchPosition(onSuccess, onError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        });
    },

    /**
     * Update user position.
     *
     * @returns {void}
     */
    _updatePosition: function () {
        // don't update if accuracy is not good enough
        if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
            if (this.data.alert && !document.getElementById('alert-popup')) {
                var popup = document.createElement('div');
                popup.innerHTML = 'GPS signal is very poor. Try move outdoor or to an area with a better signal.'
                popup.setAttribute('id', 'alert-popup');
                document.body.appendChild(popup);
            }
            return;
        }

        var alertPopup = document.getElementById('alert-popup');
        if (this.currentCoords.accuracy <= this.data.positionMinAccuracy && alertPopup) {
            document.body.removeChild(alertPopup);
        }

        if (!this.originCoords) {
            this.originCoords = this.currentCoords;
        }

        var position = this.el.getAttribute('position');

        // compute position.x
        var dstCoords = {
            longitude: this.currentCoords.longitude,
            latitude: this.originCoords.latitude,
        };
        position.x = this.computeDistanceMeters(this.originCoords, dstCoords);
        position.x *= this.currentCoords.longitude > this.originCoords.longitude ? 1 : -1;

        // compute position.z
        var dstCoords = {
            longitude: this.originCoords.longitude,
            latitude: this.currentCoords.latitude,
        }
        position.z = this.computeDistanceMeters(this.originCoords, dstCoords);
        position.z *= this.currentCoords.latitude > this.originCoords.latitude ? -1 : 1;

        // update position
        this.el.setAttribute('position', position);
    },

    /**
     * Returns distance in meters between source and destination inputs.
     *
     *  Calculate distance, bearing and more between Latitude/Longitude points
     *  Details: https://www.movable-type.co.uk/scripts/latlong.html
     *
     * @param {Position} src
     * @param {Position} dest
     * @param {Boolean} isPlace
     *
     * @returns {number} distance
     */
    computeDistanceMeters: function (src, dest, isPlace) {
        var dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
        var dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

        var a = (Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2)) + Math.cos(THREE.Math.degToRad(src.latitude)) * Math.cos(THREE.Math.degToRad(dest.latitude)) * (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
        var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distance = angle * 6378160;

        // if function has been called for a place, and if it's too near and a min distance has been set,
        // set a very high distance to hide the object
        if (isPlace && this.data.minDistance && this.data.minDistance > 0 && distance < this.data.minDistance) {
            return Number.MAX_SAFE_INTEGER;
        }

        return distance;
    },

    /**
     * Compute compass heading.
     *
     * @param {number} alpha
     * @param {number} beta
     * @param {number} gamma
     *
     * @returns {number} compass heading
     */
    _computeCompassHeading: function (alpha, beta, gamma) {

        // Convert degrees to radians
        var alphaRad = alpha * (Math.PI / 180);
        var betaRad = beta * (Math.PI / 180);
        var gammaRad = gamma * (Math.PI / 180);

        // Calculate equation components
        var cA = Math.cos(alphaRad);
        var sA = Math.sin(alphaRad);
        var sB = Math.sin(betaRad);
        var cG = Math.cos(gammaRad);
        var sG = Math.sin(gammaRad);

        // Calculate A, B, C rotation components
        var rA = - cA * sG - sA * sB * cG;
        var rB = - sA * sG + cA * sB * cG;

        // Calculate compass heading
        var compassHeading = Math.atan(rA / rB);

        // Convert from half unit circle to whole unit circle
        if (rB < 0) {
            compassHeading += Math.PI;
        } else if (rA < 0) {
            compassHeading += 2 * Math.PI;
        }

        // Convert radians to degrees
        compassHeading *= 180 / Math.PI;

        return compassHeading;
    },

    /**
     * Handler for device orientation event.
     *
     * @param {Event} event
     * @returns {void}
     */
    _onDeviceOrientation: function (event) {
        if (event.webkitCompassHeading !== undefined) {
            if (event.webkitCompassAccuracy < 50) {
                this.heading = event.webkitCompassHeading;
            } else {
                console.warn('webkitCompassAccuracy is event.webkitCompassAccuracy');
            }
        } else if (event.alpha !== null) {
            if (event.absolute === true || event.absolute === undefined) {
                this.heading = this._computeCompassHeading(event.alpha, event.beta, event.gamma);
            } else {
                console.warn('event.absolute === false');
            }
        } else {
            console.warn('event.alpha === null');
        }
    },

    /**
     * Update user rotation data.
     *
     * @returns {void}
     */
    _updateRotation: function () {
        var heading = 360 - this.heading;
        var cameraRotation = this.el.getAttribute('rotation').y;
        var yawRotation = THREE.Math.radToDeg(this.lookControls.yawObject.rotation.y);
        var offset = (heading - (cameraRotation - yawRotation)) % 360;
        this.lookControls.yawObject.rotation.y = THREE.Math.degToRad(offset);
    },
});
