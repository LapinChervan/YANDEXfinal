'use strict'
var CONTROL = {};

CONTROL.user = {
    login: ''
};

CONTROL.initialize = (function() {
    var doc = document,
        initMethods = {
            categories: function(data) {
                var tmp = doc.querySelector('.useraccounts').innerHTML,
                    key, html;

                CONTROL.user.login = data.name;

                for (key in data.categories) {
                    html = '';
                    data.categories[key].
                        forEach(function(elem) {
                            html += Mustache.render(tmp, {costs: elem});
                        });
                    doc.querySelector('.' + key).innerHTML = html;
                }
                CONTROL.responses.rebuildCurrency(data);
            },

            history: function(data) {
                var  doc = document,
                     key, key2,
                     html = '',
                     history = data.history,
                     thisData = {};


                for (key in history) {
                    history[key].
                        forEach(function(objInArr) {
                            for (key2 in objInArr) {
                                 thisData[key2] = objInArr[key2];
                            }
                            thisData.mainCurr = data.mainCurr;
                            html = html + Mustache.render(doc.querySelector('.history' + thisData.type).innerHTML, thisData);
                    });
                }
                doc.querySelector('.historyUl').innerHTML = html;
            }
        };
    return function (data) {
        var key,
            methods = initMethods;

        for (var key in methods) {
          //  setTimeout(function() {
                methods[key](data);
          //  }, 150);
        }
    }
})();

CONTROL.requests = (function() {
    var host = 'http://localhost:1111/';

    function changeMainCurr(user, curr) {
        return host + 'currency?login=' + user + '&curr=' + curr;
    }

    function changeRates(user, currData) {
        return host + 'currency?login=' + user + '&valuta=' + currData;
    }

    function editCategory(user, type, old, cat) {
        return host + 'renameCategory?login=' + user + '&type=' + type + '&old=' + old + '&new=' + cat;
    }

    function removeCategory(user, type, old) {
        return host + 'removeCategory?login=' + user + '&type=' + type + '&old=' + old;
    }

    function newCategory(user, type, cat) {
        return host + 'newCategories?login=' + user + '&typ=' + type + '&cat=' + cat;
    }

    function registration(user, password) {
        return host + 'reg?login=' + user + '&password=' + password;
    }

    function auth(user, password) {
        return host + 'auth?login=' + user + '&password=' + password;
    }

    function newOper(user, type, date, sch, cat, sum, comm, id) {
        return host + 'historyNewOper?login=' + user + '&type=' + type + '&date=' + date + '&sch=' + sch +
               '&cat=' + cat + '&sum=' + sum + '&comment=' + comm + '&id=' + id;
    }

    function removeOper(user, id) {
        return host + 'historyRemove?login=' + user + '&id=' + id;
    }

    return {
        changeMainCurr: changeMainCurr,
        changeRates: changeRates,
        editCategory: editCategory,
        removeCategory: removeCategory,
        newCategory: newCategory,
        registration: registration,
        auth: auth,
        newOper: newOper,
        removeOper: removeOper
    }
})();

CONTROL.responses = (function() {
    var doc = document;

    function newCategory(res) {
        var doc = document,
            categories = doc.getElementsByClassName(res.type)[0];

        categories.innerHTML = categories.innerHTML + Mustache.render(doc.querySelectorAll('.useraccounts').innerHTML,
                                                                      {costs: res.cat});
    }

    function renameCategory(res) {
        var parent = doc.querySelectorAll('.' + res.type);
        parent.innerHTML = parent.innerHTML.replace('<div>' + res.old + '</div>', '<div>' + res.new + '</div>');
    }

    function removeCategory(res) {
        var parent = doc.querySelectorAll('.' + res.type),
            html = parent.innerHTML,
            indexStart, subs;

        indexStart = html.indexOf('<div>' + res.cat + '</div>');
        subs = html.slice(html.lastIndexOf('<div>', indexStart - 1),
                                      html.indexOf('<div>', indexStart + 1));
        parent.innerHTML = html.replace(subs, '');
    }

    function newOper(res) {
        var doc = document,
            parent = doc.querySelectorAll('.historyUl');

        parent.innerHTML = parent.innerHTML +
                           Mustache.render(doc.querySelectorAll('.history' + res.type).innerHTML, res);
    }

    function removeOper(res) {

    }

    function rebuildCurrency (obj) {
        var mainCurrWrap = doc.querySelector('.currency-radio'),
            mainCurr = obj.mainCurr,
            currency = obj.currency[mainCurr],
            templateRadio = doc.querySelector('.template_value').innerHTML,
            templateInput = doc.querySelector('.template_curr').innerHTML,
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

    return {
        newCategory: newCategory,
        rebuildCurrency: rebuildCurrency,
        renameCategory: renameCategory,
        removeCategory: removeCategory,
        newOper: newOper,
        removeOper: removeOper
    }
})();

CONTROL.ajax = (function() {
	function toServer(link, callback) {
		var xhr = new XMLHttpRequest();

        xhr.open('GET', link); 
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;

            alert(xhr.responseText);
            if (typeof callback === 'function') {
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
        ajax = CONTR.ajax,
        response = CONTR.responses,
        request = CONTR.requests,
        login = CONTR.user.login,
        doc = document;

	function showContent(responseData) {
		doc.querySelectorAll('.main').innerHTML = doc.getElementById('user-form').innerHTML;
        CONTR.initialize(responseData);

        // ДЕЛЕГИРОВАНИЯ КНОПОК ВЫЗОВА ФОРМ ДЛЯ ОПЕРАЦИЙ (ТАБ 1)
        doc.querySelector('.first__ul__button').addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                key, formType, type;

            if (target.tagName !== 'DIV') return;

            formType = {
                'Доходы': 'gain',
                'Расходы': 'costs',
                'Переводы': 'send'
            };

            for (key in formType) {
                if (target.innerHTML === key) {
                    type = formType[key];
                    event.stopPropagation();
                    CONTROL.layer.createLayer({content: doc.querySelector('.form__' + type).innerHTML});

                    doc.querySelector('.form__' + type + '__add').addEventListener('click', function(e) {
                        var event = e || window.event,
                            form = doc.querySelector('form__' + type  + '__blockInputs');

                        event.preventDefault();
                        ajax.toServer(request.newOper(login, type, form.children[0].value,
                            form.children[1].value,
                            form.children[2].value,
                            form.children[3].value,
                            form.children[4].value,
                            Math.round(Math.random()*1000000)),
                            response.newOper);
                    }, false);
                }
            }
        }, false);

        // ДЕЛЕГИРОВАНИЯ (ТАБ 3)
        doc.getElementsByClassName('indentation')[2].addEventListener('click', function(e) {
            var event = e || window,
                target = event.target || event.srcElement,
                key;

            //КНОПКИ ДОБАВЛЕНИЯ НОВЫХ КАТЕГОРИЙ (СЧЕТОВ, ДОХОДОВ, РАСХОДОВ)
            if (target.classList.contains('addCategoryButton')) {
                event.preventDefault();

                var txtInput,
                    types = {
                    add_cat_sch: ['edit_cat_sch', 'accounts'],
                    add_cat_plus: ['edit_cat_plus', 'gain'],
                    add_cat_minus: ['edit_cat_minus', 'costs']
                    };

                for (key in types) {
                    if (target.classList.contains(key)) {
                        txtInput = doc.querySelector('.' + types[key][0]);
                        ajax.toServer(request.newCategory(login, types[key][1], txtInput.value), response.newCategory);
                        txtInput.value = '';
                    }
                }
            }

            //КНОПКИ РЕДАКТИРОВАНИЯ КАТЕГОРИЙ (СЧЕТОВ, ДОХОДОВ, РАСХОДОВ)
            if (target.classList.contains('edit')) {
                ['accounts', 'gain', 'costs'].
                    forEach(function(elem) {
                        if (target.parentNode.parentNode.classList.contains(elem)) {
                            event.stopPropagation();
                            CONTROL.layer.createLayer({content: Mustache.render(doc.querySelector('.editCatForm').innerHTML,
                                {edit: target.parentNode.lastElementChild.innerHTML,
                                    caption: 'Изменить',
                                    img: 'img/edit2.png'})});

                            doc.querySelector('.butRenameCat').addEventListener('click', function(e) {
                                var event = e || window.event,
                                    input = doc.querySelector('.editCatInput');

                                event.preventDefault();
                                ajax.toServer(request.editCategory(login, elem, input.placeholder, input.value),
                                    response.renameCategory);
                            });
                        }
                    });
            }

            //КНОПКИ УДАЛЕНИЯ КАТЕГОРИЙ (СЧЕТОВ, ДОХОДОВ, РАСХОДОВ)
            if (target.classList.contains('delete')) {
                ['accounts', 'gain', 'costs'].
                    forEach(function(elem) {
                        if (target.parentNode.parentNode.classList.contains(elem)) {
                            event.stopPropagation();
                            CONTROL.layer.createLayer({content: Mustache.render(doc.querySelector('.editCatForm').innerHTML,
                                {edit: target.parentNode.lastElementChild.innerHTML,
                                    caption: 'Удалить',
                                    img: 'img/close2.png',
                                    readonly: 'readonly'})});

                            doc.querySelector('.butRenameCat').addEventListener('click', function(e) {
                                var event = e || window.event,
                                    input = doc.querySelector('.editCatInput');

                                event.preventDefault();
                                ajax.toServer(request.removeCategory(login, elem, input.placeholder),
                                    response.removeCategory);
                            });
                        }
                    });
            }

            if (target.classList.contains('buttonValuta')) {
                var inputCurr = target.parentNode.getElementsByClassName('value'),
                    len = inputCurr.length, i, item,
                    data = {};

                for (i = 0; i < len; i++) {
                    item = inputCurr[i];
                    data[item.name] = item.value;
                }
                CONTROL.ajax.toServer(request.changeRates(login, JSON.stringify(data)));
            }
        }, false);

        document.querySelector('.currency-radio').addEventListener('change', function() {
            var target = event.target || event.srcElement;
            CONTROL.ajax.toServer(request.changeMainCurr(login, target.value), CONTR.responses.rebuildCurrency);
        });

        //УДАЛЕНИЕ ИЗ ИСТОРИИ
        doc.querySelector('.historyUl').addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                id;

            if (!target.classList.contains('delete')) return;
            id = target.previousElementSibling.innerHTML;
            alert('id='+id);
            event.stopPropagation();
            CONTROL.layer.createLayer({content: doc.querySelector('.remHistForm').innerHTML});

            doc.querySelector('.butRemoveHist').addEventListener('click', function(e) {
               var event = e || window.event;

               event.preventDefault();
               ajax.toServer(request.removeOper(login, id), request.removeOper);
            });

        }, false);
    }

    function registration(user, password) {
        if (user && password) {
            ajax.toServer(request.registration(user, password));
        }
    }

    function authorization(user, password) {
        if (user && password) {
            ajax.toServer(request.auth(user, password), showContent);
        }
        return false;
    }

    return {
        registration: registration,
        authorization: authorization
    }
})();

CONTROL.layer = (function() {
    var doc = document;
    
    function createLayer(options) {
        var modal = this.modal = doc.createElement('div'),
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
