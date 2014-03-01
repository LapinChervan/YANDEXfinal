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
	this.mainCurr = 'Грн';
	this.currency = { 
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
	this.history = [];
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
}

CONTROL.User.prototype.newCategory = function(type, category) {
	if (this.categories[type] && category) {
		this.categories[type].push(category);
	}
}

CONTROL.User.prototype.removeCategory = function(type, category) {

}



