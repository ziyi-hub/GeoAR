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


const clickListener = function(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    const title = ev.target.getAttribute('title');

    /*const el = ev.detail.intersection && ev.detail.intersection.object.el;

    if (el && el === ev.target) {
        const label = document.createElement('span');
        const container = document.createElement('div');
        container.setAttribute('id', 'place-label');
        label.innerText = title;
        container.appendChild(label);
        document.body.appendChild(container);
    }*/
    alert(el && el === ev.target);
};

AFRAME.registerComponent('change-color-on-click', {
    init: function () {
        this.el.addEventListener('click', clickListener);
    }
});


window.onload = () => {
    const scene = document.querySelector('a-scene');
    var constraints = {audio: true, video: false}

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
                    text.setAttribute('title', place.name);
                    text.setAttribute('data-id', place.name);
                    //text.setAttribute('href', place.image);
                    text.setAttribute('scale', '120 120 120');
                    text.setAttribute('change-color-on-click', "")

                    text.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

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
