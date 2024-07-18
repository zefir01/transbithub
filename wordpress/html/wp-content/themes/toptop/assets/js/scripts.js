$(document).ready(function (){
    $('a[href^="#"]').click(function (e) {
        e.preventDefault();
        if ($(window).outerWidth() > 992) {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top - $('.header').outerHeight() - 30
            }, 500);
        } else {
            $('html, body').animate({
                scrollTop: $($(this).attr('href')).offset().top - 30
            }, 500);
        }
        
    });
});