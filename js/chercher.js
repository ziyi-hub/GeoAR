function myFunction() {
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}


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


window.onload = () => {
    const ul = document.querySelector('#myUL');
    ul.style.position = "relative";
    ul.style.bottom = "100px";
    
    const myInput = document.querySelector('#myInput');
    myInput.style.zIndex = "100";

     loadPlaces()
        .then((places) => {
            places.forEach((place) => {

                const image = place.image;
                const name = place.name;
                const description = place.description;
                
                let li = document.createElement("li");
                let a = document.createElement("a");
                let p = document.createElement("p");
                let div = document.createElement("div");
                
                a.setAttribute("class", "fond");
                a.setAttribute("class", "text-truncate");
                a.style.backgroundImage = "url(" + image + ")";
                a.style.backgroundSize = "cover";
                
                p.setAttribute("class", "text-truncate");
                p.style.fontSize = "13px";
                p.innerHTML = description;
                
                div.style.position = "relative";
                div.style.top = "70px";
                div.innerHTML = name;
                
                div.appendChild(p);
                a.appendChild(div);
                li.appendChild(a);
                ul.appendChild(li);
                
            });
        })
        .catch((error) => {
            console.log(error.message);
        })
};


