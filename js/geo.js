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
                document.querySelector(".panel").innerHTML = link.dataset.description;
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
                        const text = document.createElement('a-link');
                        text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                        text.setAttribute('title', place.name);
                        text.setAttribute('data-description', place.description);
                        //text.setAttribute('href', place.image);
                        //text.setAttribute('href', "poiDetail.html");
                        text.setAttribute('scale', '120 120 120');
                        text.setAttribute('change-color-on-click', "")

                        text.addEventListener('loaded', () => {
                            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                        });

                        /*
                        const text = document.createElement('a-image');
                        text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude}`);
                        text.setAttribute('name', place.name);
                        text.setAttribute('data-description', place.description);
                        text.setAttribute('src', place.image);
                        text.setAttribute('scale', '20, 20');
                        */
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
