function filtrer() {
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


function loadPlaces() {
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
}


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


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
                let logo = document.createElement("img");

                li.className = "jarallax";
                li.setAttribute("data-speed", "3.0");
                
                a.setAttribute("class", "fond text-truncate jarallax-img");
 
                a.style.backgroundImage = "url(" + image + ")";
                a.style.backgroundSize = "cover";
                
                a.addEventListener("click", ()=>{
                    setCookie("id", place.id, 1);
                    setCookie("returnGeo", "false", 1);
                    window.location.href = "poiDetail.html";
                })
                
                p.setAttribute("class", "text-truncate");
                p.style.fontSize = "13px";
                p.innerHTML = description;

                logo.className = "logo";
                logo.src = place.icon;
                
                div.style.position = "relative";
                div.style.top = "70px";
                div.style.fontWeight = "bolder";
                div.innerHTML = name;
                
                div.appendChild(p);
                a.appendChild(logo);
                a.appendChild(div);
                li.appendChild(a);
                ul.appendChild(li);

                jarallax(document.querySelectorAll(".jarallax"));
                
            });
        })
        .catch((error) => {
            console.log(error.message);
        })
};


