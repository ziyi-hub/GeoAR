let oScaleLiArr = document.getElementsByClassName('scale')[0].getElementsByTagName('li');
let oDirectionLiArr = document.getElementsByClassName('direction');
let oDial = document.getElementsByClassName('dial')[0];
let oPoint = document.getElementsByClassName('point')[0];

// 让元素围成一圈
function rotateDom(domArr, deg) {
    Array.prototype.slice.call(domArr, 0).forEach(function (ele, index) {
        ele.style.transform = 'translatez(0px) rotate(' + deg * index + 'deg)';
    })

}

let oUl = document.getElementById('ul');
/* 因为是60个刻度嘛，我们就创建60个li，并设置它们的旋转角度 */
for (let i=0; i<180; i++){
    let oLi = document.createElement('li');
    /* 因为i是从0~60，而每个刻度的旋转角度360°÷60=6°，所以每个刻度的旋转角度就是i*6°  */
    oLi.style.webkitTransform = 'rotate('+ i*2 +'deg)';
    oUl.appendChild(oLi);
}

// 绑定获取设备方位信息事件
window.addEventListener("deviceorientation", function (e) {
    if (e.alpha) {

        // 初始化表盘
        rotateDom(oScaleLiArr, 2)
        rotateDom(oDirectionLiArr, 90)

        // 指北针
        oDial.style.transform = "translatez(0px) rotate(" + Math.round(e.alpha) + "deg)";

        // 指针指到正北时,指针变红；
        if ((e.alpha) % 360 < 1 || (e.alpha) % 360 > 359) {
            oPoint.style.backgroundColor = "#f00";
        } else {
            oPoint.style.backgroundColor = "#000"
        }

    } /*else {
            alert("您的设备不支持Deviceorientation功能，请用Android设备打开！")
        }*/

}, false)