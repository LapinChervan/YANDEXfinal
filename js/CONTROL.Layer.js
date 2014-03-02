CONTROL.Layer = function (options) {
    this.allLayers.push(this.CreateLayer);
};

CONTROL.Layer.prototype.allLayers = [];

CONTROL.Layer.prototype.getDefaultOptions = function () {
    return {
        parent: document.body,
        clsOpacityLayer: undefined,
        clsContentLayer: undefined,
        content: undefined
    }
};

CONTROL.Layer.prototype.setOptions = function (options) {
    this.options = this.getDefaultOptions();
    Object.keys(options).forEach(function (key) {
        this.options[key] = options[key];
    });
};

CONTROL.Layer.prototype.CreateLayer = function (options) {
    var modal = document.createElement('div'),
        layer = document.createElement('div'),
        optionsObject = this.options;
    this.setOptions(options);
    modal.className = optionsObject.clsOpacityLayer;
    layer.className = optionsObject.clsContentLayer;
    layer.innerHTML = optionsObject.content;
    modal.innerHTML = layer;
    layer.addEventListener('click',this.stopEvent);
    optionsObject.parent.appendChild(modal);
    return {
        modal: modal,
        parent: optionsObject.parent
    };
};

CONTROL.Layer.prototype.stopEvent = function () {
    var event = event || window.event;
    event.stopPropagation();
};

CONTROL.Layer.prototype.destroyLayer = function () {
    this.allLayers.forEach(function (layerObject) {
        layerObject.parent.removeChild(layerObject.modal);
        layerObject = null;
    });
};

(function () {
    window.addEventListener('click',function () {
        CONTROL.Layer.destroyLayer();
    });
})();
