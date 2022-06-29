import datas from "./getDatas.js";

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

function generatePlaces(arrSort) {
    let content = document.querySelector("ul");
    while (content.hasChildNodes()) {
        content.removeChild(content.firstChild);
    }
    
    for (let i = 0; i < 5; i++){
        let nom = arrSort[i][0];
        let image = arrSort[i][1];
        let distance = arrSort[i][2];
        let icon = arrSort[i][3];
        let adresse = arrSort[i][4];
        let id = arrSort[i][6];

        const ul = document.querySelector('#listeUL');
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
            datas.setCookie("id", id, 1);
            window.location.href = "poiDetail.html";
        })
        
        p.setAttribute("class", "text-truncate");
        p.style.fontSize = "13px";
        p.innerHTML = adresse;

        logo.className = "logo";
        logo.src = icon;

        div.style.position = "relative";
        div.style.top = "70px";
        div.style.fontWeight = "bolder";
        distance < 1?div.innerHTML = nom + " (" + distance * 1000 + "m)":div.innerHTML = nom + " (" + distance + "km)"

        div.appendChild(p);
        a.appendChild(logo);
        a.appendChild(div);
        li.appendChild(a);
        ul.appendChild(li);
    }
}

function init(){
    let arr = [];
    navigator.geolocation.getCurrentPosition(function (position) {
        datas.sendXhrPromise("../datas/places.json").then((places) => {
            places.forEach((place) => {
                let distance = datas.getDistance(place.latitude, place.longitude, position.coords.latitude, position.coords.longitude);
                arr.push([place.name, place.image, parseFloat(distance.toFixed(2)), place.icon, place.adresse, place.description, place.id]);
            });
            //console.log(selectionSort(arr));
            let arrSort = selectionSort(arr);
            generatePlaces(arrSort);
            
        });
    })
}

init();
window.setInterval(init, 30000);


