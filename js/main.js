CONTROL.slider.start();
CONTROL.ajax.toServer(
    'http://localhost:1111/cookie?start=' +
    CONTROL.tools.getDateMs(CONTROL.tools.getDateN('01')) + '&end=' +
    CONTROL.tools.getDateMs(CONTROL.tools.getDateN('30')),
    CONTROL.access.showContent
);

document.querySelector('.allbutton').addEventListener('click', function(e) {
    var target = e.target,
        formType = {
            'auth': CONTROL.access.authorization,
            'reg': CONTROL.access.registration
        },
        key;

        for (key in formType) {
            if (target.classList.contains('header__' + key + '__button')) {
                e.stopPropagation();
                CONTROL.layer.createLayer({
                    content: document.querySelector('.form-' + key).innerHTML
                });

                document.querySelector('.log_' + key).addEventListener('click', function() {
                    var inputs = document.querySelectorAll('.input_login_reg');

                    if (CONTROL.tools.isEmptyOne(inputs[0]) && CONTROL.tools.isEmptyOne(inputs[1])) {
                        formType[key](inputs[0].value, inputs[1].value);
                    }
                });
                break;
            }
        }
});

