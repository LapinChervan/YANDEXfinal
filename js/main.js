var doc = document,
    CONTR = CONTROL,
    tools = CONTR.tools,
    access = CONTR.access,
    layer = CONTR.layer;

CONTR.slider.start();
CONTR.ajax.toServer('http://localhost:1111/cookie?start=' + tools.getDateMs(tools.getDateN('01')) +
                                                  '&end=' + tools.getDateMs(tools.getDateN('30')), access.showContent);

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
                layer.createLayer({
                    content: doc.querySelector('.form-' + key).innerHTML
                });

                doc.querySelector('.log_' + key).addEventListener('click', function() {
                    var inputs = doc.querySelectorAll('.input_login_reg');

                    formType[key](inputs[0].value, inputs[1].value);
                    layer.destroyLayer();
                });
                break;
            }
        }
});

