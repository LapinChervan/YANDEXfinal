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
                    data.categories[key]
                        .forEach(function(elem) {
                            html += Mustache.render(tmp, {costs: elem, img: 'operats_cat_' + key});
                        });
                    doc.querySelector('.' + key).innerHTML = html;
                }
                doc.querySelector('input[type=radio][value=' + data.mainCurr + ']').checked = true;
                CONTR.responses.rebuildCurrency(data);
            },

            history: function(data) {
                var  key, key2, key3,
                     data,
                     tmp = doc.querySelector('.history').innerHTML,
                     html = '',
                     history = data.history ? data.history : data,
                     thisData = {};

                for (key in history) {
                    data = history[key];
                    for (key2 in data) {
                        if (data.hasOwnProperty(key2)) {
                            for (key3 in data[key2]) {
                                 thisData[key3] = data[key2][key3];
                            }

                            thisData.sum = CONTR.tools.checkValuePointer(thisData.sum);
                            thisData['spriteImg'] = 'operats_hist_' + thisData.type;
                            thisData.mainCurr = user.data.mainCurr;

                            html = html + Mustache.render(tmp, thisData);
                        }
                    }
                }
                doc.querySelector('.historyUl').innerHTML = html;
                CONTR.responses.filterDate(history);
            },

            calendars: function() {
                ['stat-from', 'stat-to', 'hist-to', 'hist-from']
                    .forEach(function(className) {
                        new Calendar({
                            element:  className
                        });
                    });
            },

            selectLoadSch: function(data, count) {
                var fragment,
                    option = doc.createElement('option'),
                    clone;

                if (count) {
                    option.innerHTML = data;
                    option.value = data;
                    fragment = option;
                }
                else {
                    fragment = doc.createDocumentFragment();
                    option.value = 'all';
                    option.innerHTML = 'Все счета';
                    fragment.appendChild(option);

                    data.categories.accounts
                        .forEach(function(elem) {
                            clone = option.cloneNode();
                            clone.innerHTML = elem;
                            clone.value = elem;
                            fragment.appendChild(clone);
                    });
                }
                doc.querySelector('.history_sch_select').appendChild(fragment);
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
    var doc = document;
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

    /**
    * Проверка на пустое поле.
    *
    * @param  {Element} elem DOM элемент.
    * @return {Boolean}
    */
    function isEmptyOne(elem, val) {
        if (elem.value.length === 0 || elem.value.split(' ').length !== 1) {
            elem.placeholder = 'Ошибка ввода';
            elem.value = '';
            return false;
        }
        elem.placeholder = val;
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
        CONTROL.layer.destroyLayer();
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

    /**
    * Загрузка данных в Селекты (формы операций).
    *
    * @param  {Object} data новые категории.
    * @return {String} formType тип формы для операции.
    */
    function loadSelectForm(data, formType) {
        var clone,
            fragment = doc.createDocumentFragment(),
            fr = doc.createDocumentFragment(),
            option = doc.createElement('option');

        data.categories.accounts
            .forEach(function(elem) {
                clone = option.cloneNode();
                clone.innerHTML = elem;
                fragment.appendChild(clone);
            });

        if (formType == 'send') {
           fr = fragment.cloneNode(true);
        }
        else  {
            data.categories[formType]
                .forEach(function(elem) {
                    clone = option.cloneNode();
                    clone.innerHTML = elem;
                    fr.appendChild(clone);
                });
        }
        doc.querySelector('.select__accounts').appendChild(fragment);
        doc.querySelector('.select__gain').appendChild(fr);
    }

    /**
    * Проверка наличия категории в DOM.
    *
    * @param  {Element} parent Блок родитель (по типу категории).
    * @return {Element} elem Значение элемента, которое нужно проверить.
    */
    function categoryExist(parent, elem) {
        var par = parent.innerHTML.toLowerCase();
        return par.indexOf('<div>' + elem.value.toLowerCase() + '</div>', 0) === -1 ? true : false;
    }

    return {
        isNumber: isNumber,
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
        loadSelectForm: loadSelectForm,
        categoryExist: categoryExist
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
        return host + 'renameCategory?login=' + user + '&type=' + type + '&old=' + encodeURI(old) + '&new=' + encodeURI(cat);
    }

    // Удаление категории
    function removeCategory(user, type, old) {
        return host + 'removeCategory?login=' + user + '&type=' + type + '&old=' + encodeURI(old);
    }

    // Добавление категории
    function newCategory(user, type, cat) {
        return host + 'newCategories?login=' + user + '&typ=' + type + '&cat=' + encodeURI(cat);
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
        return host + 'historyNewOper?login=' + user + '&type=' + type + '&formData=' + encodeURI(data);
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
        return host + 'findOperation?login=' + user + '&account=' + encodeURI(account) + '&type=' + type + '&start=' + start + '&end=' + end;
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
        if (res.type === 'accounts') {
            CONTR.initialize.selectLoadSch(res.cat, 'one');
        }
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
            parentHistSel = doc.querySelector('.history_sch_select'),
            options = parentHistSel.children,
            option, divOp, divCl;

        cat[(cat.indexOf(res.oldName, 0))] = res.newName;

        // UPPERCASE TAGS FOR IE 8 :((
        if (window.getComputedStyle) {
            parent.innerHTML = parent.innerHTML.replace(
                '<div>' + res.oldName + '</div>',
                '<div>' + res.newName + '</div>');
        }
        else {
            divOp = '<div>'.toUpperCase();
            divCl = '</div>'.toUpperCase();
            parent.innerHTML = parent.innerHTML.replace(divOp + res.oldName + divCl, divOp + res.newName + divCl);
        }

        for (var i = 0, length = options.length; i < length; i++) {
            option = options[i];
            if (option.innerHTML === res.oldName) {
                option.innerHTML = res.newName;
                option.value = res.newName;
                break;
            }
        }
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
            options = parentHistSel.children,
            cat = user.data.categories[res.type],
            divOp, divCl, option;

        cat = cat.splice(cat.indexOf(res.cat, 0), 1);
        for (var i = 0, length = options.length; i < length; i++) {
            option = options[i];
            if (option.innerHTML === res.cat) {
                parentHistSel.removeChild(option);
                break;
            }
        }

        if (window.getComputedStyle) {
            indexStart = html.indexOf('<div>' + res.cat + '</div>');
            subs = html.slice(html.lastIndexOf('<div>', indexStart - 1),
                html.indexOf('</div>', indexStart + res.cat.length + 14));
        }
        else {
            divOp = '<div>'.toUpperCase();
            divCl = '</div>'.toUpperCase();
            indexStart = html.indexOf(divOp + res.cat + divCl);
            subs = html.slice(html.lastIndexOf(divOp, indexStart - 1),
                html.indexOf(divCl.toUpperCase(), indexStart + res.cat.length + 14));
        }

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
        tools.showMessage(
            tmpMessage,
            doc.querySelector('.message'),
            'Новая операция успешно добавлена!',
            'warn_yes'
        );
        tools.updateButton(doc.querySelector('.apply_filter2'), res.type, res.date);
    }

    /**
    * Фильтр по датам.
    *
    * @param {Object} res Ответ с сервера с данными.
    */
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
            doc.querySelector('.' + key + '_sumfilter').innerHTML = tools.checkValuePointer(sum) + ' ' +
                                                                    user.data.mainCurr;
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
        // ie 8...
        indexStart = html.indexOf(res);
        if (window.getComputedStyle) {
            subs = html.slice(html.lastIndexOf('<li>', indexStart),
                   html.indexOf('</li>', indexStart) + 5);
        } else {
            subs = html.slice(html.lastIndexOf('<LI>', indexStart),
                   html.indexOf('</LI>', indexStart) + 5);
        }

        parent.innerHTML = html.replace(subs, '');
        CONTR.layer.destroyLayer();
    }

    /**
    * Прорисовка валюты.
    *
    * @param {Object} obj Объект с данными.
    */
    function rebuildCurrency (obj) {
        var mainCurrWrap = doc.querySelectorAll('.currency-radio')[1],
            mainCurr = obj.mainCurr,
            currency = obj.currency[mainCurr],
            templateInput = doc.querySelector('.template_curr').innerHTML,
            radio, key, input = '';

        for (key in currency) {
            input = input + Mustache.render(templateInput, {
                spriteImg: 'valute_' + key,
                valuta: key,
                count: currency[key],
                main: mainCurr
            });
        }
        mainCurrWrap.innerHTML = input;
        CONTR.tools.showMessage(
            tmpMessage,
            doc.querySelector('.mes'),
            'Обновите страницу',
            'warn_error'
        )
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
        tools.showMessage(
            tmpMessage,
            doc.querySelector('.messageResponse'),
            sett[res][0],
            sett[res][1]
        );
        CONTROL.layer.destroyLayer();
    }

    /**
    * Выход на главную.
    */
    function exitToIndex () {
        if (window.location.origin) {
            window.location.href = window.location.origin;
            return;
        }
        window.location.href = window.location.protocol + '//' + window.location.host;
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
            tools.showMessage(
                doc.querySelector('.form-mess'),
                doc.querySelector('.messageResponse'),
                'Логин или пароль указаны неверно!',
                'warn_error'
            );
            return false;
        }

        clearTimeout(CONTR.slider.time);

        user.data = responseData;
		doc.querySelector('.main').innerHTML = doc.querySelector('.user-form').innerHTML;

        //вызов инициализации
        CONTR.initialize.init(responseData);

        // ВЫХОД
        doc.querySelector('.main__user-data__exit').addEventListener('click', function(e) {
            e.preventDefault();
            ajax.toServer(request.closeSession(), response.exitToIndex);
        });

        //ДЕЛЕГИРОВАНИЕ ПЕРЕХОД ПО ТАБАМ
        doc.querySelector('.main__tabs__ul').addEventListener('click', function(e) {
            var target = e.target,
                parentContent = doc.querySelector('.main__tabs__content__ul');
            if (target.tagName === 'LI') {
                ['tab_main', 'tab_history', 'tab_person']
                    .forEach(function(tabClass) {
                        if (target.classList.contains(tabClass)) {
                            target.classList.add('visit');
                            parentContent.querySelector('.' + tabClass).style.display = 'block';
                        } else {
                            doc.querySelector('.' + tabClass).classList.remove('visit');
                            parentContent.querySelector('.' + tabClass).style.display = 'none';
                        }
                    });
            }
        });

        // ДЕЛЕГИРОВАНИЕ ФИЛЬТР ПО ДАТАМ В СТАТИСТИКЕ
        doc.querySelector('.statistics').addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                from, to;

            if (target.classList.contains('apply_filter1')) {
                event.preventDefault();
                from = doc.querySelector('.dateFrom');
                to = doc.querySelector('.dateTo');
                if (tools.isEmptyOne(from, 'Дата') && tools.isEmptyOne(to, 'Дата')) {
                    ajax.toServer(request.filterDate(
                        user.login,
                        tools.getDateMs(from.value),
                        tools.getDateMs(to.value)),
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
        });

        //ДЕЛЕГИРОВАНИЕ ИСТОРИЯ
        doc.querySelector('.history-filter').addEventListener('click', function(e) {
            var event = e || window.event,
                target = event.target || event.srcElement;

            if (target.classList.contains('marginL5')) {
                var parent = target.parentNode,
                    date = parent.querySelectorAll('input[type=text]'),
                    activeOption = tools.findSelectedInput(parent.querySelectorAll('option'), 'selected'),
                    activeRadio = tools.findSelectedInput(parent.querySelectorAll('input[type=radio]'), 'checked');				

                event.stopPropagation();

                if (tools.isEmptyOne(date[0], 'Дата') && tools.isEmptyOne(date[1], 'Дата')) {
                    ajax.toServer(request.filterHistory(
                        user.login,
                        activeOption.value,
                        activeRadio.value,
                        tools.getDateMs(date[0].value),
                        tools.getDateMs(date[1].value)),
                        CONTR.initialize.history
                    );
                    date[0].value = '';
                    date[1].value = '';
                } else {
                    ajax.toServer(request.filterHistory(
                        user.login,
                        activeOption.value,
                        activeRadio.value,
                        undefined,
                        undefined),
                        CONTR.initialize.history
                    );
                }
                CONTR.layer.createLayer({clsContentLayer: 'layer gif-layer'});
            }

            if (target.classList.contains('clearDateFrom')) {
				var dateFrom = doc.querySelectorAll('.dateFrom')[1];
					
                event.preventDefault;
                dateFrom.value = '';
                dateFrom.placeholder = 'Дата';
            }
            if (target.classList.contains('clearDateTo')) {
                var dateTo = doc.querySelectorAll('.dateTo')[1];
				
                event.preventDefault;
                dateTo.value = '';
                dateTo.placeholder = 'Дата';
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

                    CONTR.layer.createLayer({content: Mustache.render(doc.querySelector('.form__gain').innerHTML, {
                        spriteImg: 'operats_form_' + type,
                        accounts: '{{accounts}}'
                    })});

                    new Calendar({
                        element: 'formDate',
                        secondName: 'bcal-container-fix'
                    });

                    tools.loadSelectForm(CONTR.user.data, type);

                    doc.querySelector('.form__gain__add').addEventListener('click', function(e) {
                        var event = e || window.event,
                            form = doc.querySelector('.form__gain__blockInputs').children,
                            len = form.length,
                            arr = ['date', 'sch', 'cat', 'sum', 'comm'],
                            i, item, options, data = {};

                        event.preventDefault();
                        if (tools.isNumber(doc.querySelector('.sumCheck')) &&
                            tools.isEmptyOne(doc.querySelector('.dateCheck'), 'Дата')) {
                                for (i = 0; i < len; i++) {
                                    item = form[i];
                                    if (item.tagName.toLocaleLowerCase() === 'select') {
                                        options = tools.findSelectedInput(item.children, 'selected');
                                        data[arr[i]] = options.value;
                                    }
                                    else {
                                        data[arr[i]] = item.value;
                                    }
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
                            CONTR.layer.destroyLayer();
                        }
                    });
                    break;
                }
            }
        });

        // ДЕЛЕГИРОВАНИЯ (ТАБ 3)
        doc.getElementsByClassName('indentation')[2].addEventListener('click', function(e) {
            var event = e || window,
                target = event.target || event.srcElement,
                key, catName;

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

                        if (tools.isEmptyOne(txtInput, 'Категория')) {
                            if (tools.categoryExist(doc.querySelector('.' + types[key][1]), txtInput) ) {
                                ajax.toServer(request.newCategory(
                                    user.login,
                                    types[key][1],
                                    txtInput.value),
                                    response.newCategory
                                );
                                txtInput.value = '';
                            }
                        }
                        break;
                    }
                }
            }

            //КНОПКИ РЕДАКТИРОВАНИЯ КАТЕГОРИЙ (СЧЕТОВ, ДОХОДОВ, РАСХОДОВ)
            if (target.classList.contains('valute_edit')) {
                ['accounts', 'gain', 'costs']
                    .forEach(function(elem) {
                        if (target.parentNode.parentNode.classList.contains(elem)) {
                            event.stopPropagation();
                            catName = target.parentNode.lastElementChild.innerHTML;
                            CONTR.layer.createLayer({content: Mustache.render(doc.querySelector('.editCatForm').innerHTML,
                                {edit: catName,
                                    caption: 'Изменить',
                                    spriteImg: 'operats_edit'})});

                            doc.querySelector('.butRenameCat').addEventListener('click', function(e) {
                                var event = e || window.event,
                                    input = doc.querySelector('.editCatInput');

                                event.preventDefault();
                                if (CONTR.tools.isEmptyOne(input)) {
                                    ajax.toServer(request.editCategory(
                                        user.login,
                                        elem,
                                        catName,
                                        input.value),
                                        response.renameCategory
                                    );
                                    CONTR.layer.destroyLayer();
                                }
                            });
                        }
                    });
            }

            //КНОПКИ УДАЛЕНИЯ КАТЕГОРИЙ (СЧЕТОВ, ДОХОДОВ, РАСХОДОВ)
            if (target.classList.contains('valute_remove')) {
                ['accounts', 'gain', 'costs']
                    .forEach(function(elem) {
                        if (target.parentNode.parentNode.classList.contains(elem)) {
                            event.stopPropagation();
                            catName = target.parentNode.lastElementChild.innerHTML;
                            CONTR.layer.createLayer({content: Mustache.render(doc.querySelector('.editCatForm').innerHTML,
                                {edit: catName,
                                    caption: 'Удалить',
                                    spriteImg: 'operats_remove',
                                    readonly: 'readonly'
                                })});

                            doc.querySelector('.butRenameCat').addEventListener('click', function(e) {
                                var event = e || window.event;

                                event.preventDefault();
                                ajax.toServer(request.removeCategory(
                                    user.login,
                                    elem,
                                    catName),
                                    response.removeCategory
                                );
                                CONTR.layer.destroyLayer();
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
                CONTR.ajax.toServer(request.changeRates(
                    user.login,
                    JSON.stringify(data))
                );
            }
        });

        // СМЕНА ОСНОВНОЙ ВАЛЮТЫ
        doc.querySelector('.currency-radio').addEventListener('click', function(e) {
            var event = e || window.event,
				target = event.target || event.srcElement,
                price, val;

            if (target.tagName.toLowerCase() === 'label' || target.tagName.toLowerCase() === 'input') {
                if (target.tagName.toLowerCase() === 'label') {
                    val = target.querySelector('input').value;
                }
                else {
                    val = target.value;
                }
                price = +doc.querySelector('.curr-value input[name=' + val + ']').value;
                CONTR.ajax.toServer(request.changeMainCurr(
                    user.login,
                    target.value,
                    price),
                    CONTR.responses.rebuildCurrency
                );
            }
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
            CONTR.layer.createLayer({content: doc.querySelector('.remHistForm').innerHTML});

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

        });
    }

    function registration(user, password) {
        ajax.toServer(request.registration(
            user,
            password),
            response.registration
        );
    }

    function authorization(user, password) {
        ajax.toServer(request.auth(
            user,
            password,
            tools.getDateMs(tools.getDateN('01')),
            tools.getDateMs(tools.getDateN('30'))),
            showContent
        );
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
            Object.keys(options)
                .forEach(function(key) {
                    optionsObject[key] = options[key];
                });
            if (optionsObject.removeDestroy == true) {
                doc.removeEventListener('click', destroyLayer);
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
            parent: doc.body,
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
                doc.addEventListener('click', destroyLayer);
            }
        }
    }

    doc.addEventListener('click', destroyLayer);

    return {
        createLayer: createLayer,
        destroyLayer: destroyLayer
    }
})();

CONTROL.slider = (function() {
    var macElement = document.querySelector('.mac');

    function start() {
        var i = 0;

        setTimeout(function show() {
            macElement.src = 'img/slide' + i + '.png';
            CONTROL.slider.time = setTimeout(show, 5000);
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

