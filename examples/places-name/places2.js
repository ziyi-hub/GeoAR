const loadPlaces = function () {

    const PLACES = [
        {
            name: "UFR ALL-NANCY",
            location: {
                lat: 48.6953523, // add here latitude if using static data
                lng: 6.1656114, // add here longitude if using static data
            }
        },
    ];

    return Promise.resolve(PLACES);
};



window.onload = () => {
    const scene = document.querySelector('a-scene');

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces()
            .then((places) => {
                places.forEach((place) => {
                    const latitude = place.location.lat;
                    const longitude = place.location.lng;

                    // add place name
  /*                  const text = document.createElement('a-link');
                    text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    text.setAttribute('title', place.name);
                    text.setAttribute('href', 'http://www.example.com/');
                    text.setAttribute('scale', '20 20 20');

                    text.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });*/
                    const text = document.createElement('a-text');
                    text.setAttribute('value', place.name);
                    text.setAttribute('look-at', "[gps-camera]");
                    text.setAttribute('scale', "120 120 120");
                    text.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
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
