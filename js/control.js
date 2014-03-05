'use strict'

var CONTROL = {};

CONTROL.ajax = (function() {
	function toServer(link, callback) {
		var xhr = new XMLHttpRequest(),
			data;
    
        xhr.open('GET', link); 
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return; 
         	data = xhr.responseText;
            if (typeof callback === 'function' && data === '1') {
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
	function showContent() {
		var doc = document;
		doc.body.innerHTML = doc.getElementById('user-form').innerHTML; 
	}

    //TODO отсылать логин и пароль не GETом
	function registration(user, password) {
		if (user && password) {
			CONTROL.ajax.toServer('http://localhost:1111/reg?login=' + user +'&password='+ password);
		}
	}

    function authorization(user, password) {
        if (user && password) {
            CONTROL.ajax.toServer('http://localhost:1111/auth?login=' + user +'&password='+ password, showContent);
        }
    }

	return {
		registration: registration,
        authorization: authorization
	}
})();

