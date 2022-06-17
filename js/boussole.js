let oScaleLiArr = document.getElementsByClassName('scale')[0].getElementsByTagName('li');
let oDirectionLiArr = document.getElementsByClassName('direction');
let oDial = document.getElementsByClassName('dial')[0];
let oPoint = document.getElementsByClassName('point')[0];

// faire des éléments en cercle
function rotateDom(domArr, deg) {
    Array.prototype.slice.call(domArr, 0).forEach(function (ele, index) {
        ele.style.transform = 'translatez(0px) rotate(' + deg * index + 'deg)';
    })
}

let oUl = document.getElementById('ul');
// Puisqu'il s'agit de 180 échelle, nous allons créer 60 li et définir leur angle de rotation
for (let i=0; i<180; i++){
    let oLi = document.createElement('li');
    // En tant que i est compris entre 0 et 180, et que l'angle de rotation de chaque échelle est de 360°÷180=2°, l'angle de rotation de chaque échelle est i*2°
    oLi.style.webkitTransform = 'rotate('+ i*2 +'deg)';
    oUl.appendChild(oLi);
}

// Obtenir informations sur orientation de l'appareil
window.addEventListener("deviceorientation", function (e) {
    if (e.alpha) {

        // Initialiser le cadran de la boussole
        rotateDom(oScaleLiArr, 2)
        rotateDom(oDirectionLiArr, 90)

        // aiguille d'orientation nord
        oDial.style.transform = "translatez(0px) rotate(" + Math.round(e.alpha) + "deg)";

        // Lorsque le pointeur aiguille vers Nord, le pointeur devient rouge
        if ((e.alpha) % 360 < 1 || (e.alpha) % 360 > 359) {
            oPoint.style.backgroundColor = "#f00";
        } else {
            oPoint.style.backgroundColor = "#000"
        }
    }
}, false)