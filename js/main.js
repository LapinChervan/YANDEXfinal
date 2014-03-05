var	doc = document, // документ
	buttonReg = doc.getElementsByClassName('header__reg')[0], // кнопка регистрации
	buttonAuth = doc.getElementsByClassName('header__auth')[0], // кнопка авторизации
	formReg = doc.getElementById('form-reg').innerHTML, // форма регистрации
	formLogin = doc.getElementById('form-login').innerHTML, // форма авторизации
    access = CONTROL.access,
    layer = CONTROL.layer,
	log_in, log_reg;

//TODO переделать обработчики

// вызов формы регистрации
buttonReg.addEventListener('click', function(e) {
    var form, closeCross;
    e.stopPropagation();
    layer.createLayer({content:formReg});

    log_reg = doc.getElementsByClassName('log_reg')[0];
    form = log_reg.parentNode;
	log_reg.onclick = function() {
        var value = form.getElementsByClassName('input_login_auth')[0].value
        layer.destroyLayer();
		access.registration(value, 'qwerty');
	};
    closeCross = form.getElementsByClassName('close')[0];
    closeCross.addEventListener('click',function(){
        layer.destroyLayer.call(layer);
    });
}, false);

// вызов формы авторизации
buttonAuth.addEventListener('click', function(e) {
    e.stopPropagation();
    layer.createLayer({content:formLogin});

    log_in = doc.getElementsByClassName('log_in')[0];
    form = log_in.parentNode;
	log_in.onclick = function() {
        var value = form.getElementsByClassName('input_login_auth')[0].value
        layer.destroyLayer();
		//access.auth(value);

        $('.dateFrom').datepicker();
        $('.dateTo').datepicker();
	};
    closeCross = form.getElementsByClassName('close')[0];
    closeCross.addEventListener('click',function(){
        layer.destroyLayer.call(layer);
    });
}, false);



