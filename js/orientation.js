document.body.addEventListener('orientationchange', (event)=>{
    changeOrientation(event);
})

function changeOrientation(event){
    alert("Rotate");
    event.preventDefault();
}