function selectionSort(arr) {
    let len = arr.length;
    let minIndex, temp;
    for (let i = 0; i < len - 1; i++) {
        minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j][2] < arr[minIndex][2]) {
                minIndex = j;
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
}

function clacDistance(lat1, lng1, lat2, lng2){
    let radLat1 = lat1 * Math.PI/ 180.0 ;
    let radLat2 = lat2 * Math.PI/ 180.0 ;
    let a = radLat1 - radLat2;
    let b = lng1 * Math.PI/ 180.0 - lng2 * Math.PI/ 180.0 ;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137; //Earth radius
    s = Math.round(s * 10000) / 10000;
    return s.toFixed(2);
}

function loadPlaces() {
    let PLACES;
    let request = new XMLHttpRequest();

    request.open('GET','https://ziyi-hub.github.io/GeoAR/datas/places.json', false);
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            PLACES = JSON.parse(this.responseText);
        }
    };
    request.send();
    return Promise.resolve(PLACES);
}


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function generatePlaces(arrSort) {
    for (let i = 0; i < 5; i++){
        let nom = arrSort[i][0];
        let image = arrSort[i][1];
        let distance = arrSort[i][2];
        let icon = arrSort[i][3];
        let adresse = arrSort[i][4];
        let id = arrSort[i][6];

        const ul = document.querySelector('#myUL');
        ul.style.position = "relative";
        ul.style.bottom = "100px";

        let li = document.createElement("li");
        let a = document.createElement("a");
        let p = document.createElement("p");
        let div = document.createElement("div");
        let logo = document.createElement("img");

        a.setAttribute("class", "fond");
        a.setAttribute("class", "text-truncate");
        a.style.backgroundImage = "url(" + image + ")";
        a.style.backgroundSize = "cover";
        
        a.addEventListener("click", ()=>{
            setCookie("id", id, 1);
            console.log("ok");
            window.location.href = "poiDetail.html";
        })
        
        p.setAttribute("class", "text-truncate");
        p.style.fontSize = "13px";
        p.innerHTML = adresse;

        logo.className = "logo";
        logo.src = icon;

        div.style.position = "relative";
        div.style.top = "40px";
        div.style.fontWeight = "bolder";
        distance < 1?div.innerHTML = nom + " (" + distance * 1000 + "m)":div.innerHTML = nom + " (" + distance + "km)"
        //div.innerHTML = nom + "(" + distance + ")";

        div.appendChild(p);
        a.appendChild(logo);
        a.appendChild(div);
        li.appendChild(a);
        ul.appendChild(li);
    }
}


window.onload = () => {
    let arr = [];
    return navigator.geolocation.getCurrentPosition(function (position) {
        loadPlaces().then((places) => {
            places.forEach((place) => {
                let distance = clacDistance(place.latitude, place.longitude, position.coords.latitude, position.coords.longitude);
                arr.push([place.name, place.image, parseFloat(distance), place.icon, place.adresse, place.description, place.id]);
            });
            console.log(selectionSort(arr));
            let arrSort = selectionSort(arr);
            generatePlaces(arrSort);
            
        });
    })
}

