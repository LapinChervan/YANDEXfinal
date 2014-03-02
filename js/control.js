var CONTROL = {};

CONTROL.animate = (function() {

})();

CONTROL.dom = (function() {

})();

CONTROL.User = function(name, password) {
	this.name = name;	
	this.password = password;
	this.categories = { 
		accounts: [], 
		costs: [],  
		gain: [] 
	};
	this.mainCurr = '';
	this.history = {
		gain: [],
		costs: [],
		send: []
	};
	this.total = { 	  
		costs: {
			thisMonth: 0 + this.mainCurr,
			priorMont: 0 + this.mainCurr,
			thisYear: 0 + this.mainCurr,
			priorYear: 0 + this.mainCurr
		},
		gain: {
			thisMonth: 0 + this.mainCurr,
			priorMont: 0 + this.mainCurr,
			thisYear: 0 + this.mainCurr,
			priorYear: 0 + this.mainCurr
		}
	};
	this.currency = { 
		uah: {			
			title: 'Грн',
			price: {
				rub: 0.00,
				usd: 0.00,
				eur: 0.00
			}
		},
		rub: {  
			title: 'Руб',
			price: {
				uah: 0.00,
				usd: 0.00,
				eur: 0.00
			}
		},
		usd: {			
			title: 'Долл',
			price: {
				auh: 0.00,
				rub: 0.00,
				eur: 0.00
			}
		},
		eur: {
			title: 'Евр',
			price: {
				uah: 0.00,
				rub: 0.00,
				usd: 0.00
			}
		}
	};
};


CONTROL.User.prototype = (function() {

	function isObject(obj) {
		return Object.prototype.toString.call(obj) === '[object Object]' ? true : false;	
	}

	function newCategory(type, category) {
		var arr = this.categories[type];
		if (arr && category) {
			arr.push(category);
			return true;
		}
		return false;
	}

	function removeCategory(type, category) {
		var arr = this.categories[type];
		if (arr && arr.indexOf(category) !== -1) {
			arr = arr.splice(arr.indexOf(category), 1);
			return true;
		}
		return false;
	}

	function renameCategory(type, oldCategory, newCategory) {
		var arr = this.categories[type];
		if (arr && arr.indexOf(oldCategory) !== -1 && newCategory) {
			arr = arr.splice(arr.indexOf(oldCategory), 1, newCategory);
			return true;
		}
		return false;
	}

	function setMainCurr(main, dataCurr) {
		var curr = this.currency[main].price;
		if (curr && isObject(dataCurr)) {
			Object.keys(dataCurr).
				forEach(function(elem) {
					curr[elem] = dataCurr[elem];
				});
			this.mainCurr = this.currency[main].title;
			return true;
		}
		return false;
	}

	function setTitleCurr(type, title) {
		var arr = this.currency[type];
		if (arr && title) {
			arr.title = title;
			return true;
		}	
		return false;
	}

	function newTransaction(type, data) {
		var arr = this.history[type];
		if (arr && isObject(data)) {
			arr.push(data);
			return true;
		}
		return false;
	}

	return {
		newCategory: newCategory,
		removeCategory: removeCategory,
		renameCategory: renameCategory,
		setMainCurr: setMainCurr,
		setTitleCurr: setTitleCurr,
		newTransaction: newTransaction		
	}

})();
