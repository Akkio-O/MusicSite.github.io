//client script
import counter from './js/base/counter';
import carousel from './js/carousel/carousel';
import script from './js/script';

    //img
    import promo1 from "./assets/Promo_1.jpg"
    import promo2 from "./assets/Promo_2.jpg"
    import promo3 from "./assets/Promo_3.jpg"
    //sass
    import "./sass/styles.sass";
    import "./sass/category.sass";
    //css
    import "./css/bootstrap-grid.min.css"
    import "./css/bootstrap-reboot.min.css";
    import "./css/fonts.css";

const promo = [promo1, promo2, promo3];

const Promo = document.querySelectorAll('.carousel_inner img')
Array.from(Promo).map((element, i) => {
    element.src = promo[i % promo.length];
});

const myTopnav = document.getElementById("myTopnav");
myTopnav.addEventListener('click', async () => {
    const hamburger = document.querySelector('.hamburger');
    try {
        if (myTopnav.className === "topnav") {
            myTopnav.className += " responsive";
        } else {
            myTopnav.className = "topnav";
        }
        hamburger.classList.toggle('hamburger_active');
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
});