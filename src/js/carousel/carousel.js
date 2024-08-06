console.log('Carousel working');

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