CONTROL.Layer = function (options) {
    this.allLayers = [];
};

CONTROL.Layer.prototype.getDefaultOptions = function () {
    return {
        parent: document.body,
        clsOpacityLayer: undefined,
        clsContentLayer: undefined,
        content: undefined
    }
};
