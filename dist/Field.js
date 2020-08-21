"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator_1 = require("./Validator");
var DEFAULT_VALID_EVENTS = ['input', 'change'];
function getNativeAttribute($el) {
    var _a = $el.validity, valueMissing = _a.valueMissing, typeMismatch = _a.typeMismatch, patternMismatch = _a.patternMismatch, tooLong = _a.tooLong, tooShort = _a.tooShort, stepMismatch = _a.stepMismatch, rangeOverflow = _a.rangeOverflow, rangeUnderflow = _a.rangeUnderflow;
    if (valueMissing)
        return 'required';
    if (typeMismatch)
        return $el.type;
    if (patternMismatch)
        return 'pattern';
    if (tooLong)
        return 'max';
    if (tooShort)
        return 'min';
    if (stepMismatch)
        return 'step';
    if (rangeOverflow)
        return 'maxlength';
    if (rangeUnderflow)
        return 'minlength';
    return '';
}
function emit(vnode, name, data) {
    var handlers = vnode.data && vnode.data.on;
    if (handlers && handlers.hasOwnProperty(name)) {
        var handler = handlers[name];
        Array.isArray(handler) ?
            handler.forEach(function (fn) { return fn(data); }) :
            handler(data);
    }
}
var Field = (function () {
    function Field(el, vnode, value, options) {
        if (options === void 0) { options = {}; }
        this._preventResolve = false;
        this._preventReject = false;
        this._validEvent = [];
        this._valids = {};
        this._unwatches = [];
        this._tempErrors = {};
        var name = el.name, type = el.type;
        el.value = value.value;
        this._$el = el;
        this._value = value;
        this._name = name;
        this._type = type || '';
        this._vnode = vnode;
        this._preventInvalid = options.preventInvalid || false;
        this._onValidate = this._onValidate.bind(this);
        this._onInvalid = this._onInvalid.bind(this);
        this._initEvent();
    }
    Field.prototype.preventResolve = function (dynamicErrorMessage) {
        if (dynamicErrorMessage) {
            this._tempErrors['prevent-resolve'] = dynamicErrorMessage;
        }
        this._preventResolve = true;
    };
    Field.prototype.preventReject = function () {
        this._preventReject = true;
    };
    Field.prototype.update = function (vnode, value) {
        this._$el.value = value.value;
        this._value = value;
        this._vnode = vnode;
        this._initEvent();
    };
    Field.prototype.dispose = function () {
        this._off();
        delete this._$el;
        delete this._name;
        delete this._type;
        delete this._vnode;
        delete this._value;
        delete this._preventInvalid;
        delete this._tempErrors;
        delete this._validEvent;
        delete this._onValidate;
        delete this._onInvalid;
    };
    Object.defineProperty(Field.prototype, "noValidate", {
        get: function () {
            var _$el = this._$el;
            var noValidateInline = _$el.getAttribute('novalidate');
            var noValidate = typeof noValidateInline === 'string' && noValidateInline !== 'false';
            if (!_$el.form) {
                return noValidate;
            }
            return _$el.form.noValidate || noValidate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Field.prototype, "value", {
        get: function () {
            return this._$el.value;
        },
        set: function (value) {
            this._$el.value = value;
        },
        enumerable: true,
        configurable: true
    });
    Field.prototype._initEvent = function () {
        var _validEvent = this._validEvent;
        var validEvents = (function (validations) {
            var validEvents = Object.keys(validations);
            return validEvents.length ? validEvents : DEFAULT_VALID_EVENTS;
        })(this._value.getValidations());
        if (_validEvent.length === validEvents.length && _validEvent.every(function (eventName) { return validEvents.includes(eventName); })) {
            return;
        }
        this._off();
        this._validEvent = validEvents;
        this._valids = validEvents.reduce(function (valids, eventName) {
            valids[eventName] = false;
            return valids;
        }, {});
        this._on();
    };
    Field.prototype._on = function () {
        var _this = this;
        var _a = this, _$el = _a._$el, _validEvent = _a._validEvent, _value = _a._value;
        this._unwatches = [
            _value.watch('value', function (newVal) {
                if (_$el.value !== newVal) {
                    _$el.value = newVal;
                }
            }),
            _value.watch('validations', function () { return _this._initEvent(); })
        ];
        _validEvent.forEach(function (eventName) {
            _$el.addEventListener(eventName, _this._onValidate);
        });
        _$el.addEventListener('invalid', this._onInvalid, {
            passive: false
        });
    };
    Field.prototype._off = function () {
        var _this = this;
        var _a = this, _$el = _a._$el, _validEvent = _a._validEvent;
        this._unwatches.forEach(function (unwatch) { return unwatch(); });
        _validEvent.forEach(function (eventName) {
            _$el.removeEventListener(eventName, _this._onValidate);
        });
        _$el.removeEventListener('invalid', this._onInvalid);
    };
    Field.prototype._onValidate = function (e) {
        this._prepareValidate();
        var _a = this, _vnode = _a._vnode, _value = _a._value, _tempErrors = _a._tempErrors;
        var eventName = e.type;
        var arg = { event: e, field: this, errors: _tempErrors };
        emit(_vnode, "validate:" + eventName, arg);
        emit(_vnode, 'validate', arg);
        if (this._checkValidity(eventName)) {
            emit(_vnode, "confirm:" + eventName, arg);
            emit(_vnode, 'confirm', arg);
            if (!this._preventResolve) {
                _value.value = this.value;
                this._updateValid(eventName, true);
                emit(_vnode, 'resolve', arg);
                return;
            }
        }
        emit(_vnode, 'reject', arg);
        if (!this._preventReject) {
            this._errorMessage = _tempErrors[Object.keys(_tempErrors)[0]];
            _value.errors = _tempErrors;
            this._updateValid(eventName, false);
            this._reportValidity();
        }
    };
    Field.prototype._prepareValidate = function () {
        this._errorMessage = '';
        this._tempErrors = {};
        this._value.resetError();
        this._preventResolve = false;
        this._preventReject = false;
    };
    Field.prototype._checkValidity = function (eventName) {
        var _a = this, _$el = _a._$el, _value = _a._value, _tempErrors = _a._tempErrors;
        var validations = _value.getValidation(eventName);
        if (this.noValidate || !_$el.willValidate) {
            return true;
        }
        if (!_$el.checkValidity()) {
            var nativeError = this._errorMessage;
            if (nativeError && !_$el.validity.customError) {
                var attribute = getNativeAttribute(_$el);
                if (attribute) {
                    _tempErrors[attribute] = nativeError;
                }
            }
        }
        if (validations && validations.length) {
            for (var i = 0, len = validations.length; i < len; i++) {
                Object.assign(_tempErrors, Validator_1.Validator.check(validations[i], _$el));
            }
        }
        return !Object.keys(_tempErrors).length;
    };
    Field.prototype._reportValidity = function () {
        var _$el = this._$el;
        if (this._preventInvalid) {
            return;
        }
        if (typeof _$el.reportValidity === 'function') {
            _$el.reportValidity();
        }
        else {
            var $form = _$el.form;
            if (!$form) {
                return;
            }
            var siblings = Array.from($form.elements).filter(function ($field) {
                return $field &&
                    $field !== _$el &&
                    !!$field.checkValidity &&
                    !$field.disabled;
            });
            siblings.forEach(function (input) { return (input.disabled = true); });
            $form.reportValidity();
            siblings.forEach(function (input) { return (input.disabled = false); });
            _$el.focus();
            if (_$el.hasOwnProperty('selectionStart')) {
                _$el.selectionStart = 0;
            }
        }
    };
    Field.prototype._onInvalid = function (e) {
        if (this.noValidate || this._preventInvalid) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }
        return true;
    };
    Field.prototype._updateValid = function (eventName, isValid) {
        var _a = this, _valids = _a._valids, _value = _a._value;
        if (eventName === 'init') {
            if (isValid) {
                for (var ev in _valids) {
                    _valids[ev] = true;
                }
            }
            else {
                _valids.init = true;
            }
            _value.valid = isValid;
            return;
        }
        _valids[eventName] = isValid;
        _value.valid = isValid && Object.values(_valids).every(function (bool) { return bool; });
    };
    Object.defineProperty(Field.prototype, "_errorMessage", {
        get: function () {
            return this._$el.validationMessage;
        },
        set: function (error) {
            this._$el.setCustomValidity(error);
        },
        enumerable: true,
        configurable: true
    });
    return Field;
}());
exports.Field = Field;
