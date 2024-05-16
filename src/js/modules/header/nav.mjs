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
export { myTopnav };
