'use strict'

var CONTROL = {};

CONTROL.userData = {};

CONTROL.initialize = (function() {
    function loadThirdTab(data) {
        var doc = document,
            tmp = doc.getElementById('useraccounts').innerHTML,
            wrapTmp = doc.createElement('div');

        Object.keys(data.categories).
            forEach(function(keyArr) {
               keyArr.forEach(function(elem) {
                   tmp = doc.getElementById('user' + keyArr).innerHTML;
                   wrapTmp.innerHTML = Mustache.render(tmp, {keyArr: elem});
                   doc.getElementsByClassName(keyArr)[0].appendChild(wrapTmp);
               });
            });
       // wrapTmp.innerHTML = Mustache.render(tmp, view);
       // doc.getElementsByClassName('accounts')[0].appendChild(wrapTmp);
    }
    return {
        loadThirdTab: loadThirdTab
    }
})();

CONTROL.userData = null;

CONTROL.ajax = (function() {
	function toServer(link, callback) {
		var xhr = new XMLHttpRequest(),
			data = {};

        xhr.open('GET', link); 
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return; 
            //TODO ПОЗЖЕ СДЕЛАТЬ ГЛУБОКОЕ КОПИРОВАНИЕ
            for (var key in xhr.responseText) {
                data[key] = xhr.responseText[key];
            }
            if (typeof callback === 'function' && data) {
                callback();
            }
        };
        xhr.send();
        return data;
	}

	return {
		toServer: toServer
	}
})();

CONTROL.access = (function() {
    var CONTR = CONTROL,
        ajax = CONTR.ajax;

	function showContent() {
		var doc = document;
		doc.getElementsByClassName('main')[0].innerHTML = doc.getElementById('user-form').innerHTML;
	}

    //TODO отсылать логин и пароль не GETом
	function registration(user, password) {
		if (user && password) {
            ajax.toServer('http://localhost:1111/reg?login=' + user +'&password='+ password);
		}
	}

    function authorization(user, password) {
        if (user && password) {
            CONTROL.userData = ajax.toServer('http://localhost:1111/auth?login=' + user +'&password='+ password, showContent);
            setTimeout(function() {
              //  CONTR.initialize.loadThirdTab(CONTROL.userData.categories);
                for (var i in CONTROL.userData) {
                    console.log(i+' '+CONTROL.userData[i]);
                }
            }, 1500);
        }
        return false;
    }

	return {
		registration: registration,
        authorization: authorization
	}
})();


