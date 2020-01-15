"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const vm = new vue_1.default();
class FieldValue {
    constructor(name, initValue, validations) {
        this.name = name;
        vue_1.default.set(this, 'value', initValue);
        vue_1.default.set(this, 'valid', false);
        vue_1.default.set(this, 'errors', {});
        vue_1.default.set(this, 'validations', {});
        this.setValidations(validations);
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
        return !!this.getValidation(eventName);
    }
    watch(exp, callback, options) {
        return vm.$watch(() => (this[exp]), callback, options);
    }
    setValidations(validations) {
        const _validations = {};
        if (Array.isArray(validations)) {
            validations.forEach(eventName => _validations[eventName] = []);
        }
        else {
            for (const eventName in validations) {
                const code = validations[eventName];
                _validations[eventName] = code ? (typeof code === 'string' ? [code] : code) : [];
            }
        }
        if (_validations.init) {
            _validations.init = Array.from(new Set(Object.values(_validations).flat(1)));
        }
        this.validations = _validations;
    }
    getValidations() {
        return this.validations;
    }
    getValidation(eventName) {
        return this.validations[eventName];
    }
}
exports.FieldValue = FieldValue;
