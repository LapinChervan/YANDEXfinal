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
}

CONTROL.User.prototype.newCategory = function(type, category) {
	var arr = this.categories[type];
	if (arr && category) {
		arr.push(category);
	}
}

CONTROL.User.prototype.removeCategory = function(type, category) {
	var arr = this.categories[type];
	if (arr && arr.indexOf(category) !== -1) {
		arr = arr.splice(arr.indexOf(category), 1);
	}
}

CONTROL.User.prototype.renameCategory = function(type, oldCategory, newCategory) {
	var arr = this.categories[type];
	if (arr && arr.indexOf(oldCategory) !== -1 && newCategory) {
		arr = arr.splice(arr.indexOf(oldCategory), 1, newCategory);
	}
}

CONTROL.Layer = function (options) {
    this.allLayers = [];
};

CONTROL.Layer.prototype.getDefaultOptions = function () {
    return {
        parent: document.body,
        clsOpacityLayer: undefined,
        clsContentLayer: undefined,
        content: undefined
    }
};