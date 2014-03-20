var	doc = document, // документ
    access = CONTROL.access,
    layer = CONTROL.layer;

//TODO переделать обработчики

// вызов формы регистрации
doc.querySelector('.header__reg').addEventListener('click', function(e) {
    var form, log_reg, btn;
    e.stopPropagation();
    layer.createLayer({content: doc.getElementById('form-reg').innerHTML});

    log_reg = doc.getElementsByClassName('log_reg')[0];
    form = log_reg.parentNode;
    btn = form.querySelectorAll('.input_login_reg');
	log_reg.onclick = function() {
        layer.destroyLayer();
		access.registration(form.btn[0].value,
                            form.btn[1].value);
        CONTROL.layer.destroyLayer();
	};
}, false);

// вызов формы авторизации
doc.querySelector('.header__auth').addEventListener('click', function(e) {
    var log_in, form, btn;
    e.stopPropagation();
    layer.createLayer({content: doc.getElementById('form-login').innerHTML});

    log_in = doc.getElementsByClassName('log_in')[0];
    form = log_in.parentNode;
    btn = form.querySelectorAll('.input_login_reg');
	log_in.onclick = function() {
        layer.destroyLayer();
		access.authorization(form.btn[0].value,
                             form.btn[1].value);

        //TODO поправить дейтпикеры
       // $('.dateFrom').datepicker();
      //  $('.dateTo').datepicker();
        CONTROL.layer.destroyLayer();
	};
}, false);



/*
doc.getElementsByClassName('inlineBlock').onclick = function(e) {
    var event = e || window.event;
    var target = event.target || event.srcElement;


    if (target.nodeName != 'A') return;


    alert(target.getAttribute('href'));
    return false;
}*/

/*document.querySelector('.floatRight.marginR0').addEventListener('change', function() {
    var target = event.target || event.srcElement; //проверить ие8 на евент таргет а то забыл))

});*/


