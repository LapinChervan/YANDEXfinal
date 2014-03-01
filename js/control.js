var CONTROL = {};

CONTROL.initialize = (function() {

	var events = {};

	if (typeof window.addEventListener === 'function') {
		events.addListener = function(elem, type, handler) {
			elem.addEventListener(type, handler, false);
		};

		events.removeListener = function(elem, type, handler) {
			elem.removeEventListener(type, handler, false);
		};
	} else if (typeof document.attachEvent === 'function') {
		events.addListener = function(elem, type, handler) {
			elem.attachEvent('on' + type, handler);
		}

		events.removeListener = function(elem, type, handler) {
			elem.detachEvent('on' + type, handler);
		}
	} else {
		events.addListener = function(elem, type, handler) {
			elem['on' + type] = handler;
		}

		events.removeListener = function(elem, type, handler) {
			elem['on' + type] = null;
		}
	}

	return events;

})();

CONTROL.animate = (function() {

})();

CONTROL.dom = (function() {

})();

CONTROL.User = function(name, password) {
	this.name = name;	// логин
	this.password = password; // пароль
	this.categories = { // объект с категориями
		accounts: [],  // категории счетов
		costs: [],  // категории расходов
		gain: [] // категории доходов
	};
	this.mainCurr = 'UAH'; // основная валюта
	this.currency = {  // объект с валютой, заголовками и курсом
		uah: {			
			title: 'Грн',
			price: 0.00
		},
		rub: {  
			title: 'Руб',
			price: 0.00
		},
		usd: {			
			title: 'Долл',
			price: 0.00
		},
		eur: {
			title: 'Евр',
			price: 0.00
		}
	};
	this.history = []; // история операций
	this.total = { 	  // итоги по доходам и расходам
		costs: {
			thisMonth: 0,
			priorMont: 0,
			thisYear: 0,
			priorYear: 0
		},
		gain: {
			thisMonth: 0,
			priorMont: 0,
			thisYear: 0,
			priorYear: 0
		}
	};
}

CONTROL.User.prototype.newCategory = function(type, category) {
	if (this.categories[type] && category) {
		this.categories[type].push(category);
	}
}

CONTROL.User.prototype.removeCategory = function(type, category) {

}