import datas from "./getDatas.js";

function filtrer() {
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("div")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

window.onload = () => {
    const ul = document.querySelector('#myUL');
    ul.style.position = "relative";
    ul.style.bottom = "100px";

    const myInput = document.querySelector('#myInput');
    myInput.addEventListener("keyup", filtrer);
    myInput.style.zIndex = "100";

    datas.sendXhrPromise("../datas/places.json")
        .then((places) => {
            places.forEach((place) => {
                const id = place.id;
                const image = place.image;
                const name = place.name;
                const description = place.description;
                const icon = place.icon;

                let li = document.createElement("li");
                let img = document.createElement("img");
                let p = document.createElement("p");
                let div = document.createElement("div");
                let logo = document.createElement("img");
                
                li.className = "jarallax row";
                li.setAttribute("data-speed", "1.4");

                img.className = "text-truncate jarallax-img";
                img.src = image;

                logo.className = "logo col-2";
                logo.src = icon;
                
                p.setAttribute("class", "col-20 text-truncate");
                p.innerHTML = description;
                
                div.className = "text-truncate description";
                div.innerHTML = name;

                div.appendChild(p);
                li.appendChild(img);
                li.appendChild(logo);
                li.appendChild(div);
                ul.appendChild(li);
                
                li.addEventListener("click", ()=>{
                    datas.setCookie("id", id, 1);
                    datas.setCookie("returnGeo", "false", 1);
                    window.location.href = "poiDetail.html";
                })

                jarallax(document.querySelectorAll(".jarallax"));
            });
        })
        .catch((error) => {
            console.log(error.message);
        })
};


