'use strict'

var CONTROL = {};

CONTROL.ajax = (function() {
	function toServer(link) {
		var data;
		var xhr = new XMLHttpRequest();
    
        xhr.open('GET', link); 
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return false; 

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
	var ACCOUNT = 'account:';

	function showContent() {
		var doc = document;
		doc.body.innerHTML = doc.getElementById('user-form').innerHTML; 
	}

	function registration(user, password) {
		var ajax = CONTROL.ajax;
		if (user && password) {
			ajax.toServer('http://localhost:1111/');
		}
	}
	/*
	function cacheLocal(user, userData) {
		if (!localStorage[ACCOUNT + user] && user) {
			//here write userData on server
			userData.password = undefined;
			localStorage[ACCOUNT + user] = JSON.stringify(userData);
			return true;
		}
		return false;
	}

	function registration(user, password) {
		if (user && password) {
			var newUser = new CONTROL.User(user, password);
			alert(cacheLocal(user, newUser));
		}
	}

	function auth(user, password) {
		if (localStorage[ACCOUNT + user]) {
			var userData;
			showContent();
			return userData = JSON.parse(localStorage[ACCOUNT + user]);
		}
		return false;
	}
	*/
	return {
		registration: registration
		//auth: auth
	}
})();

