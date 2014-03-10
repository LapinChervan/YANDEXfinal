'use strict'

var CONTROL = {};

CONTROL.initialize = (function() {
    function loadThirdTab(data) {
        var doc = document,
            tmp,
            obj = JSON.parse(data);
        window.login = obj.name;
        for (var key in obj.categories) {
            if (obj.categories.hasOwnProperty(key)) {
                obj.categories[key].
                    forEach(function(elem) {
                        tmp = doc.getElementsByClassName('useraccounts')[0].innerHTML;
                        console.log(key);
                        doc.getElementsByClassName(key)[0].innerHTML = doc.getElementsByClassName(key)[0].innerHTML +
                                                                       Mustache.render(tmp, {costs: elem})
                    });
            }
        }
    }
    return {
        loadThirdTab: loadThirdTab
    }
})();


CONTROL.responses = (function() {
    function newCategory(type, category) {
        var doc = document;

            doc.getElementsByClassName(type)[0].innerHTML = doc.getElementsByClassName(type)[0].innerHTML +
            Mustache.render(doc.getElementsByClassName('useraccounts')[0].innerHTML, {costs: category});
    }

    return {
        newCategory: newCategory
    }
})();

CONTROL.ajax = (function() {
    var responses = CONTROL.responses,
        doc = document;

	function toServer(link, callback) {
		var xhr = new XMLHttpRequest();

        xhr.open('GET', link); 
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            alert(xhr.responseText);


            switch (xhr.responseText) {
                case 'CatFor__GAIN__IsWrite':
                    responses.newCategory('gain', doc.getElementsByClassName('edit_cat_plus')[0].value);
                    doc.getElementsByClassName('edit_cat_plus')[0].value = '';
                    break;

                case 'CatFor__COSTS__IsWrite':
                    responses.newCategory('costs', doc.getElementsByClassName('edit_cat_minus')[0].value);
                    doc.getElementsByClassName('edit_cat_minus')[0].value = '';
                    break;

                case 'CatFor__ACCOUNTS__IsWrite':
                    responses.newCategory('accounts', doc.getElementsByClassName('edit_cat_sch')[0].value);
                    doc.getElementsByClassName('edit_cat_sch')[0].value = '';
                    break;

                case 'new__GAIN__isWrite':

                    break;
            }


            if (typeof callback === 'function') {
                callback(xhr.responseText);
            }
        };
        xhr.send();
	}
	return {
		toServer: toServer
	}
})();

CONTROL.access = (function() {
    var CONTR = CONTROL,
        ajax = CONTR.ajax;

	function showContent(responseData) {
		var doc = document;
		doc.getElementsByClassName('main')[0].innerHTML = doc.getElementById('user-form').innerHTML;
        CONTR.initialize.loadThirdTab(responseData);
        //todo убрать обработчики
        document.querySelector('.floatRight.marginR0').addEventListener('change', function() {
            var target = event.target || event.srcElement; //проверить ие8 на евент таргет а то забыл))
            CONTROL.ajax.toServer('http://localhost:1111/currency?login=' + window.login +'&curr=' + target.value);
        });

        //ОТПРАВКА ОСНОВНОЙ ВАЛЮТЫ
        var btnValuta = doc.getElementsByClassName('buttonValuta')[0];
        btnValuta.addEventListener('click',function() {
            var inputValuta = btnValuta.parentNode.getElementsByClassName('value');
            var data = {};
            for (var i = 0; i < inputValuta.length; i++) {
                data[inputValuta[i].name] = inputValuta[i].value;
            }
            CONTROL.ajax.toServer('http://localhost:1111/currency?login=' + window.login +'&valuta=' + JSON.stringify(data));
        });

        // ОБРАБОТЧИК ВЫЗОВ ФОРМ ДЛЯ ОПЕРАЦИЙ
        doc.getElementsByClassName('first__ul__button')[0].addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement;

            if (target.tagName !== 'DIV') return;
            event.stopPropagation();

            switch (target.innerHTML) {
                case 'Доходы':
                    //ФОРМА ДЛЯ ДОХОДА
                    CONTROL.layer.createLayer({content: doc.getElementById('form__plus').innerHTML});
                    //ДОБАВЛЕНИЕ НОВОГО ДОХОДА
                    doc.getElementsByClassName('form__plus__add')[0].addEventListener('click', function(e) {
                        var form = doc.getElementsByClassName('form__plus__blockInputs')[0];

                        e.preventDefault();
                        ajax.toServer('http://localhost:1111/historyNewOper?login=' + window.login +
                                      '&date='+ form.children[0].value+
                                      '&sch=' + form.children[1].value +
                                      '&cat=' + form.children[2].value +
                                      '&sum=' + form.children[3].value+
                                      '&comment=' + form.children[4].value + '&type=plus');
                    }, false);
                    break;

                case 'Расходы':
                    CONTROL.layer.createLayer({content: doc.getElementById('form__minus').innerHTML});
                    //ДОБАВЛЕНИЕ НОВОГО ДОХОДА
                    doc.getElementsByClassName('form__minus__add')[0].addEventListener('click', function(e) {
                        var form = doc.getElementsByClassName('form__minus__blockInputs')[0];

                        e.preventDefault();
                        ajax.toServer('http://localhost:1111/historyNewOper?login=' + window.login +
                            '&date='+ form.children[0].value+
                            '&sch=' + form.children[1].value +
                            '&cat=' + form.children[2].value +
                            '&sum=' + form.children[3].value+
                            '&comment=' + form.children[4].value + '&type=minus');
                    }, false);
                    break;

                case 'Переводы':
                    CONTROL.layer.createLayer({content: doc.getElementById('form__send').innerHTML});
                    break;
            }
        }, false);

        // ДОБАВЛЕНИЕ НОВЫХ КАТЕГОРИЙ
        doc.getElementsByClassName('addCategoryButton')[1].addEventListener('click', function(e) {
            e.preventDefault();
            ajax.toServer('http://localhost:1111/newCategories?login='+ window.login +
                                                               '&cat=' + doc.getElementsByClassName('edit_cat_plus')[0].value +
                                                               '&typ=gain');
        }, false);

        doc.getElementsByClassName('addCategoryButton')[2].addEventListener('click', function(e) {
            e.preventDefault();
            ajax.toServer('http://localhost:1111/newCategories?login='+ window.login +
                                                              '&cat=' + doc.getElementsByClassName('edit_cat_minus')[0].value +
                                                              '&typ=costs');
        }, false);

        doc.getElementsByClassName('addCategoryButton')[0].addEventListener('click', function(e) {
            e.preventDefault();
            ajax.toServer('http://localhost:1111/newCategories?login='+ window.login +
                                                              '&cat=' + doc.getElementsByClassName('edit_cat_sch')[0].value +
                                                              '&typ=accounts');
        }, false);
	}

    //TODO отсылать логин и пароль не GETом
	function registration(user, password) {
		if (user && password) {
            ajax.toServer('http://localhost:1111/reg?login=' + user +'&password='+ password);
		}
	}

    function authorization(user, password) {
        if (user && password) {
            ajax.toServer('http://localhost:1111/auth?login=' + user +'&password='+ password, showContent);
        }
        return false;
    }

	return {
		registration: registration,
        authorization: authorization
	}
})();

CONTROL.layer = (function () {
    function createLayer (options) {
        var modal = this.modal = document.createElement('div'),
            layer = this.layer = document.createElement('div'),
            optionsObject, key, parent;
        optionsObject = getDefaultOptions();
        for (key in options) {
            if (!options.hasOwnProperty(key)) continue;
            optionsObject[key] = options[key];
        }
        this.parent = parent = optionsObject.parent;
        modal.className = optionsObject.clsOpacityLayer;
        layer.className = optionsObject.clsContentLayer;
        layer.innerHTML = optionsObject.content;
        parent.appendChild(modal);
        parent.appendChild(layer);
        layer.addEventListener('click', function (e) {
            var event = e || window.event;
            event.stopPropagation();
        });
    }

    function getDefaultOptions() {
        return {
            parent: document.body,
            clsOpacityLayer: 'modal',
            clsContentLayer: 'layer',
            content: undefined
        }
    }

    function destroyLayer() {
        var layer = this.layer,
            modal = this.modal,
            parent = this.parent;
        if (!modal || !layer) {
            return;
        }
        parent.removeChild(modal);
        parent.removeChild(layer);
        this.parent = undefined;
        this.layer = undefined;
        this.modal = undefined;
    }

    document.addEventListener('click', function(){
        destroyLayer.call(CONTROL.layer)
    });

    return {
        createLayer: createLayer,
        destroyLayer: destroyLayer
    }
})();


