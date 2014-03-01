//addEventListener
(function() {
    if (!Event.prototype.preventDefault) {
        Event.prototype.preventDefault=function() {
            this.returnValue=false;
        };
    }
    if (!Event.prototype.stopPropagation) {
        Event.prototype.stopPropagation=function() {
            this.cancelBubble=true;
        };
    }
    if (!Element.prototype.addEventListener) {
        var eventListeners=[];

        var addEventListener=function(type,listener) {
            var self=this;
            var wrapper=function(e) {
                e.target=e.srcElement;
                e.currentTarget=self;
                if (listener.handleEvent) {
                    listener.handleEvent(e);
                } else {
                    listener.call(self,e);
                }
            };
            if (type=="DOMContentLoaded") {
                var wrapper2=function(e) {
                    if (document.readyState=="complete") {
                        wrapper(e);
                    }
                };
                document.attachEvent("onreadystatechange",wrapper2);
                eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});

                if (document.readyState=="complete") {
                    var e=new Event();
                    e.srcElement=window;
                    wrapper2(e);
                }
            } else {
                this.attachEvent("on"+type,wrapper);
                eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
            }
        };
        var removeEventListener=function(type,listener) {
            var counter=0;
            while (counter<eventListeners.length) {
                var eventListener=eventListeners[counter];
                if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
                    if (type=="DOMContentLoaded") {
                        this.detachEvent("onreadystatechange",eventListener.wrapper);
                    } else {
                        this.detachEvent("on"+type,eventListener.wrapper);
                    }
                    break;
                }
                ++counter;
            }
        };
        Element.prototype.addEventListener=addEventListener;
        Element.prototype.removeEventListener=removeEventListener;
        if (HTMLDocument) {
            HTMLDocument.prototype.addEventListener=addEventListener;
            HTMLDocument.prototype.removeEventListener=removeEventListener;
        }
        if (Window) {
            Window.prototype.addEventListener=addEventListener;
            Window.prototype.removeEventListener=removeEventListener;
        }
    }
})();

//getElementsByClassName
(function() {
    if (!document.getElementsByClassName) {
        var indexOf = [].indexOf || function(prop) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === prop) return i;
            }
            return -1;
        };
        getElementsByClassName = function(className,context) {
            var elems = document.querySelectorAll ? context.querySelectorAll("." + className) : (function() {
                var all = context.getElementsByTagName("*"),
                    elements = [],
                    i = 0;
                for (; i < all.length; i++) {
                    if (all[i].className && (" " + all[i].className + " ").indexOf(" " + className + " ") > -1 && indexOf.call(elements,all[i]) === -1) elements.push(all[i]);
                }
                return elements;
            })();
            return elems;
        };
        HTMLDocument.prototype.getElementsByClassName = function(className) {
            return getElementsByClassName(className,document);
        };
        Element.prototype.getElementsByClassName = function(className) {
            return getElementsByClassName(className,this);
        };
    }
})();