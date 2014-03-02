// new CONTROL.Layer(options), options = object with options

CONTROL.Layer = function (options) {
    this.allLayers.push(this.createLayer(options));
};

CONTROL.Layer.prototype.allLayers = [];

CONTROL.Layer.prototype.getDefaultOptions = function () {
    return {
    parent: document.body,
    clsOpacityLayer: 'modal',
    clsContentLayer: 'layer',
    content: undefined
    }
};
CONTROL.Layer.prototype.setOptions = function (options) {
    var optionsObject;
    this.options = this.getDefaultOptions();
    optionsObject = this.options;
    Object.keys(options).forEach(function (key) {
        optionsObject[key] = options[key];
    });
};
CONTROL.Layer.prototype.createLayer = function (options) {
    var modal = document.createElement('div'),
        layer = document.createElement('div'),
        optionsObject;
    this.setOptions(options);
    optionsObject = this.options;
    modal.className = optionsObject.clsOpacityLayer;
    layer.className = optionsObject.clsContentLayer;
    layer.innerHTML = optionsObject.content;
    optionsObject.parent.appendChild(modal);
    optionsObject.parent.appendChild(layer);
    layer.addEventListener('click',this.stopEvent);
    return {
        modal: modal,
        layer: layer,
        parent: optionsObject.parent
    };
};

CONTROL.Layer.prototype.stopEvent = function (e) {
    var event = e || window.event;
    event.stopPropagation();
};

CONTROL.Layer.prototype.destroyLayer = function () {
    var allLayers = this.allLayers;
    allLayers.forEach(function (layerObject, index) {
        if (layerObject != null) {
            layerObject.parent.removeChild(layerObject.modal);
            layerObject.parent.removeChild(layerObject.layer);
            allLayers[index] = null;
        }
    });
};

(function () {
    window.addEventListener('click',function () {
        CONTROL.Layer.prototype.destroyLayer();
    });
})();

