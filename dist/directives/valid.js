"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const Field_1 = require("../Field");
const map = new WeakMap();
vue_1.default.directive('valid', {
    bind(el, binding, vnode) {
        const { prevent } = binding.modifiers;
        const value = binding.value;
        const filed = new Field_1.Field(el, vnode, value, {
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
