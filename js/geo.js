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
                let content = document.querySelector(".panel");
                while (content.hasChildNodes()) {
                    content.removeChild(content.firstChild);
                }
                
                //const title = link.getAttribute("title");

                <!--<img class="fit-picture"
                     src="/media/cc0-images/grapefruit-slice-332-332.jpg"
                     alt="">-->
                document.querySelector(".panel").style.display = "block";
                let p = document.createElement("p");
                let p2 = document.createElement("p");
                let button = document.createElement("button");
                let img = document.createElement("img");
                
                img.className = "fit-picture";
                img.src = link.dataset.image;
                img.alt = link.dataset.image;
                button.className = "mdl-button mdl-button--raised mdl-button--accent";
                button.innerHTML = "Afficher plus";
                p.style.fontSize = "2em";
                p.innerHTML = link.dataset.titre;
                p2.innerHTML = link.dataset.description;
                
                document.querySelector(".panel").appendChild(p);
                document.querySelector(".panel").appendChild(p2);
                document.querySelector(".panel").appendChild(button);
                document.querySelector(".panel").appendChild(img);
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
                        text.setAttribute('data-titre', place.name);
                        text.setAttribute('data-description', place.description);
                        text.setAttribute('data-image', place.image);
                        //text.setAttribute('href', place.image);
                        text.setAttribute('href', "javascript:void(0)");
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
