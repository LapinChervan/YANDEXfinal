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



/*var user = new CONTROL.User('вася', '12345');
var use2 = new CONTROL.User('вася1', '32345');

user.newCategory('costs','зп');
user.newCategory('costs','аыап');


alert(use2.categories.costs);
alert(user.categories.costs);

user.removeCategory('costs','аыап');
alert(user.categories.costs);

user.renameCategory('costs', 'зп', 'ЗП!');
alert(user.categories.costs);

user.newCategory('gain', 'такой себе gain');
alert(user.categories.gain);
*/


