var fn_header_sticky = function () {

    var header = $('.header');

    $(window).scroll(function () {
        scrollPos = $(window).scrollTop();
        
        if( scrollPos > 20) {
            header.addClass('header-sticky');
        } 
        else {
            header.removeClass('header-sticky');
        }
    });
}