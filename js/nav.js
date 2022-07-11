const list = document.querySelectorAll(".list");
list.forEach((item) => item.addEventListener('click', activeLink));

/**
 * Il permet au pilote de naviguer à travers les pages
 */
function activeLink(){
    list.forEach((item)=>
        item.classList.remove("active"));
    this.classList.add("active");
}
