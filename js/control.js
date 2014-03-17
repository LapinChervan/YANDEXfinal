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
                CONTROL.user.mainCurr = data.mainCurr;

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
                     objKey, objKey2, objKey3,
                     html = '',
                     history = data.history,
                     thisData = {};

                for (objKey in history) {
                    for (objKey2 in  history[objKey]) {
                        for (objKey3 in history[objKey][objKey2]) {
                            thisData[objKey3] = history[objKey][objKey2][objKey3];
                        }

                        switch (thisData.type) {
                            case 'gain':
                                thisData['ico'] = 'img/dohod.png';
                                break;

                            case 'costs':
                                thisData['ico'] = 'img/rashod.png';
                                break;

                            case 'send':
                                thisData['ico'] = 'img/send.png';
                                break;
                        }
                        thisData.mainCurr = data.mainCurr;
                        html = html + Mustache.render(doc.querySelector('.history').innerHTML, thisData);
                    }

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

CONTROL.tools = (function() {
    function getDateMs(date) {
        var arr = date.split('.');
        return Date.parse(new Date(arr[2],arr[1],arr[0]));
    }

    function isBiggest(numb, biggest) {
        return (numb > biggest) ? numb : biggest;
    }

    function randomColor() {
        function getColor() {
            return Math.round(Math.random() * 230);
        }
        return 'rgb(' +getColor()+ ',' +getColor()+ ',' +getColor()+ ');';
    }

    function showDiagram(data) {
        var key, key2,
            biggest, biggestArr = [],
            html, i = 0;

        for (key in data) {
            biggest = 0;
            for (key2 in data[key]) {
                biggest = isBiggest(data[key][key2], biggest);
            }
            biggestArr.push(biggest);
        }

        for (key in data) {
            html = '';
            for (key2 in data[key]) {
                html = html + Mustache.render(doc.querySelector('.cats').innerHTML, {
                    proc: Math.round((data[key][key2] / biggestArr[i]) * 100),
                    category: key2,
                    price: data[key][key2],
                    rgb: randomColor()
                });
            }
            i++;
            doc.querySelector('.diag' + key).innerHTML = html;
        }
    }

    return {
        getDateMs: getDateMs,
        isBiggest: isBiggest,
        randomColor: randomColor,
        showDiagram: showDiagram
    }
})();

CONTROL.reload = (function() {
    var doc = document;
    function loadSelectForm(data, formType) {
        var html, key;

        for (key in data.categories) {
            html = '';
            if (key === 'accounts' || key === formType) {
                data.categories[key].
                    forEach(function(elem) {
                        html = html + Mustache.render(doc.querySelector('.select__' + key).innerHTML, {'accounts': elem});
                });
                doc.querySelector('.select__' + key).innerHTML = html;

                if (formType === 'send') {
                    doc.querySelectorAll('.select__' + key)[1].innerHTML = html;
                }
            }
        }
    }
    return {
        loadSelectForm: loadSelectForm
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

    function newOper(user, type, data) {
        return host + 'historyNewOper?login=' + user + '&type=' + type + '&formData=' + data;
    }

    function removeOper(user, type, id) {
        return host + 'historyRemove?login=' + user + '&type=' + type + '&id=' + id;
    }

    function filterDate(user, start, end, type) {
        return host + 'findOperation?login=' + user + '&start=' + start + '&end=' + end + '&type=' + type;
    }

    function filterHistory(user, account, type) {
        return host + 'findOperation?login=' + user + '&account=' + account + '&type=' + type;
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
        removeOper: removeOper,
        filterDate: filterDate
    }
})();

CONTROL.responses = (function() {
    var doc = document,
        user = CONTROL.user;

    function newCategory(res) {
        var doc = document,
            categories = doc.querySelector('.' + res.type);

        categories.innerHTML = categories.innerHTML + Mustache.render(doc.querySelector('.useraccounts').innerHTML,
                                                                      {costs: res.cat});
    }

    function renameCategory(res) {
        var parent = doc.querySelector('.' + res.type);
        parent.innerHTML = parent.innerHTML.replace('<div>' + res.old + '</div>', '<div>' + res.new + '</div>');
    }

    function removeCategory(res) {
        alert(res);
        var parent = doc.querySelector('.' + res.type),
            html = parent.innerHTML,
            indexStart, subs;

        indexStart = html.indexOf('<div>' + res.cat + '</div>');
        subs = html.slice(html.lastIndexOf('<div>', indexStart - 1),
                                      html.indexOf('<div>', indexStart + 1));
        parent.innerHTML = html.replace(subs, '');
    }

    function newOper(res) {
        var doc = document,
            parent = doc.querySelector('.historyUl');

        switch (res.type) {
            case 'gain':
                res['ico'] = 'img/dohod.png';
                break;

            case 'costs':
                res['ico'] = 'img/rashod.png';
                break;

            case 'send':
                res['ico'] = 'img/send.png';
                break;
        }
        res.mainCurr = user.mainCurr;
        parent.innerHTML = parent.innerHTML + Mustache.render(doc.querySelector('.history').innerHTML, res);
    }

    function filterDate(res) {
        var sum, key, data,
            i, len,
            elem,
            diagram = {};

        for (key in res) {
            if (key === 'accounts') continue;
            sum = 0;
            len = res[key].length;

            diagram[key] = {};

            for (i = 0; i < len; i++) {
                data = res[key][i];
                sum += +data.sum;

                if (!diagram[key][data.cat]) {
                    diagram[key][data.cat] = 0;
                }
                diagram[key][data.cat] += +data.sum;
            }
            doc.querySelector('.' + key + '_sumfilter').innerHTML = sum + ' ' + user.mainCurr;
        }

        CONTROL.tools.showDiagram(diagram);
    }

    function removeOper(res) {
        console.log(res);
        var parent = doc.querySelector('.historyUl'),
            html = parent.innerHTML,
            indexStart,
            subs;

        indexStart = html.indexOf(res);
        subs = html.slice(html.lastIndexOf('<li>', indexStart),
            html.indexOf('</li>', indexStart) + 5);

        alert(subs);
        parent.innerHTML = html.replace(subs, '');
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
        removeOper: removeOper,
        filterDate: filterDate
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
        user = CONTR.user,
        tools = CONTR.tools,
        doc = document;

	function showContent(responseData) {
        user.data  = responseData;
		doc.querySelector('.main').innerHTML = doc.getElementById('user-form').innerHTML;
        CONTR.initialize(responseData);

        // ДЕЛЕГИРОВАНИЕ ФИЛЬТР ПО ДАТАМ В СТАТИСТИКЕ
        doc.querySelector('.statistics').addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement;

            if (target.classList.contains('apply_filter1')) {
                event.preventDefault();
                ajax.toServer(request.filterDate(user.login, tools.getDateMs(doc.querySelector('.dateFrom').value), tools.getDateMs(doc.querySelector('.dateTo').value)),
                              response.filterDate);
            }
        }, false);

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
                    CONTROL.reload.loadSelectForm(CONTROL.user.data, type);

                    doc.querySelector('.form__' + type + '__add').addEventListener('click', function(e) {
                        var event = e || window.event,
                            form = doc.querySelector('.form__' + type  + '__blockInputs').children,
                            len = form.length,
                            arr = ['date', 'sch', 'cat', 'sum', 'comm'],
                            i, item, data = {};

                        for (i = 0; i < len; i++) {
                            item = form[i];
                            data[arr[i]] = item.value;
                        }
                        data['type'] = type;
                        data['id'] = 'id' + Math.round(Math.random() * 1000000);
                        data.time = tools.getDateMs(data.date);

                        event.preventDefault();
                        ajax.toServer(request.newOper(user.login, type, JSON.stringify(data)), response.newOper);
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
                        ajax.toServer(request.newCategory(user.login, types[key][1], txtInput.value), response.newCategory);
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
                                ajax.toServer(request.editCategory(user.login, elem, input.placeholder, input.value),
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
                                ajax.toServer(request.removeCategory(user.login, elem, input.placeholder),
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
                CONTROL.ajax.toServer(request.changeRates(user.login, JSON.stringify(data)));
            }
        }, false);

        document.querySelector('.currency-radio').addEventListener('change', function() {
            var target = event.target || event.srcElement;
            CONTROL.ajax.toServer(request.changeMainCurr(user.login, target.value), CONTR.responses.rebuildCurrency);
        });

        //УДАЛЕНИЕ ИЗ ИСТОРИИ
        doc.querySelector('.historyUl').addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                parent, type, src,  obj = {},
                id;

            if (!target.classList.contains('delete')) return;

            parent = target.parentNode;
            src = parent.querySelector('.icoHist').src;

            switch (src.slice(src.lastIndexOf('/') + 1)) {
                case 'dohod.png':
                    type = 'gain';
                    break;

                case 'rashod.png':
                    type = 'costs';
                    break;

                case 'send.png':
                    type = 'send';
                    break;
            }

            id = parent.querySelector('.id').innerHTML;
            event.stopPropagation();
            CONTROL.layer.createLayer({content: doc.querySelector('.remHistForm').innerHTML});

            doc.querySelector('.butRemoveHist').addEventListener('click', function(e) {
               var event = e || window.event;

               event.preventDefault();
               ajax.toServer(request.removeOper(user.login, type, id), response.removeOper);
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
    var doc = document,
        layerElements = {};
    var createLayer = (function () {
        layerElements.modal = doc.createElement('div');
        layerElements.layer = doc.createElement('div');
        var optionsObject = getDefaultOptions(),
            modal = layerElements.modal, layer = layerElements.layer;
        layerElements.parent = optionsObject.parent;
        modal.className = optionsObject.clsOpacityLayer;
        layer.className = optionsObject.clsContentLayer;

        layer.addEventListener('click', function (e) {
            var event = e || window.event;
            event.stopPropagation();
        });
        return function (options) {
            var fragment = doc.createDocumentFragment();
            Object.keys(options).
                forEach(function(key) {
                    optionsObject[key] = options[key];
                });
            layer.innerHTML = optionsObject.content;
            layer.className = optionsObject.clsContentLayer;
            fragment.appendChild(modal);
            fragment.appendChild(layer);
            layerElements.parent.appendChild(fragment);
            layerElements.isCreated = true;
        }
    })();

    function getDefaultOptions() {
        return {
            parent: document.body,
            clsOpacityLayer: 'modal',
            clsContentLayer: 'layer',
            content: undefined
        }
    }

    function destroyLayer() {
        var parent = layerElements.parent;
        if (layerElements.isCreated) {
            parent.removeChild(layerElements.modal);
            parent.removeChild(layerElements.layer);
            layerElements.isCreated = false;
        }
    }

    document.addEventListener('click', function(){
        destroyLayer();
    });

    return {
        createLayer: createLayer,
        destroyLayer: destroyLayer
    }
})();
