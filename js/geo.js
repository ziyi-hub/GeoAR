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


AFRAME.registerComponent('change-color-on-click', {
    init: function () {
        let scene = document.querySelector('a-scene');
        scene.querySelectorAll("a-link").forEach(link => {
            link.onclick = () => {
                const title = link.getAttribute("title");
                const label = document.createElement('span');
                const container = document.createElement('div');
                container.setAttribute('id', 'place-label');
                label.innerText = title;
                container.style.zIndex = "999";
                container.appendChild(label);
                document.body.appendChild(container);
                //alert(link.dataset.description);
                //window.open(link.getAttribute("href"))
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
                    /*const text = document.createElement('a-link');
                    text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    text.setAttribute('title', place.name);
                    text.setAttribute('data-description', place.description);*/
                    const icon = document.createElement('a-image');
                    icon.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                    icon.setAttribute('title', place.name);
                    icon.setAttribute('src', '../assets/splashscreen/logo.png');
                    icon.setAttribute('data-description', place.description);

                    // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
                    icon.setAttribute('scale', '20, 20');

                    icon.addEventListener('loaded', () => window.dispatchEvent(new CustomEvent('gps-entity-place-loaded')));

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
