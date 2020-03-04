$(document).ready(function() {
  // Sidebar Menu
  $("#side-menu .sub-menu > a").click(function(e) {
    $("#side-menu ul ul").slideUp(),
      $(this)
        .next()
        .is(":visible") ||
        $(this)
          .next()
          .slideDown(),
      e.stopPropagation();
  });

   // Metis Menu 

  $("#side-menu").metisMenu();

      $("#sidebar-menu a").each(function() {
        var t = window.location.href.split(/[?#]/)[0];
        this.href == t && ($(this).addClass("active"),
        $(this).parent().addClass("mm-active"),
        $(this).parent().parent().addClass("mm-show"),
        $(this).parent().parent().prev().addClass("mm-active"),
        $(this).parent().parent().parent().addClass("mm-active"),
        $(this).parent().parent().parent().parent().addClass("mm-show"),
        $(this).parent().parent().parent().parent().parent().addClass("mm-active"))
    });

 
});


