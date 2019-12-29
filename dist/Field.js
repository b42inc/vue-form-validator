"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("./Validator");
const DEFAULT_VALID_EVENTS = ['input', 'change'];
function getNativeAttribute($el) {
    const { valueMissing, typeMismatch, patternMismatch, tooLong, tooShort, stepMismatch, rangeOverflow, rangeUnderflow } = $el.validity;
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
    const handlers = vnode.data && vnode.data.on;
    if (handlers && handlers.hasOwnProperty(name)) {
        const handler = handlers[name];
        Array.isArray(handler) ?
            handler.forEach(fn => fn(data)) :
            handler(data);
    }
}
class FieldErrors {
    constructor() {
        this._list = {};
    }
    add(attr, error) {
        attr = attr.trim();
        error = error.trim();
        if (attr && error) {
            this._list[attr] = error;
        }
    }
    reset() {
        for (const attr in this._list) {
            delete this._list[attr];
        }
    }
    dispose() {
        delete this._list;
    }
    get list() {
        return { ...this._list };
    }
}
class Field {
    constructor(el, vnode, value, options = {}) {
        this._preventResolve = false;
        this._preventReject = false;
        this._validEvent = [];
        this._valids = {};
        this._unwatches = [];
        const { name, type } = el;
        el.value = value.value;
        this._$el = el;
        this._value = value;
        this._name = name;
        this._type = type || '';
        this._vnode = vnode;
        this._preventInvalid = options.preventInvalid || false;
        this._errors = new FieldErrors();
        this._onValidate = this._onValidate.bind(this);
        this._onInvalid = this._onInvalid.bind(this);
        this._initEvent();
    }
    preventResolve(dynamicErrorMessage) {
        if (dynamicErrorMessage) {
            this._errors.add('prevent-resolve', dynamicErrorMessage);
            this._errorMessage = dynamicErrorMessage;
        }
        this._preventResolve = true;
    }
    preventReject() {
        this._preventReject = true;
    }
    update(vnode, value) {
        this._$el.value = value.value;
        this._value = value;
        this._vnode = vnode;
        this._initEvent();
    }
    dispose() {
        this._off();
        this._errors.dispose();
        delete this._$el;
        delete this._name;
        delete this._type;
        delete this._vnode;
        delete this._value;
        delete this._preventInvalid;
        delete this._errors;
        delete this._validEvent;
        delete this._onValidate;
        delete this._onInvalid;
    }
    get errors() {
        const nativeError = this._errorMessage;
        const errors = this._errors;
        if (nativeError && !this._$el.validity.customError) {
            const attribute = getNativeAttribute(this._$el);
            if (attribute) {
                errors.add(attribute, nativeError);
            }
        }
        return errors.list;
    }
    get noValidate() {
        const { _$el } = this;
        const noValidateInline = _$el.getAttribute('novalidate');
        const noValidate = typeof noValidateInline === 'string' && noValidateInline !== 'false';
        if (!_$el.form) {
            return noValidate;
        }
        return _$el.form.noValidate || noValidate;
    }
    get name() {
        return this._name;
    }
    get value() {
        return this._$el.value;
    }
    set value(value) {
        this._$el.value = value;
    }
    _initEvent() {
        const { _validEvent } = this;
        const validEvents = ((validations) => {
            const validEvents = Object.keys(validations);
            return validEvents.length ? validEvents : DEFAULT_VALID_EVENTS;
        })(this._value.validations);
        if (_validEvent.length === validEvents.length && _validEvent.every(eventName => validEvents.includes(eventName))) {
            return;
        }
        this._off();
        this._validEvent = validEvents;
        this._valids = validEvents.reduce((valids, eventName) => {
            valids[eventName] = false;
            return valids;
        }, {});
        this._on();
    }
    _on() {
        const { _$el, _validEvent, _value } = this;
        this._unwatches = [
            _value.watch('value', (newVal) => {
                if (_$el.value !== newVal) {
                    _$el.value = newVal;
                }
            }),
            _value.watch('validations', () => this._initEvent())
        ];
        _validEvent.forEach(eventName => {
            _$el.addEventListener(eventName, this._onValidate);
        });
        _$el.addEventListener('invalid', this._onInvalid, {
            passive: false
        });
    }
    _off() {
        const { _$el, _validEvent } = this;
        this._unwatches.forEach(unwatch => unwatch());
        _validEvent.forEach(eventName => {
            _$el.removeEventListener(eventName, this._onValidate);
        });
        _$el.removeEventListener('invalid', this._onInvalid);
    }
    _onValidate(e) {
        const { _vnode, _value } = this;
        const { type: eventName } = e;
        const arg = { event: e, field: this, errors: null };
        this._prepareValidate();
        emit(_vnode, `validate:${eventName}`, arg);
        emit(_vnode, 'validate', arg);
        if (this._checkValidity(eventName)) {
            emit(_vnode, `confirm:${eventName}`, arg);
            emit(_vnode, 'confirm', arg);
            if (!this._preventResolve) {
                _value.value = this.value;
                this._updateValid(eventName, true);
                emit(_vnode, 'resolve', arg);
                return;
            }
        }
        const errors = this.errors;
        arg.errors = errors;
        emit(_vnode, 'reject', arg);
        if (!this._preventReject) {
            _value.errors = errors;
            this._updateValid(eventName, false);
            this._reportValidity();
        }
    }
    _prepareValidate() {
        this._errorMessage = '';
        this._errors.reset();
        this._value.resetError();
        this._preventResolve = false;
        this._preventReject = false;
    }
    _checkValidity(eventName) {
        const { _$el } = this;
        return (this.noValidate ||
            !_$el.willValidate ||
            (_$el.checkValidity() && this._checkCustomValidityByEvent(eventName)));
    }
    _checkCustomValidityByEvent(eventName) {
        const { _$el, _value } = this;
        const validations = _value.validations[eventName];
        let customError = '';
        if (validations && validations.length) {
            const errors = [];
            for (let i = 0, len = validations.length, errs; i < len; i++) {
                errs = Validator_1.Validator.check(validations[i], _$el);
                if (errs.length) {
                    errors.push(...errs);
                }
            }
            for (let i = 0, len = errors.length, err; i < len; i++) {
                err = errors[i];
                if (!err || !err.msg) {
                    continue;
                }
                if (!customError) {
                    customError = err.msg;
                }
                this._errors.add(err.rule, err.msg);
            }
        }
        this._errorMessage = customError;
        return !customError;
    }
    _reportValidity() {
        const { _$el } = this;
        if (this._preventInvalid) {
            return;
        }
        if (typeof _$el.reportValidity === 'function') {
            _$el.reportValidity();
        }
        else {
            const $form = _$el.form;
            if (!$form) {
                return;
            }
            const siblings = Array.from($form.elements).filter(($field) => {
                return $field &&
                    $field !== _$el &&
                    !!$field.checkValidity &&
                    !$field.disabled;
            });
            siblings.forEach((input) => (input.disabled = true));
            $form.reportValidity();
            siblings.forEach((input) => (input.disabled = false));
            _$el.focus();
            if (_$el.hasOwnProperty('selectionStart')) {
                _$el.selectionStart = 0;
            }
        }
    }
    _onInvalid(e) {
        if (this.noValidate || this._preventInvalid) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }
        return true;
    }
    _updateValid(eventName, isValid) {
        const { _valids, _value } = this;
        if (eventName === 'init') {
            if (isValid) {
                for (const ev in _valids) {
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
        _value.valid = isValid && Object.values(_valids).every(bool => bool);
    }
    set _errorMessage(error) {
        this._$el.setCustomValidity(error);
    }
    get _errorMessage() {
        return this._$el.validationMessage;
    }
}
exports.Field = Field;
