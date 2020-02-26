var fn_overflow = function () {

    var elem_active_overflow = $('.header-megamenu-nav, .header-megamenu-search-wrapper, .full-modal-wrapper');

    var elem_active_overflow_menu = $('.header-megamenu-nav, .header-megamenu-search-wrapper');

    elem_active_overflow.on('show.bs.collapse', function () {
        $('body').addClass('overflow'); 
    });
    elem_active_overflow_menu.on('show.bs.collapse', function () {
        $('.header-sticky').addClass('header-sticky-menu-open');  
    });

    elem_active_overflow.on('hide.bs.collapse', function () {
        $('body').removeClass('overflow');
    });
    elem_active_overflow_menu.on('hide.bs.collapse', function () {
        $('.header-sticky').removeClass('header-sticky-menu-open');
    });
}