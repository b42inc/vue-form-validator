"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
class FieldValue {
    constructor(name, initValue, validations) {
        this.name = name;
        this._vm = new vue_1.default({
            data: {
                value: initValue,
                valid: false,
                errors: {},
                validations: {}
            }
        });
        this.validations = validations;
    }
    resetError() {
        if (this.hasError()) {
            this.errors = {};
        }
    }
    hasError() {
        return !!Object.keys(this.errors).length;
    }
    hasEvent(eventName) {
        return !!this.validations[eventName];
    }
    watch(expOrFn, callback, options) {
        return this._vm.$watch(expOrFn, callback, options);
    }
    set value(value) {
        this._vm.value = value;
    }
    get value() {
        return this._vm.value;
    }
    set valid(value) {
        this._vm.valid = value;
    }
    get valid() {
        return this._vm.valid;
    }
    set errors(errors) {
        this._vm.errors = errors;
    }
    get errors() {
        return this._vm.errors;
    }
    set validations(validations) {
        const _validations = {};
        for (const eventName in validations) {
            const code = validations[eventName];
            _validations[eventName] = code ? (typeof code === 'string' ? [code] : code) : [];
        }
        if (_validations.init) {
            _validations.init = Array.from(new Set(Object.values(_validations).flat(1)));
        }
        this._vm.validations = _validations;
    }
    get validations() {
        return this._vm.validations;
    }
}
exports.FieldValue = FieldValue;
