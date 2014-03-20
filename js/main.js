var	doc = document,
    access = CONTROL.access,
    layer = CONTROL.layer;

doc.querySelector('.allbutton').addEventListener('click', function(e) {
    var event = e || window.event,
        target = event.target || event.srcElement,
        formType = {
            'auth': access.authorization,
            'reg': access.registration
        },
        key;

    for (key in formType) {
        if (target.classList.contains('header__' + key + '__button')) {
            event.stopPropagation();
            layer.createLayer({content: doc.querySelector('.form-' + key).innerHTML});

            doc.querySelector('.log_' + key).addEventListener('click', function() {
                formType[key](doc.querySelectorAll('.input_login_reg')[0].value,
                              doc.querySelectorAll('.input_login_reg')[1].value);
                layer.destroyLayer();
            }, false);
            break;
        }
    }
}, false);
