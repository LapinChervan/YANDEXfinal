'use strict'

/*namespace*/
var CONTROL = {};
CONTROL.user = {};

/*
*   @name Инициализация.
*   @return Возвращает объект с методами.
*/
CONTROL.initialize = (function() {
    var doc = document,
        CONTR = CONTROL,
        user = CONTR.user,
        initMethods = {
            categories: function(data) {
                var tmp = doc.querySelector('.useraccounts').innerHTML,
                    key, html;

                user.login = data.name;

                for (key in data.categories) {
                    html = '';
                    data.categories[key].
                        forEach(function(elem) {
                            html += Mustache.render(tmp, {costs: elem, img: 'operats_cat_' + key});
                        });
                    doc.querySelector('.' + key).innerHTML = html;
                }
                doc.querySelector('input[type=radio][value=' + data.mainCurr + ']').checked = true;
                CONTR.responses.rebuildCurrency(data);
            },

            history: function(data) {
                var  objKey, objKey2, objKey3,
                     data,
                     tmp = doc.querySelector('.history').innerHTML,
                     html = '',
                     history = data.history ? data.history : data,
                     thisData = {};

                for (objKey in history) {
                    data = history[objKey];
                    for (objKey2 in data) {
                        if (data.hasOwnProperty(objKey2)) {
                            for (objKey3 in data[objKey2]) {
                                 thisData[objKey3] = data[objKey2][objKey3];
                            }

                            thisData.sum = tools.checkValuePointer(thisData.sum);
                            thisData['spriteImg'] = 'operats_hist_' + thisData.type;
                            thisData.mainCurr = user.data.mainCurr;

                            html = html + Mustache.render(tmp, thisData);
                        }
                    }
                }
                doc.querySelector('.historyUl').innerHTML = html;
                CONTROL.responses.filterDate(history);
            },

            selectLoadSch: function(data) {
                var accounts = data.categories.accounts,
                    tmp = doc.querySelector('.schHist').innerHTML,
                    html = Mustache.render(tmp, {'histSch': 'Все счета', 'value': 'all'});

                accounts.forEach(function(elem) {
                    html = html + Mustache.render(tmp, {'histSch': elem, 'value': elem});
                });
                doc.querySelector('.history_sch_select').innerHTML = html;
            }
        };

    return  {
        init: function(data) {
            var key,
                methods = initMethods;

            for (key in methods) {
                 setTimeout((function(method) {
                    return function() {
                        methods[method](data);
                    }
                 })(key), 15);
            }
        },
        history: initMethods.history,
        selectLoadSch: initMethods.selectLoadSch
    }
})();

/*
 *   @name Инструменты.
 *   @return Возвращает объект с методами.
 */
CONTROL.tools = (function() {
    /**
    * Проверка на число.
    *
    * @param  {Integer} n Число.
    * @return {Boolean}
    */
    function isNumber(n) {
        if (!isNaN(parseFloat(n.value)) && isFinite(n.value)) {
            n.placeholder = 'Сумма';
            return true;
        }
        n.value = '';
        n.placeholder = 'Ошибка ввода';
        return false;
    }

    function isDate(d) {
        var arr = d.value.split('.');

        if (arr.length !== 3) {
            d.value = '';
            d.placeholder = 'Ошибка ввода';
            return false;
        }

        if (+arr[0] > 0 && +arr[0] <= 31 && arr[0].length === 2) {
            if (+arr[1] > 1 && +arr[1] <= 12  && arr[1].length === 2) {
                if (+arr[2] > 1999 && +arr[2] < 3000 && arr[2].length === 4) {
                    d.placeholder = 'Дата';
                    return true;
                }
            }
        }

        d.value = '';
        d.placeholder = 'Ошибка ввода';
        return false;
    }

    /**
    * Проверка на пустое поле.
    *
    * @param  {Element} elem DOM элемент.
    * @return {Boolean}
    */
    function isEmptyOne(elem) {
        if (elem.value.trim().length === 0) {
            elem.placeholder = 'Ошибка ввода';
            elem.value = '';
            return false;
        }
        elem.placeholder = 'Категория';
        return true;
    }

    /**
    * Проверка плавающей точки у числа. Срез до 2х знаков.
    * (т.к Math.round округляет принудительно в обе стороны,
    * часто возникают потери копеек, поэтому в Коллекции лежат полные числа
    * и операции происходят с полными числами, но чтобы не округлять, вырезаем :) )
    * хотя, при отсутствии округления с некоторыми числа тоже бывают утери коппеек (НО РЕЖЕ)
    * @param  {Integer} numb Число.
    * @return {Integer} Возвращает новое число.
    */
    function checkValuePointer(numb) {
        var arr = numb.toString().split('.');

        if (!arr[1] || arr[1].length < 2) {
            return numb;
        }
        if (arr[1].length > 2) {
            return +(arr[0] + '.' + arr[1].slice(0, 2));
        }
    }

    /**
    * Получение по дате миллисекунд.
    *
    * @param  {String} date Дата строкой.
    * @return {Integer} Возвращает дату в миллисекундах.
    */
    function getDateMs(date) {
        var arr = date.split('.');
        return +new Date(arr[2],arr[1],arr[0]);
    }

    /**
    * Получение даты по числу (dd) в формате dd.mm.yyyy
    *
    * @param  {String} day День месяца.
    * @return {String} Возвращает дату строкой.
    */
    function getDateN(day) {
        var date = new Date();
        return day + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    }

    /**
    * Окрашивает background кнопки (Чтобы принудительно не обновлять после каждой новой
    * операции диаграммы, подсвечивается кнопка, что дает понять о возможной перерисовке по желанию)
    *
    * @param {Element} elem DOM элемент, к которому нужно применить стиль.
    * @param {String} type Тип добавленной операции (если это не доход и не расход, ничего не нужно делать
    * @param {String} date Дата произведенной операции (дата должна быть в рамках текущего месяца с 01 по 30)
    * @return (Boolean}
    */
    function updateButton(elem, type, date) {
        var dateNow = getDateMs(date);
        if (type !== 'send' && ( getDateMs(getDateN('01')) <= dateNow ) && ( getDateMs(getDateN('30')) >= dateNow) ) {
            elem.classList.add('update');
            return true;
        }
        return false;
    }

    /**
    * Возвращает элмент с найденным атрибутом (применяется к radio с checked).
    *
    * @param  {Collection} collection DOM коллекция, в которой нужно искать элемент.
    * @param  {Attribute} option Атрибут, который нужно найти у элемента.
    * @return {Element} Возвращает найденный DOM элемент.
    */
    function findSelectedInput(collection, option) {
        var length = collection.length,
            i, item;

        for (i = 0; i < length; i++) {
            item = collection[i];
            if (item[option]) {
                return item;
            }
        }
    }

    /**
    * Возвращает наибольшее число из двух.
    *
    * @param  {Integer} numb Новое число кандидат на проверку.
    * @param {Integer} biggest  Текущее наибольшее число.
    * @return {Integer} Возвращает наибольшее число.
    */
    function isBiggest(numb, biggest) {
        return (numb > biggest) ? numb : biggest;
    }

    /**
    * Генерирует случайный цвет для элемента диаграммы.
    * * 200 + 30 - чтобы отсеять слишком черные и приближенные к белому цвета
    *
    * @return {String} Возвращает строку со стилем.
    */
    function randomColor() {
        function getColor() {
            return Math.round(Math.random() * 200 + 30);
        }
        return 'rgb(' +getColor()+ ',' +getColor()+ ',' +getColor()+ ');';
    }

    /**
    * Производит подсчет и прорисовывает диаграммы.
    *
    * @param {Object} data Объект с данными.
    */
    function showDiagram(data) {
        var key, key2, sum,
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
                sum = data[key][key2];
                html = html + Mustache.render(doc.querySelector('.cats').innerHTML, {
                    proc: Math.round((sum / biggestArr[i]) * 100),
                    category: key2,
                    price: checkValuePointer(sum),
                    rgb: randomColor()
                });
            }
            i++;
            doc.querySelector('.diag' + key).innerHTML = html;
        }
    }

    /**
    * Показывает уведомление о событиях.
    *
    * @param (String} tmp Класс шаблона.
    * @param (String} parent Класс родителя, куда положить уведомление.
    * @param (String} msg Текст сообщения.
    * @param (String} spriteCls Класс с определенным спрайтом для иконки.
    */
    function showMessage(tmp, parent, msg, spriteCls) {
        var elem = parent,
            style = elem.style;

        parent.innerHTML = Mustache.render(tmp.innerHTML, {msg: msg, spriteImg: spriteCls});
        style.display = 'block';
        setTimeout(function() {
            style.display = 'none';
        }, 1500);
    }

    function loadSelectForm(data, formType) {
        var html, key;

        for (key in data.categories) {
            html = '';

            if (key === 'accounts' || key === formType) {
                data.categories[key].
                    forEach(function(elem) {
                        if (key === 'costs') {
                            html = html + Mustache.render(doc.querySelector('.select__gain').innerHTML, {'accounts': elem});
                        } else {
                            html = html + Mustache.render(doc.querySelector('.select__' + key).innerHTML, {'accounts': elem});
                        }
                    });
                if (key === 'costs') {
                    doc.querySelector('.select__gain').innerHTML = html;
                } else {
                    doc.querySelector('.select__' + key).innerHTML = html;
                }

                if (formType === 'send') {
                    doc.querySelector('.select__gain').innerHTML = html;
                }
            }
        }
    }

    return {
        isNumber: isNumber,
        isDate: isDate,
        getDateMs: getDateMs,
        getDateN: getDateN,
        updateButton: updateButton,
        isBiggest: isBiggest,
        randomColor: randomColor,
        showDiagram: showDiagram,
        findSelectedInput: findSelectedInput,
        isEmptyOne: isEmptyOne,
        checkValuePointer: checkValuePointer,
        showMessage: showMessage,
        loadSelectForm: loadSelectForm
    }
})();

/*
*   @name Реквесты (запросы).
*   @return Возвращает объект с методами.
*/
CONTROL.requests = (function() {
    var host = 'http://localhost:1111/';

    // Смена основной валюты
    function changeMainCurr(user, curr, price) {
        return host + 'currency?login=' + user + '&curr=' + curr + '&price=' + price;
    }

    // Установка нового курса
    function changeRates(user, currData) {
        return host + 'currency?login=' + user + '&valuta=' + currData;
    }

    // Редактирование категории
    function editCategory(user, type, old, cat) {
        return host + 'renameCategory?login=' + user + '&type=' + type + '&old=' + old + '&new=' + cat;
    }

    // Удаление категории
    function removeCategory(user, type, old) {
        return host + 'removeCategory?login=' + user + '&type=' + type + '&old=' + old;
    }

    // Добавление категории
    function newCategory(user, type, cat) {
        return host + 'newCategories?login=' + user + '&typ=' + type + '&cat=' + cat;
    }

    // Регистрация
    function registration(user, password) {
        return host + 'reg?login=' + user + '&password=' + password;
    }

    // Авторизация
    function auth(user, password, start, end) {
        return host + 'auth?login=' + user + '&password=' + password + '&start=' + start + '&end=' + end;
    }

    // Добавление операции
    function newOper(user, type, data) {
        return host + 'historyNewOper?login=' + user + '&type=' + type + '&formData=' + data;
    }

    // Удаление операции
    function removeOper(user, type, id) {
        return host + 'historyRemove?login=' + user + '&type=' + type + '&id=' + id;
    }

    // Фильтр по датам
    function filterDate(user, start, end, type) {
        return host + 'findOperation?login=' + user + '&start=' + start + '&end=' + end + '&type=' + type;
    }

    // Фильтр по истории
    function filterHistory(user, account, type, start, end) {
        return host + 'findOperation?login=' + user + '&account=' + account + '&type=' + type + '&start=' + start + '&end=' + end;
    }

    //Выход
    function closeSession() {
        return host + 'close';
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
        filterDate: filterDate,
        filterHistory: filterHistory,
        closeSession: closeSession
    }
})();

/*
*   @name Респонсы (ответы).
*   @return Возвращает объект с методами.
*/
CONTROL.responses = (function() {
    var doc = document,
        CONTR = CONTROL,
        user = CONTR.user,
        tools = CONTR.tools,
        tmpUserAccoutsNew = doc.querySelector('.useraccountsNew').innerHTML,// Шаблон для категорий
        tmpHistory = doc.querySelector('.historyLi').innerHTML, // Шаблон для операции
        tmpMessage = doc.querySelector('.form-mess'); // Шаблон для сообщения
    /**
    * Добавляет новую категорию.
    *
    * @param {Object} res Ответ с сервера с типом и названием категории.
    */
    function newCategory(res) {
        var categories = doc.querySelector('.' + res.type),
            newCat = doc.createElement('div');

        user.data.categories[res.type].push(res.cat);
        CONTR.initialize.selectLoadSch(user.data);
        newCat.innerHTML = Mustache.render(tmpUserAccoutsNew, {
            costs: res.cat,
            img: 'operats_cat_' + res.type
        });
        categories.appendChild(newCat);
    }

    /**
    * Редактирует текущую категорию.
    *
    * @param {Object} res Ответ с сервера с типом и названием категории (старой и новой).
    */
    function renameCategory(res) {
        var parent = doc.querySelector('.' + res.type),
            cat = user.data.categories[res.type],
            parentHistSel = doc.querySelector('.history_sch_select');

        cat[(cat.indexOf(res.oldName, 0))] = res.newName;
        parent.innerHTML = parent.innerHTML.replace('<div>' + res.oldName + '</div>', '<div>' + res.newName + '</div>');
        parentHistSel.innerHTML = parentHistSel.innerHTML.replace(
            '<option value="' + res.oldName + '">' + res.oldName + '</option>',
            '<option value="' + res.newName + '">' + res.newName + '</option>'
        );
    }

    /**
    * Удаляет текущую категорию.
    *
    * @param {Object} res Ответ с сервера с типом и названием категории.
    */
    function removeCategory(res) {
        var parent = doc.querySelector('.' + res.type),
            html = parent.innerHTML,
            indexStart, subs,
            parentHistSel = doc.querySelector('.history_sch_select'),
            cat = user.data.categories[res.type];

        cat = cat.splice(cat.indexOf(res.cat, 0), 1);
        parentHistSel.innerHTML = parentHistSel.innerHTML.replace(
            '<option value="' + res.cat + '">' + res.cat + '</option>',
            ''
        );

        indexStart = html.indexOf('<div>' + res.cat + '</div>');
        subs = html.slice(html.lastIndexOf('<div>', indexStart - 1),
                          html.indexOf('</div>', indexStart + res.cat.length + 14));
        parent.innerHTML = html.replace(subs, '');
    }

    /**
    * Добавляет новую операцию.
    *
    * @param {Object} res Ответ с сервера с данными об операции.
    */
    function newOper(res) {
        var parent = doc.querySelector('.historyUl'),
            oper = doc.createElement('li');

        res['spriteImg'] = 'operats_hist_' + res.type;
        res.mainCurr = user.data.mainCurr;
        oper.innerHTML = Mustache.render(tmpHistory, res);
        parent.appendChild(oper);
        tools.showMessage(tmpMessage, doc.querySelector('.message'), 'Новая операция успешно добавлена!', 'warn_yes');
        tools.updateButton(doc.querySelector('.apply_filter2'), res.type, res.date);
    }

    function filterDate(res) {
        var sum, key, data,
            i, len,
            diagram = {};

        for (key in res) {
            if (key === 'send') continue;
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
            doc.querySelector('.' + key + '_sumfilter').innerHTML = tools.checkValuePointer(sum) + ' ' + user.data.mainCurr;
        }
        CONTR.tools.showDiagram(diagram);
    }

    /**
     * Удаляет операцию.
     *
     * @param {String} res Ответ с сервера с ID операции.
     */
    function removeOper(res) {
        var parent = doc.querySelector('.historyUl'),
            html = parent.innerHTML,
            indexStart,
            subs;

        indexStart = html.indexOf(res);
        subs = html.slice(html.lastIndexOf('<li>', indexStart),
                          html.indexOf('</li>', indexStart) + 5);
        parent.innerHTML = html.replace(subs, '');
        CONTROL.layer.destroyLayer();
    }

    function rebuildCurrency (obj) {
        var mainCurrWrap = doc.querySelectorAll('.currency-radio')[1],
            mainCurr = obj.mainCurr,
            currency = obj.currency[mainCurr],
            templateInput = doc.querySelector('.template_curr').innerHTML,
            radio, key, input = '';

        for (key in currency) {
            input = input + Mustache.render(templateInput, {spriteImg: 'valute_' + key, valuta: key, count: currency[key], main: mainCurr});
        }
        mainCurrWrap.innerHTML = input;
    }

    /**
    * Ответ после отправки данных на регистрацию.
    *
    * @param {String} res Ответ с сервера.
    */
    function registration(res) {
        var sett = {
            0: ['Регистрация успешно пройдена!', 'warn_yes'],
            1: ['Пользователь с таким именем существует!', 'warn_error']
        };
        tools.showMessage(doc.querySelector('.form-mess'), doc.querySelector('.messageResponse'), sett[res][0], sett[res][1]);
    }

    function exitToIndex () {
        window.location.href = window.location.origin;
    }

    return {
        newCategory: newCategory,
        rebuildCurrency: rebuildCurrency,
        renameCategory: renameCategory,
        removeCategory: removeCategory,
        newOper: newOper,
        removeOper: removeOper,
        filterDate: filterDate,
        registration: registration,
        exitToIndex: exitToIndex
    }
})();

CONTROL.ajax = (function() {
    function toServer(link, callback) {
		var xhr = new XMLHttpRequest(),
            data;

        xhr.open('GET', link);
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
            if (xhr.status == 200) {
                if (typeof callback === 'function') {
                    try {
                        data = JSON.parse(xhr.responseText);
                    } catch (e){
                        data = xhr.responseText;
                    }
                    callback(data);
                }
                xhr = null;
            }
        };
        xhr.send();
	}
	return {
		toServer: toServer
	}
})();

CONTROL.access = (function() {
    var doc = document,
        CONTR = CONTROL,
        ajax = CONTR.ajax,
        response = CONTR.responses,
        request = CONTR.requests,
        user = CONTR.user,
        tools = CONTR.tools;

	function showContent(responseData) {
        if (responseData == '0') {
            tools.showMessage(doc.querySelector('.form-mess'), doc.querySelector('.messageResponse'),
                              'Логин или пароль указаны неверно!', 'warn_error');
            return false;
        }
        user.data = responseData;
		doc.querySelector('.main').innerHTML = doc.getElementById('user-form').innerHTML;

        //вызов инициализации
        CONTR.initialize.init(responseData);

        // ВЫХОД
        doc.querySelector('.main__user-data__exit').addEventListener('click', function(e) {
            var event = e || window.event;
            event.preventDefault();
            ajax.toServer(request.closeSession(), response.exitToIndex);
        });

        //ДЕЛЕГИРОВАНИЕ ПЕРЕХОД ПО ТАБАМ
        doc.querySelector('.main__tabs__ul').addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                tabs, key,
                parentContent = doc.querySelector('.main__tabs__content__ul');

            tabs = {
                'tab_main': ['tab_history', 'tab_person'],
                'tab_history': ['tab_main', 'tab_person'],
                'tab_person':['tab_main', 'tab_history']
            };

            for (key in tabs) {
                if (target.classList.contains(key)) {
                    target.classList.add('visit');
                    parentContent.querySelector('.' + key).style.display = 'block';
                } else {
                    doc.querySelector('.' + key).classList.remove('visit');
                    parentContent.querySelector('.' + key).style.display = 'none';
                }
            }
        }, false);

        // ДЕЛЕГИРОВАНИЕ ФИЛЬТР ПО ДАТАМ В СТАТИСТИКЕ
        doc.querySelector('.statistics').addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement;

            if (target.classList.contains('apply_filter1')) {
                event.preventDefault();

                if (tools.isDate(doc.querySelector('.dateFrom')) && tools.isDate(doc.querySelector('.dateTo'))) {
                    ajax.toServer(request.filterDate(
                        user.login,
                        tools.getDateMs(doc.querySelector('.dateFrom').value),
                        tools.getDateMs(doc.querySelector('.dateTo').value)),
                        response.filterDate
                    );
                }
            }

            if (target.classList.contains('apply_filter2')) {
                target.classList.remove('update');
                event.preventDefault();
                ajax.toServer(request.filterDate(
                    user.login,
                    tools.getDateMs(tools.getDateN('01')),
                    tools.getDateMs(tools.getDateN('30'))),
                    response.filterDate
                );
            }
        }, false);

        //фильтр история
        doc.querySelector('.add_cat_sch.marginL5').addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                parent = target.parentNode,
                date = parent.querySelectorAll('input[type=text]'),
                activeOption = tools.findSelectedInput(parent.querySelectorAll('option'), 'selected'),
                activeRadio = tools.findSelectedInput(parent.querySelectorAll('input[type=radio]'), 'checked');

            event.stopPropagation();

            if (tools.isDate(date[0]) && tools.isDate(date[1])) {
                ajax.toServer(request.filterHistory(
                    user.login,
                    activeOption.value,
                    activeRadio.value,
                    tools.getDateMs(date[0].value),
                    tools.getDateMs(date[1].value)),
                    CONTR.initialize.history
                );
                CONTR.layer.createLayer({clsContentLayer: 'layer gif-layer'});
            } else {
                ajax.toServer(request.filterHistory(
                    user.login,
                    activeOption.value,
                    activeRadio.value,
                    undefined,
                    undefined),
                    CONTR.initialize.history
                );
                CONTR.layer.createLayer({clsContentLayer: 'layer gif-layer'});
            }
        });

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

                    CONTROL.layer.createLayer({content: Mustache.render(doc.querySelector('.form__gain').innerHTML, {
                        spriteImg: 'operats_form_' + type,
                        accounts: '{{accounts}}'
                    })});

                    tools.loadSelectForm(CONTROL.user.data, type);

                    doc.querySelector('.form__gain__add').addEventListener('click', function(e) {
                        var event = e || window.event,
                            form = doc.querySelector('.form__gain__blockInputs').children,
                            len = form.length,
                            arr = ['date', 'sch', 'cat', 'sum', 'comm'],
                            i, item, data = {};

                        event.preventDefault();
                        if (tools.isNumber(doc.querySelector('.sumCheck')) && tools.isDate(doc.querySelector('.dateCheck'))) {
                            for (i = 0; i < len; i++) {
                                item = form[i];
                                data[arr[i]] = item.value;
                            }
                            data['type'] = type;
                            data['id'] = 'id' + Math.round(Math.random() * 1000000);
                            data.time = tools.getDateMs(data.date);

                            ajax.toServer(request.newOper(
                                user.login,
                                type,
                                JSON.stringify(data)),
                                response.newOper
                            );
                            CONTROL.layer.destroyLayer();
                        }
                    }, false);
                    break;
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

                        if (CONTROL.tools.isEmptyOne(txtInput)) {
                            ajax.toServer(request.newCategory(
                                user.login,
                                types[key][1],
                                txtInput.value),
                                response.newCategory
                            );
                            txtInput.value = '';
                        }
                        break;
                    }
                }
            }

            //КНОПКИ РЕДАКТИРОВАНИЯ КАТЕГОРИЙ (СЧЕТОВ, ДОХОДОВ, РАСХОДОВ)
            if (target.classList.contains('valute_edit')) {
                ['accounts', 'gain', 'costs'].
                    forEach(function(elem) {
                        if (target.parentNode.parentNode.classList.contains(elem)) {
                            event.stopPropagation();
                            CONTROL.layer.createLayer({content: Mustache.render(doc.querySelector('.editCatForm').innerHTML,
                                {edit: target.parentNode.lastElementChild.innerHTML,
                                    caption: 'Изменить',
                                    spriteImg: 'operats_edit'})});

                            doc.querySelector('.butRenameCat').addEventListener('click', function(e) {
                                var event = e || window.event,
                                    input = doc.querySelector('.editCatInput'),
                                    old = input.placeholder;

                                event.preventDefault();
                                if (CONTROL.tools.isEmptyOne(input)) {
                                    ajax.toServer(request.editCategory(
                                        user.login,
                                        elem,
                                        old,
                                        input.value),
                                        response.renameCategory
                                    );
                                    CONTROL.layer.destroyLayer();
                                }
                            });
                        }
                    });
            }

            //КНОПКИ УДАЛЕНИЯ КАТЕГОРИЙ (СЧЕТОВ, ДОХОДОВ, РАСХОДОВ)
            if (target.classList.contains('valute_remove')) {
                ['accounts', 'gain', 'costs'].
                    forEach(function(elem) {
                        if (target.parentNode.parentNode.classList.contains(elem)) {
                            event.stopPropagation();
                            CONTROL.layer.createLayer({content: Mustache.render(doc.querySelector('.editCatForm').innerHTML,
                                {edit: target.parentNode.lastElementChild.innerHTML,
                                    caption: 'Удалить',
                                    spriteImg: 'operats_remove'})});

                            doc.querySelector('.butRenameCat').addEventListener('click', function(e) {
                                var event = e || window.event,
                                    input = doc.querySelector('.editCatInput');

                                event.preventDefault();
                                ajax.toServer(request.removeCategory(
                                    user.login,
                                    elem,
                                    input.placeholder),
                                    response.removeCategory
                                );
                                CONTROL.layer.destroyLayer();
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
                CONTROL.ajax.toServer(request.changeRates(
                    user.login,
                    JSON.stringify(data))
                );
            }
        }, false);

        // СМЕНА ОСНОВНОЙ ВАЛЮТЫ
        document.querySelector('.currency-radio').addEventListener('change', function() {
            var target = event.target || event.srcElement,
                price;

            price = +doc.querySelector('.curr-value input[name=' + target.value + ']').value;
            CONTROL.ajax.toServer(request.changeMainCurr(
                user.login,
                target.value,
                price),
                CONTR.responses.rebuildCurrency
            );
        });

        //УДАЛЕНИЕ ИЗ ИСТОРИИ
        doc.querySelector('.historyUl').addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                parent, type, src,
                id;

            if (!target.classList.contains('valute_remove')) return;

            parent = target.parentNode;
            src = parent.querySelector('div[class^=operats_hist_]').className;

            type = src.slice(src.lastIndexOf('_') + 1);

            id = parent.querySelector('.id').innerHTML;
            event.stopPropagation();
            CONTROL.layer.createLayer({content: doc.querySelector('.remHistForm').innerHTML});

            doc.querySelector('.butRemoveHist').addEventListener('click', function(e) {
               var event = e || window.event;

               event.preventDefault();
               ajax.toServer(request.removeOper(
                   user.login,
                   type,
                   id),
                   response.removeOper
               );
            });

        }, false);
    }

    function registration(user, password) {
        if (user && password) {
            ajax.toServer(request.registration(
                user,
                password),
                response.registration
            );
        }
    }

    function authorization(user, password) {
        if (user && password) {
            ajax.toServer(request.auth(
                user,
                password,
                tools.getDateMs(tools.getDateN('01')),
                tools.getDateMs(tools.getDateN('30'))),
                showContent
            );
        }
        return false;
    }

    return {
        registration: registration,
        authorization: authorization,
        showContent: showContent
    }
})();

CONTROL.layer = (function() {
    var doc = document,
        layerElements = {},
        createLayer;

    createLayer = (function() {
        layerElements.modal = doc.createElement('div');
        layerElements.layer = doc.createElement('div');

        var optionsObject = getDefaultOptions(),
            modal = layerElements.modal,
            layer = layerElements.layer;

        layerElements.parent = optionsObject.parent;
        modal.className = optionsObject.clsOpacityLayer;

        layer.addEventListener('click', function(e) {
            var event = e || window.event;
            event.stopPropagation();
        });

        return function (options) {
            var fragment = doc.createDocumentFragment();
            optionsObject = getDefaultOptions();
            Object.keys(options).
                forEach(function(key) {
                    optionsObject[key] = options[key];
                });
            if (optionsObject.removeDestroy == true) {
                document.removeEventListener('click', destroyLayer);
                layerElements.destroy = true;
            }

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
            content: '',
            removeDestroy: false
        }
    }

    function destroyLayer() {
        var parent = layerElements.parent;
        if (layerElements.isCreated) {
            parent.removeChild(layerElements.modal);
            parent.removeChild(layerElements.layer);
            layerElements.isCreated = false;
            if (layerElements.destroy) {
                document.addEventListener('click', destroyLayer);
            }
        }
    }

    document.addEventListener('click', destroyLayer);

    return {
        createLayer: createLayer,
        destroyLayer: destroyLayer
    }
})();

CONTROL.slider = (function() {
    function start() {
        var i = 0, doc = document,
            timerId = setTimeout(function show() {
                doc.querySelector('.mac').src = 'img/slide' + i + '.png';
                setTimeout(show, 5000);
                i++;
                if (i === 4) {
                    i = 0;
                }
        }, 100);
    }

    return {
        start: start
    }
})();
