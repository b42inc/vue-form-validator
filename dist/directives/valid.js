import Vue from 'vue';
import { Field } from '../../@types';
const map = new WeakMap();
Vue.directive('valid', {
    bind(el, binding, vnode) {
        const { prevent } = binding.modifiers;
        const value = binding.value;
        const filed = new Field(el, vnode, value, {
            preventInvalid: !!prevent,
            validEvent: Object.keys(value.validations)
        });
        map.set(el, filed);
    },
    unbind(el) {
        const filed = map.get(el);
        if (filed) {
            filed.dispose();
            map.delete(el);
        }
    }
});
