'use strict'
var CONTROL = {};

CONTROL.user = {
    login: ''
};

CONTROL.initialize = (function() {
    var initMethods = {
        categories: function(data) {
            var doc = document,
                tmp = doc.getElementsByClassName('useraccounts')[0].innerHTML,
                key, html;

            CONTROL.user.login = data.name;

            for (key in data.categories) {
                html = '';
                data.categories[key].
                    forEach(function(elem) {
                        html += Mustache.render(tmp, {costs: elem});
                    });
                doc.getElementsByClassName(key)[0].innerHTML = html;
            }
            CONTROL.responses.rebuildCurrency(data);
        }
    };
    return function (data) {
        var key,
            methods = initMethods;

        for (var key in methods) {
            setTimeout(function() {
                methods[key](data);
            }, 15);
        }
    }
})();

CONTROL.requests = (function() {
    var host = 'http://localhost:1111/';

})();

CONTROL.responses = (function() {
    function newCategory(type, category) {
        var doc = document;
        doc.getElementsByClassName(type)[0].innerHTML = doc.getElementsByClassName(type)[0].innerHTML +
        Mustache.render(doc.getElementsByClassName('useraccounts')[0].innerHTML, {costs: category});
    }

    function rebuildCurrency (obj) {
        var mainCurrWrap = document.querySelector('.floatRight.marginR0'),
            mainCurr = obj.mainCurr,
            currency = obj.currency[mainCurr],
            templateRadio = document.querySelector('.template_value').innerHTML,
            templateInput = document.querySelector('.template_curr').innerHTML,
            currentCurr = Mustache.render(templateRadio, {value: mainCurr}),
            index = currentCurr.indexOf('input') + 5,
            radio, key, input = '';
        radio = currentCurr.slice(0, index) + ' checked' + currentCurr.slice(index, currentCurr.length);
        for (key in currency) {
            radio = radio + Mustache.render(templateRadio, {value: key});
            input = input + Mustache.render(templateInput, {valuta: key, count: currency[key], main: mainCurr});
        }
        mainCurrWrap.innerHTML = radio;
        mainCurrWrap.nextElementSibling.innerHTML = input;
    }

    function reViewCategories (response) {
        switch (response) {
            case 'CatFor__gain__IsWrite':
                newCategory('gain', doc.getElementsByClassName('edit_cat_plus')[0].value);
                doc.getElementsByClassName('edit_cat_plus')[0].value = '';
                break;

            case 'CatFor__costs__IsWrite':
                newCategory('costs', doc.getElementsByClassName('edit_cat_minus')[0].value);
                doc.getElementsByClassName('edit_cat_minus')[0].value = '';
                break;

            case 'CatFor__accounts__IsWrite':
                newCategory('accounts', doc.getElementsByClassName('edit_cat_sch')[0].value);
                doc.getElementsByClassName('edit_cat_sch')[0].value = '';
                break;

            case 'new__GAIN__isWrite':

                break;
        }
    }

    return {
        newCategory: newCategory,
        rebuildCurrency: rebuildCurrency,
        reViewCategories: reViewCategories
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

            if (typeof callback === 'function') {
               /* if (typeof xhr.responseText ==='object') {
                    callback(JSON.parse(xhr.responseText));
                }
                else {
                    callback(xhr.responseText);
                }*/
                try {
                    callback(JSON.parse(xhr.responseText));
                } catch (e){
                    callback(xhr.responseText);
                }
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

        CONTR.initialize(responseData);

        document.querySelector('.floatRight.marginR0').addEventListener('change', function() {
            var target = event.target || event.srcElement;
            CONTROL.ajax.toServer('http://localhost:1111/currency?login=' + CONTROL.user.login +'&curr=' + target.value,CONTR.responses.rebuildCurrency);
        });

        //ОТПРАВКА ОСНОВНОЙ ВАЛЮТЫ
        var btnValuta = doc.getElementsByClassName('buttonValuta')[0];
        btnValuta.addEventListener('click',function() {
            var inputValuta = btnValuta.parentNode.getElementsByClassName('value');
            var data = {};
            for (var i = 0; i < inputValuta.length; i++) {
                data[inputValuta[i].name] = inputValuta[i].value;
            }
            CONTROL.ajax.toServer('http://localhost:1111/currency?login=' + CONTROL.user.login +'&valuta=' + JSON.stringify(data));
        });

        // РЕДАТИРОВАНИЕ КАТЕГОРИЙ РАСХОДОВ
        doc.getElementsByClassName('costs')[0].addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement;

            if (target.classList.contains('edit')) {
                event.stopPropagation();
                CONTROL.layer.createLayer({content: Mustache.render(doc.getElementsByClassName('editCatForm')[0].innerHTML,
                                                   {edit: target.parentNode.lastElementChild.innerHTML,
                                                    caption: 'Изменить',
                                                    img: 'img/edit2.png'})});

                doc.getElementsByClassName('butRenameCat')[0].addEventListener('click', function(e) {
                    var event = e || window.event,
                        input = doc.getElementsByClassName('editCatInput')[0];

                    event.preventDefault();
                    ajax.toServer('http://localhost:1111/renameCategory?login=' + CONTROL.user.login +
                        '&type=costs' +
                        '&old=' + input.placeholder +
                        '&new=' + input.value);
                });

            } else if
                (target.classList.contains('delete')) {
                    event.stopPropagation();
                    CONTROL.layer.createLayer({content: Mustache.render(doc.getElementsByClassName('editCatForm')[0].innerHTML,
                                                            {edit: target.parentNode.lastElementChild.innerHTML,
                                                            caption: 'Удалить',
                                                            img: 'img/close2.png',
                                                            readonly: 'readonly'})});

                    doc.getElementsByClassName('butRenameCat')[0].addEventListener('click', function(e) {
                        var event = e || window.event,
                            input = doc.getElementsByClassName('editCatInput')[0];

                        event.preventDefault();
                        ajax.toServer('http://localhost:1111/removeCategory?login=' + CONTROL.user.login +
                            '&type=costs' +
                            '&old=' + input.placeholder);
                    });
                }
        });
        // РЕДАТИРОВАНИЕ КАТЕГОРИЙ ДОХОДОВ
        doc.getElementsByClassName('gain')[0].addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement;

            if (target.classList.contains('edit')) {
                event.stopPropagation();
                CONTROL.layer.createLayer({content: Mustache.render(doc.getElementsByClassName('editCatForm')[0].innerHTML,
                                                    {edit: target.parentNode.lastElementChild.innerHTML,
                                                    caption: 'Изменить',
                                                    img: 'img/edit2.png'})});

                doc.getElementsByClassName('butRenameCat')[0].addEventListener('click', function(e) {
                    var event = e || window.event,
                        input = doc.getElementsByClassName('editCatInput')[0];

                    event.preventDefault();
                    ajax.toServer('http://localhost:1111/renameCategory?login=' + CONTROL.user.login +
                        '&type=gain' +
                        '&old=' + input.placeholder +
                        '&new=' + input.value);
                });

            } else if
                (target.classList.contains('delete')) {
                    event.stopPropagation();
                    CONTROL.layer.createLayer({content: Mustache.render(doc.getElementsByClassName('editCatForm')[0].innerHTML,
                        {edit: target.parentNode.lastElementChild.innerHTML,
                            caption: 'Удалить',
                            img: 'img/close2.png',
                            readonly: 'readonly'})});

                    doc.getElementsByClassName('butRenameCat')[0].addEventListener('click', function(e) {
                        var event = e || window.event,
                            input = doc.getElementsByClassName('editCatInput')[0];

                        event.preventDefault();
                        ajax.toServer('http://localhost:1111/removeCategory?login=' + CONTROL.user.login +
                            '&type=gain' +
                            '&old=' + input.placeholder);
                    });
                }
        });
        // РЕДАТИРОВАНИЕ КАТЕГОРИЙ СЧЕТОВ
        doc.getElementsByClassName('accounts')[0].addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement;

            if (target.classList.contains('edit')) {
                event.stopPropagation();
                CONTROL.layer.createLayer({content: Mustache.render(doc.getElementsByClassName('editCatForm')[0].innerHTML,
                                                    {edit: target.parentNode.lastElementChild.innerHTML,
                                                     caption: 'Изменить',
                                                     img: 'img/edit2.png'})});

                doc.getElementsByClassName('butRenameCat')[0].addEventListener('click', function(e) {
                    var event = e || window.event,
                        input = doc.getElementsByClassName('editCatInput')[0];

                    event.preventDefault();
                    ajax.toServer('http://localhost:1111/renameCategory?login=' + CONTROL.user.login +
                        '&type=accounts' +
                        '&old=' + input.placeholder +
                        '&new=' + input.value);
                });

            } else if
                (target.classList.contains('delete')) {
                    event.stopPropagation();
                    CONTROL.layer.createLayer({content: Mustache.render(doc.getElementsByClassName('editCatForm')[0].innerHTML,
                        {edit: target.parentNode.lastElementChild.innerHTML,
                            caption: 'Удалить',
                            img: 'img/close2.png',
                            readonly: 'readonly'})});

                    doc.getElementsByClassName('butRenameCat')[0].addEventListener('click', function(e) {
                        var event = e || window.event,
                            input = doc.getElementsByClassName('editCatInput')[0];

                        event.preventDefault();
                        ajax.toServer('http://localhost:1111/removeCategory?login=' + CONTROL.user.login +
                            '&type=accounts' +
                            '&old=' + input.placeholder);
                    });
                }
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
                        ajax.toServer('http://localhost:1111/historyNewOper?login=' + CONTROL.user.login +
                                      '&date='+ form.children[0].value+
                                      '&sch=' + form.children[1].value +
                                      '&cat=' + form.children[2].value +
                                      '&sum=' + form.children[3].value+
                                      '&comment=' + form.children[4].value + '&type=plus');
                    }, false);
                    break;

                case 'Расходы':
                    //ФОРМА ДЛЯ РАСХОДА
                    CONTROL.layer.createLayer({content: doc.getElementById('form__minus').innerHTML});
                    //ДОБАВЛЕНИЕ НОВОГО РАСХОДА
                    doc.getElementsByClassName('form__minus__add')[0].addEventListener('click', function(e) {
                        var form = doc.getElementsByClassName('form__minus__blockInputs')[0];

                        e.preventDefault();
                        ajax.toServer('http://localhost:1111/historyNewOper?login=' + CONTROL.user.login +
                            '&date='+ form.children[0].value+
                            '&sch=' + form.children[1].value +
                            '&cat=' + form.children[2].value +
                            '&sum=' + form.children[3].value+
                            '&comment=' + form.children[4].value + '&type=minus');
                    }, false);
                    break;

                case 'Переводы':
                    //ФОРМА ДЛЯ ПЕРЕВОДА
                    CONTROL.layer.createLayer({content: doc.getElementById('form__send').innerHTML});
                    //ДОБАВЛЕНИЕ НОВОГО ПЕРЕВОДА
                    doc.getElementsByClassName('form__send__add')[0].addEventListener('click', function(e) {
                        var form = doc.getElementsByClassName('form__send__blockInputs')[0];

                        e.preventDefault();
                        ajax.toServer('http://localhost:1111/historyNewOper?login=' + CONTROL.user.login +
                            '&date='+ form.children[0].value+
                            '&sch=' + form.children[1].value +
                            '&cat=' + form.children[2].value +
                            '&sum=' + form.children[3].value+
                            '&comment=' + form.children[4].value + '&type=send');
                    }, false);
                    break;
            }
        }, false);

        // ДОБАВЛЕНИЕ НОВЫХ КАТЕГОРИЙ
        doc.getElementsByClassName('addCategoryButton')[1].addEventListener('click', function(e) {
            e.preventDefault();
            ajax.toServer('http://localhost:1111/newCategories?login='+ CONTROL.user.login +
                                                               '&cat=' + doc.getElementsByClassName('edit_cat_plus')[0].value +
                                                               '&typ=gain',CONTROL.responses.reViewCategories);
        }, false);

        doc.getElementsByClassName('addCategoryButton')[2].addEventListener('click', function(e) {
            e.preventDefault();
            ajax.toServer('http://localhost:1111/newCategories?login='+ CONTROL.user.login +
                                                              '&cat=' + doc.getElementsByClassName('edit_cat_minus')[0].value +
                                                              '&typ=costs',CONTROL.responses.reViewCategories);
        }, false);

        doc.getElementsByClassName('addCategoryButton')[0].addEventListener('click', function(e) {
            e.preventDefault();
            ajax.toServer('http://localhost:1111/newCategories?login='+ CONTROL.user.login +
                                                              '&cat=' + doc.getElementsByClassName('edit_cat_sch')[0].value +
                                                              '&typ=accounts',CONTROL.responses.reViewCategories);
        }, false);



	}

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

CONTROL.layer = (function() {
    function createLayer(options) {
        var doc = document,
            modal = this.modal = doc.createElement('div'),
            layer = this.layer = doc.createElement('div'),
            optionsObject, parent;

        optionsObject = getDefaultOptions();
        Object.keys(options).
            forEach(function(key) {
                optionsObject[key] = options[key];
            });

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
