var	doc = document, // документ
	buttonReg = doc.getElementsByClassName('header__reg')[0], // кнопка регистрации
	buttonAuth = doc.getElementsByClassName('header__auth')[0], // кнопка авторизации
	formReg = doc.getElementById('form-reg').innerHTML, // форма регистрации
	formLogin = doc.getElementById('form-login').innerHTML; // форма авторизации

// вызов формы регистрации
buttonReg.addEventListener('click', function() {
	doc.body.innerHTML = formReg;
}, false);

// вызов формы авторизации
buttonAuth.addEventListener('click', function() {
	doc.body.innerHTML = formLogin;
}, false);
