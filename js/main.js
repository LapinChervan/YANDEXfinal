var	doc = document, // документ
    access = CONTROL.access,
    layer = CONTROL.layer;

//TODO переделать обработчики

// вызов формы регистрации
doc.getElementsByClassName('header__reg')[0].addEventListener('click', function(e) {
    var form, log_reg;
    e.stopPropagation();
    layer.createLayer({content: doc.getElementById('form-reg').innerHTML});

    log_reg = doc.getElementsByClassName('log_reg')[0];
    form = log_reg.parentNode;
	log_reg.onclick = function() {
        layer.destroyLayer();
		access.registration(form.getElementsByClassName('input_login_reg')[0].value,
                            form.getElementsByClassName('input_login_reg')[1].value);
        CONTROL.layer.destroyLayer();
	};
}, false);

// вызов формы авторизации
doc.getElementsByClassName('header__auth')[0].addEventListener('click', function(e) {
    var log_in;
    e.stopPropagation();
    layer.createLayer({content: doc.getElementById('form-login').innerHTML});

    log_in = doc.getElementsByClassName('log_in')[0];
    form = log_in.parentNode;
	log_in.onclick = function() {
        layer.destroyLayer();
		access.authorization(form.getElementsByClassName('input_login_reg')[0].value,
                             form.getElementsByClassName('input_login_reg')[1].value);

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


