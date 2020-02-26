// + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
//
// FLOAT LABEL
// src : http://jsfiddle.net/RyanWalters/z9ymd852/
//
// + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
var fn_float_label = function () {

    // $('.float-target').on('focus blur', function (e) {
    //     $(this).parents('.float-target-parent').toggleClass('focused', (e.type === 'focus' || this.value != ''));
    // });

    // $('.float-target').each(function () {
    //     if($(this).val() != "") {
    //         $(this).parents('.float-target-parent').addClass('focused');
    //     }
    // });
    
    $('.float-target, .float-target-parent input, .float-target-parent select').on('focus blur', function (e) {
        $(this).parents('.float-target-parent').removeClass('has-value');
        $(this).parents('.float-target-parent').toggleClass('focused', (e.type === 'focus' || this.value != ''));
    });

    $('.float-target-parent:not(.float-target-parent--search) input, .float-target-parent select').each(function () {
        if ($(this).val() != "") {
            $(this).parents('.float-target-parent').addClass('focused');

        }
    });
}