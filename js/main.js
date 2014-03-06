var	doc = document, // документ
    access = CONTROL.access,
    layer = CONTROL.layer;

//TODO переделать обработчики

// вызов формы регистрации
doc.getElementsByClassName('header__reg')[0].addEventListener('click', function(e) {
    var form, closeCross, log_reg;
    e.stopPropagation();
    layer.createLayer({content: doc.getElementById('form-reg').innerHTML});

    log_reg = doc.getElementsByClassName('log_reg')[0];
    form = log_reg.parentNode;
	log_reg.onclick = function() {
        layer.destroyLayer();
		access.registration(form.getElementsByClassName('input_login_reg')[0].value,
                            form.getElementsByClassName('input_login_reg')[1].value);
	};
    closeCross = form.getElementsByClassName('close')[0];
    closeCross.addEventListener('click',function(){
        layer.destroyLayer.call(layer);
    });
}, false);

// вызов формы авторизации
doc.getElementsByClassName('header__auth')[0].addEventListener('click', function(e) {
    var log_in,
        userData;
    e.stopPropagation();
    layer.createLayer({content: doc.getElementById('form-login').innerHTML});

    log_in = doc.getElementsByClassName('log_in')[0];
    form = log_in.parentNode;
	log_in.onclick = function() {
        layer.destroyLayer();
		access.authorization(form.getElementsByClassName('input_login_reg')[0].value,
                             form.getElementsByClassName('input_login_reg')[1].value);
        console.log(CONTROL.userData);
        //TODO поправить дейтпикеры
       // $('.dateFrom').datepicker();
      //  $('.dateTo').datepicker();
	};
    closeCross = form.getElementsByClassName('close')[0];
    closeCross.addEventListener('click',function(){
        layer.destroyLayer.call(layer);
    });
}, false);



