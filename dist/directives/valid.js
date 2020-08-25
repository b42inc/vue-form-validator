"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Field_1 = require("../Field");
function createEvent(type) {
    try {
        return new Event(type);
    }
    catch (_e) {
        var event_1 = document.createEvent('Event');
        event_1.initEvent(type, true, true);
        return event_1;
    }
}
function getDirective(vnode, directiveName) {
    if (!vnode.data || !vnode.data.directives) {
        return;
    }
    return vnode.data.directives.find(function (directive) { return directive.name === directiveName; });
}
exports.default = (function (Vue) {
    var map = new WeakMap();
    Vue.directive('valid', {
        inserted: function (el, binding, vnode) {
            var prevent = binding.modifiers.prevent;
            var value = binding.value;
            var field = new Field_1.Field(el, vnode, value, {
                preventInvalid: !!prevent
            });
            if (value.hasEvent('init')) {
                el.dispatchEvent(createEvent('init'));
            }
            map.set(el, field);
        },
        componentUpdated: function (el, binding, vnode, oldVnode) {
            var current = getDirective(vnode, 'valid');
            var old = getDirective(oldVnode, 'valid');
            if (current && old && current.value !== old.value) {
                var field = map.get(el);
                var value = binding.value;
                field.update(vnode, value);
                if (value.hasEvent('init')) {
                    el.dispatchEvent(createEvent('init'));
                }
            }
        },
        unbind: function (el) {
            var field = map.get(el);
            if (field) {
                field.dispose();
                map.delete(el);
            }
        }
    });
});
