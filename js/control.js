'use strict'

var CONTROL = {};

CONTROL.ajax = (function() {
	function toServer(link) {
		var xhr = new XMLHttpRequest(),
			data;
    
        xhr.open('GET', link); 
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return; 
         	data = xhr.responseText; 
        }
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

	function registration(user, password) {
		if (user && password) {
			CONTROL.ajax.toServer('http://localhost:1111/reg?login=' + user +'&password='+ password);
		}
	}

	return {
		registration: registration
	}
})();

