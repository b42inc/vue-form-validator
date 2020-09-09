"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldValue = void 0;
var vue_1 = __importDefault(require("vue"));
var vm = new vue_1.default();
var FieldValue = (function () {
    function FieldValue(name, initValue, validations) {
        this.name = name;
        vue_1.default.set(this, 'value', initValue);
        vue_1.default.set(this, 'valid', false);
        vue_1.default.set(this, 'errors', {});
        vue_1.default.set(this, 'validations', {});
        this.setValidations(validations);
    }
    FieldValue.prototype.resetError = function () {
        if (this.hasError()) {
            this.errors = {};
        }
    };
    FieldValue.prototype.hasError = function () {
        return !!Object.keys(this.errors).length;
    };
    FieldValue.prototype.hasEvent = function (eventName) {
        return !!this.getValidation(eventName);
    };
    FieldValue.prototype.watch = function (exp, callback, options) {
        var _this = this;
        return vm.$watch(function () { return (_this[exp]); }, callback, options);
    };
    FieldValue.prototype.setValidations = function (validations) {
        var _validations = {};
        if (Array.isArray(validations)) {
            validations.forEach(function (eventName) { return _validations[eventName] = []; });
        }
        else {
            for (var eventName in validations) {
                var code = validations[eventName];
                _validations[eventName] = code ? (typeof code === 'string' ? [code] : code) : [];
            }
        }
        if (_validations.init) {
            _validations.init = Array.from(new Set(Object.values(_validations).flat(1)));
        }
        this.validations = _validations;
    };
    FieldValue.prototype.getValidations = function () {
        return this.validations;
    };
    FieldValue.prototype.getValidation = function (eventName) {
        return this.validations[eventName];
    };
    return FieldValue;
}());
exports.FieldValue = FieldValue;
