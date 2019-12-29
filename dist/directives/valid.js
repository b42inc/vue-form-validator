"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Field_1 = require("../Field");
function createEvent(type) {
    try {
        return new Event(type);
    }
    catch (_e) {
        const event = document.createEvent('Event');
        event.initEvent(type, true, true);
        return event;
    }
}
function getDirective(vnode, directiveName) {
    if (!vnode.data || !vnode.data.directives) {
        return;
    }
    return vnode.data.directives.find(directive => directive.name === directiveName);
}
exports.default = (Vue) => {
    const map = new WeakMap();
    Vue.directive('valid', {
        inserted(el, binding, vnode) {
            const { prevent } = binding.modifiers;
            const value = binding.value;
            const field = new Field_1.Field(el, vnode, value, {
                preventInvalid: !!prevent
            });
            if (value.hasEvent('init')) {
                el.dispatchEvent(createEvent('init'));
            }
            map.set(el, field);
        },
        componentUpdated(el, binding, vnode, oldVnode) {
            const current = getDirective(vnode, 'valid');
            const old = getDirective(oldVnode, 'valid');
            if (current && old && current.value !== old.value) {
                const field = map.get(el);
                const value = binding.value;
                field.update(vnode, value);
                if (value.hasEvent('init')) {
                    el.dispatchEvent(createEvent('init'));
                }
            }
        },
        unbind(el) {
            const field = map.get(el);
            if (field) {
                field.dispose();
                map.delete(el);
            }
        }
    });
};
