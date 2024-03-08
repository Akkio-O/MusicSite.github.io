$(document).ready(function(){
//modal
$('.modal-trigger').on('click', function() {
    let modalId = $(this).data('modal');
    $('.overlay, #' + modalId).fadeIn('slow');
});

// close modal
$('.btn_back').on('click', function() {
    $(this).closest('.modal').fadeOut('slow');
    $('.overlay').fadeOut('slow');
});

// Close x modal
$('.modal_close').on('click', function() {
    $(this).closest('.modal').fadeOut('slow');
    $('.overlay').fadeOut('slow');
});

// close win modal
$('.overlay').on('click', function(event) {
    if ($(event.target).hasClass('overlay')) {
        $(this).find('.modal').fadeOut('slow');
        $(this).fadeOut('slow');
    }
});

$('.btn_buy__decoration').on('click', function() {
    $(this).closest('.modal').fadeOut('slow');
    let modalId = $(this).data('modal');
    $('.overlay, #' + modalId).fadeIn('slow');
});

//
// Функция для инициализации навигации профиля
function initializeProfileOverlay() {
    const $overlayProfile = $("#overlay_profile");
    const $triggerProfile = $("#trigger_profile");
    const $closeButton = $('.closebtn'); 

    $triggerProfile.on('click', function(e) {
        e.stopPropagation();
        openNav();
    });

    $closeButton.on('click', function() {
        closeNav();
    });

    $(document).on('click', function(e) {
        if (!$overlayProfile.is(e.target) && $overlayProfile.has(e.target).length === 0) {
            closeNav();
        }
    });

    $overlayProfile.on('click', function(e) {
        e.stopPropagation();
    });
}

// Функция для открытия навигации
function openNav() {
    const $overlayProfile = $("#overlay_profile");
    const $triggerProfile = $("#trigger_profile");
    $overlayProfile.css("width", "250px");
    $triggerProfile.css("margin-left", "250px");
    $("body").css("background-color", "rgba(0,0,0,0.4)");
}

// Функция для закрытия навигации
function closeNav() {
    const $overlayProfile = $("#overlay_profile");
    const $triggerProfile = $("#trigger_profile");
    $overlayProfile.css("width", "0");
    $triggerProfile.css("margin-left", "0");
    $("body").css("background-color", "white");
}

function validateForms(form){
    $(form).validate({
    rules: {
        firstName: "required",
        LastName: "required",
        phone: "required",
        password: "required",
        confirm_password: "required",
        email: {
        required: true,
        email: true
        }
    },
    messages: {
        name: "Пожалуйста, заполните свое имя",
        surname: "Пожалуйста, заполните свою фамилию",
        password: "Пожалуйста, заполните пароль",
        phone: "Пожалуйста, заполните свой номер телефона",
        confirm_password: "Пожалуйста, заполните пароль повторно",
        email: {
        required: "Пажлуйста, заполните свою почту",
        email: "Неправильно введен адрес почты"
        }
    }
    });
}
// validateForms('.feed_form')
validateForms('#reg form')
validateForms('#log form')

//form submit reg
$('form').submit(function(e){
    e.preventDefault();
    $.ajax({
    type: "POST",
    url: "http://localhost:8080/reg",
    data: $(this).serialize()
    }).done(function(){
    $(this).find("input").val("");
    $('#reg, #log').fadeOut();
    // $('.overlay, #thanks').fadeIn('slow');
    $('form').trigger('reset');
    });
    return false
});

//form submit login
$('form').submit(function(e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/login",
        data: $(this).serialize()
    }).done(function(response) {
        $(this).find("input").val("");
        $('.overlay, #reg, #log').fadeOut('slow');
        // $('.overlay, #thanks').fadeIn('slow');
        $('form').trigger('reset');
        const firstName = response.firstName; // Сохраняем значение firstName из ответа сервера
        $('.profile_block').html(`
            <div class="profile__wrapper">
                <div class="profile__img_wrapper" id="trigger_profile">
                    <img src="img/carousel/Promo_2.jpg" onclick="openNav()" alt="" class="profile__img">
                    <span>${firstName}</span>
                </div>
            </div>
            <div id="overlay_profile" class="overlay_profile">
                <a href="javascript:void(0)" class="closebtn">×</a>
                <div class="main_profile__img_wrapper">
                    <img src="img/carousel/Promo_2.jpg" alt="" class="main_profile__img">
                    <span>${firstName}</span>
                </div><br>
                <a href="#">Профиль</a>
            </div>
        `);
        initializeProfileOverlay();
    });
    return false;
});


// btn submit finally buy product
$('.finally_buy__btn').click(function(e){
    e.preventDefault();
    
    // Создаем объект с данными для отправки
    var data = {
        userName: "testUserName",
        password: "testPassword",
        orderNumber: "e2574f1785324f1592d9029cb05adbbd",
        amount: 19900,
        returnUrl: "https://testmerchant.ru/return",
        features: "FORCE_SSL"
    };
    console.log(data);

    // Отправляем данные на ваш прокси-сервер
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/register_order", // Обновленный URL на ваш прокси-сервер
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(response){
            console.log(response);
            // Добавьте здесь обработку ответа от сервера
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
});

//Smooth scrool and pageup
$(window).scroll(function(){
    if ($(this).scrollTop() >  1600) {
    $('.pageup').fadeIn();
    } else {
    $('.pageup').fadeOut();
    }
});

$("a[href^='#']").click(function(){
    const _href = $(this).attr("href");
    $("htnl, body").animate({scrollTop: $(_href).offset().top+"px"});
    return false;
});
new WOW().init();
});

// form submit e-mail
// $('form').submit(function(e){
//     e.preventDefault();
//     $.ajax({
//     type: "POST",
//     url: "http://localhost:8080/send-email",
//     data: $(this).serialize()
//     }).done(function(){
//     $(this).find("input").val("");
//     $('#reg, #log').fadeOut();
//     $('.overlay, #thanks').fadeIn('slow');
//     $('form').trigger('reset');
//     });
//     return false
// });