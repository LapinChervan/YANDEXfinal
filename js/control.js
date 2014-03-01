var CONTROL = {};

CONTROL.initialize = (function() {

	var events = {};

	if (typeof window.addEventListener === 'function') {
		events.addListener = function(elem, type, handler) {
			elem.addEventListener(type, handler, false);
		};

		events.removeListener = function(elem, type, handler) {
			elem.removeEventListener(type, handler, false);
		};
	} else if (typeof document.attachEvent === 'function') {
		events.addListener = function(elem, type, handler) {
			elem.attachEvent('on' + type, handler);
		}

		events.removeListener = function(elem, type, handler) {
			elem.detachEvent('on' + type, handler);
		}
	} else {
		events.addListener = function(elem, type, handler) {
			elem['on' + type] = handler;
		}

		events.removeListener = function(elem, type, handler) {
			elem['on' + type] = null;
		}
	}

	return events;

})();

CONTROL.animate = (function() {

})();

CONTROL.dom = (function() {

})();

CONTROL.user = (function() {
  
})();