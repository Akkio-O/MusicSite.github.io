const myTopnav = document.getElementById("myTopnav");

function navHamburger() {
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        if (myTopnav.className === "topnav") {
            myTopnav.className += " responsive";
        } else {
            myTopnav.className = "topnav";
        }
        hamburger.classList.toggle('hamburger_active');
    } else {
        console.error('Ошибка: элемент .hamburger не найден.');
    }
};
export { navHamburger };
