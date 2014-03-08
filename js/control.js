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


CONTROL.ajax = (function() {
	function toServer(link, callback) {
		var xhr = new XMLHttpRequest();

        xhr.open('GET', link); 
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return; 

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
        var btnValuta = doc.getElementsByClassName('buttonValuta')[0];
        btnValuta.addEventListener('click',function() {
            var inputValuta = btnValuta.parentNode.getElementsByClassName('valuta');
            var data = {};
            for (var i = 0; i < inputValuta.length; i++) {
                data[inputValuta[i].name] = inputValuta[i].value;
            }
            CONTROL.ajax.toServer('http://localhost:1111/currency?login=' + window.login +'&valuta=' + data);
        });
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


