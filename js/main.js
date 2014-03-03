var	doc = document, // документ
	buttonReg = doc.getElementsByClassName('header__reg')[0], // кнопка регистрации
	buttonAuth = doc.getElementsByClassName('header__auth')[0], // кнопка авторизации
	formReg = doc.getElementById('form-reg').innerHTML, // форма регистрации
	formLogin = doc.getElementById('form-login').innerHTML, // форма авторизации
	access = CONTROL.access,
	log_in, log_reg;



// вызов формы регистрации
buttonReg.addEventListener('click', function() {
    event.stopPropagation();
    new CONTROL.Layer({content:formReg});

    log_reg = doc.getElementsByClassName('log_reg')[0];
	log_reg.onclick = function() {	
		access.registration(doc.getElementsByClassName('input_login_reg')[0].value, 'qwerty');
	};

}, false);

// вызов формы авторизации
buttonAuth.addEventListener('click', function() {
    event.stopPropagation();
    new CONTROL.Layer({content:formLogin});

    log_in = doc.getElementsByClassName('log_in')[0];
	log_in.onclick = function() {	
		access.auth(doc.getElementsByClassName('input_login_auth')[0].value);
	};
}, false);



