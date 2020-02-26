// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//
// A11Y Config
//
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

// includes polyfill for IE
// see https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/includes
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

        if (this == null) {
        throw new TypeError('"this" est nul ou non défini');
        }

        // 1. Soit o égal à ? Object(cette valeur).
        var o = Object(this);

        // 2. Soit len égal à ? Length(? Get(o, "length")).
        var len = o.length >>> 0;

        // 3. Si len = 0, renvoyer "false".
        if (len === 0) {
        return false;
        }

        // 4. Soit n = ? ToInteger(fromIndex).
        // Pour la cohérence du code, on gardera le nom anglais "fromIndex" pour la variable auparavant appelée "indiceDépart"
        //    (Si fromIndex n'est pas défini, cette étape produit la valeur 0.)
        var n = fromIndex | 0;

        // 5. Si n ≥ 0,
        //  a. Alors k = n.
        // 6. Sinon, si n < 0,
        //  a. Alors k = len + n.
        //  b. Si k < 0, alors k = 0.
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }

        // 7. Répéter tant que k < len
        while (k < len) {
        // a. Soit elementK le résultat de ? Get(O, ! ToString(k)).
        // b. Si SameValueZero(searchElement, elementK) est vrai, renvoyer "true".
        if (sameValueZero(o[k], searchElement)) {
            return true;
        }
        // c. Augmenter la valeur de k de 1.
        k++;
        }

        // 8. Renvoyer "false"
        return false;
    }
    });
}

var a11y_config = function () {

    //
    // Source
    // https://github.com/edenspiekermann/a11y-dialog
    //
    var listModalDialogs = function () {

        var i = 0;
        var dialogList =[];

        $("button[data-a11y-dialog-show]").each(function () {
            i++;
            var dialogId = $(this).attr("data-a11y-dialog-show");
            var dialogElement = $("#" + dialogId.toString());

            if(!dialogList.includes(dialogId)){
                dialogList.push(dialogId);
            }
        });
        return dialogList;
    }

    var body = $('body');
    var mainElement = $('main');

    var dialogList = listModalDialogs();

    dialogList.forEach(function(element) {
        var dialogAccessConfig = document.getElementById(element);
        var dialog = new window.A11yDialog(dialogAccessConfig, mainElement);

        dialog.on('show', function (dialogAccessConfig, triggerEl) {
            body.addClass('no-scroll');
        });

        dialog.on('hide', function (dialogAccessConfig) {
            body.removeClass('no-scroll');
        });
    });

    // On récupère la valeur du name
    // On crée un data- avec la valeur du name (ex : name="constrat" = data-contrast)
    // On ajoute la value de l'input sélectionné dans la valeur du data- (ex : data-contrast="default-c")

    $("#a11yModal [name]").change(function () {
        var name = $(this).attr("name");
        var val = $(this).val();

        body.attr( "data-"+name, val);
        createCookie(name, val,'180'); // 180 = durée de vie du cookie
    });

    var cookies = document.cookie;

    if(cookies && cookies !== ''){
        var properties = cookies.split('; ');
        var configAccess = {};

        properties.forEach(function(property) {
            var tup = property.split('=');
            var name = tup[0];
            var val = tup[1];

            if(['font','contrast','line-space'].includes(name)) {
                configAccess[name] = val;
            }
        });

        Object.keys(configAccess).forEach(function(key) {
            var val = configAccess[key];

            body.attr( "data-"+key, val);
            $('[name='+key+'][value='+val+']').attr('checked','true');
        });
    }

    /* Cookies */
    function createCookie( name, value, days ) {
        if ( days ) {
            var datetime = new Date();
            datetime.setTime( datetime.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
            var expires = "; expires=" + datetime.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    $('[role="dialog"]').on('shown.bs.modal', function () {
        $(this).attr('aria-hidden', 'false');
    }).on('hidden.bs.modal', function (e) {
        $(this).attr('aria-hidden', 'true');
    });
}