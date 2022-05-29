function selectionSort(arr) {
    let len = arr.length;
    let minIndex, temp;
    for (let i = 0; i < len - 1; i++) {
        minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
}

function selectionSort2(arr) {
    let len = arr.length;
    let minIndex, temp;
    for (let i = 0; i < len - 1; i++) {
        minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j][2] < arr[minIndex][2]) {
                minIndex = j;
            }
        }
        temp = arr[i][2];
        arr[i][2] = arr[minIndex][2];
        arr[minIndex][2] = temp;
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
};

window.onload = () => {
    let arr = [];
    return navigator.geolocation.getCurrentPosition(function (position) {
        loadPlaces().then((places) => {
            places.forEach((place) => {
                let distance = clacDistance(place.latitude, place.longitude, position.coords.latitude, position.coords.longitude);
                arr.push([place.name, place.image, distance]);
            });
            //console.log(arr[0][2]);
            console.log(selectionSort2(arr));
        });
    })
}

