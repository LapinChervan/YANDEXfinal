var	doc = document,
    access = CONTROL.access,
    layer = CONTROL.layer;

doc.querySelector('.allbutton').addEventListener('click', function(e) {
    var event = e || window.event,
        target = event.target || event.srcElement;

    if (target.classList.contains('header__auth__button')) {
        event.stopPropagation();
        layer.createLayer({content: doc.getElementById('form-login').innerHTML});

        doc.querySelector('.log_in').addEventListener('click', function(e) {
            var event = e || window.event;
            event.preventDefault();

            access.authorization(doc.querySelectorAll('.input_login_reg')[0].value,
                                doc.querySelectorAll('.input_login_reg')[1].value);
            CONTROL.layer.destroyLayer();
        }, false);
    }

    if (target.classList.contains('header__reg__button')) {
        event.stopPropagation();
        layer.createLayer({content: doc.getElementById('form-reg').innerHTML});

        doc.querySelector('.log_reg').addEventListener('click', function(e) {
            var event = e || window.event;
            event.preventDefault();

            access.registration(doc.querySelectorAll('.input_login_reg')[0].value,
                doc.querySelectorAll('.input_login_reg')[1].value);
            CONTROL.layer.destroyLayer();
        }, false);
    }
}, false);