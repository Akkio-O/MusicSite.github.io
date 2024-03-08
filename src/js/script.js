// Hamburger_animation
function responsive() {
    const x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
    const hamburger = document.querySelector('.hamburger')
    hamburger.classList.toggle('hamburger_active');
}

// Carousel
const slider = tns({
    container: '.carousel_inner',
    speed: 1000,
    items: 1,
    slideBy: 'page',
    autoplay: true,
    center: true,
    controls: false,
    autoWHeight: true,
    autoplayButtonOutput: false,
    responsive: {
        640: {
            edgePadding: 20,
            gutter: 20,
            items: 1
        },
        700: {
            gutter: 30
        },
        900: {
            items: 1,
        }
    },
    navPosition: "bottom",
});

document.querySelector('.prev').addEventListener('click', () => {
    slider.goTo('prev')
})
document.querySelector('.next').addEventListener('click', () => {
    slider.goTo('next')
});

// @media screen
function mediaLg(l) {
    const promo = document.querySelector('.promo')
    const navMain = document.querySelector('.navMain')
    const promoSeatchImg = document.querySelector('.promo_search_img')
    if (l.matches) {
        navMain.classList.remove('container')
        promo.classList.remove('container')
        promoSeatchImg.classList.remove('col-lg-8')
    }
    else {
        promo.classList.add('container')
        navMain.classList.remove('container')
        promoSeatchImg.classList.add('col-lg-8')
    }
}

const l = window.matchMedia("(max-width: 994px)")
mediaLg(l)
l.addListener(mediaLg)

function mediaXl(x) {
    const footerContainer = document.querySelector('.footer_content__container')
    const footerRow = document.querySelector('.footer_content__row')
    if (x.matches) {
        footerContainer.classList.remove('container')
        footerRow.classList.add('row')
    }
    else {
        footerContainer.classList.add('container')
        footerRow.classList.remove('row')
    }
}

const x = window.matchMedia("(max-width: 1200px)")
mediaXl(x)
x.addListener(mediaXl)

// Menu Block
const menus = [];
for (let i = 1; i <= 7; i++) {
    const menu = document.getElementById(`menu${i}`);
    function toggleMenu(menu) {
        menu.classList.toggle('active');
    }
    function removeMenu(menu) {
        menu.classList.remove('active');
    }
    menu.addEventListener('mouseenter', function () { toggleMenu(menu) });
    menu.addEventListener('mouseleave', function () { removeMenu(menu) });
    menus.push(menu);
}

// Section_items
let coll = document.getElementsByClassName("collapsible");
let i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

// Filter list
filterSelection("all")
function filterSelection(c) {
    console.log("Функция filterSelection вызвана с аргументом: " + c);

    let x, i;
    x = document.getElementsByClassName("filterDiv");
    if (c == "all") c = "";
    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");
        if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
    }
}

function w3AddClass(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) { element.className += " " + arr2[i]; }
    }
}

function w3RemoveClass(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
}

let btnContainer = document.getElementById("myBtnContainer");
let btns = btnContainer.getElementsByClassName("btn_filter");

for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        if (!this.classList.contains("active")) { 
            let current = document.querySelector(".btn_filter.active");
            if (current) {
                current.classList.remove("active");
            }
            this.classList.add("active");
        }
    });
}

//

