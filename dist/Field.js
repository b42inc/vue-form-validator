import Vue from 'vue';
import { Validator } from './Validator';
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
export class Errors {
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
export class FieldValue {
    constructor(name, initValue, validations) {
        this.value = '';
        this.valid = false;
        this.errors = {};
        this._validations = {};
        this.name = name;
        this.validations = validations;
        Vue.set(this, 'value', initValue);
        Vue.set(this, 'errors', {});
        Vue.set(this, 'valid', false);
    }
    resetError() {
        this.errors = {};
    }
    hasError() {
        const { errors } = this;
        return errors && !!Object.keys(errors).length;
    }
    set validations(validations) {
        const _validations = {};
        for (const eventName in validations) {
            const code = validations[eventName];
            _validations[eventName] = typeof code === 'string' ? [code] : code;
        }
        this._validations = _validations;
    }
    get validations() {
        return this._validations;
    }
    eachValidation(el, eventName, callback) {
        const validations = this.validations[eventName];
        if (!validations || !validations.length) {
            return;
        }
        for (let i = 0, len = validations.length, validCode, errors; i < len; i++) {
            validCode = validations[i];
            errors = Validator.check(validCode, el);
            if (errors && errors.length) {
                errors.forEach(error => error && callback(error.msg, error.rule));
            }
        }
    }
}
export class Field {
    constructor(el, vnode, value, options = {}) {
        this._preventResolve = false;
        this._preventReject = false;
        const { name, type } = el;
        this._$el = el;
        this._name = name;
        this._type = type || '';
        this._vnode = vnode;
        this._value = value;
        this._preventInvalid = options.preventInvalid || false;
        this._errors = new Errors();
        this._validEvent = options.validEvent || ['input', 'change'];
        this._onValidate = this._onValidate.bind(this);
        this._onInvalid = this._onInvalid.bind(this);
        this._on();
    }
    preventResolve(dynamicErrorMessage) {
        this._errorMessage = dynamicErrorMessage;
        this._preventResolve = true;
    }
    preventReject() {
        this._preventReject = true;
    }
    updateEvent(events) {
        this._off();
        this._validEvent = events;
        this._on();
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
    _on() {
        const { _$el, _validEvent } = this;
        _validEvent.forEach(eventName => {
            _$el.addEventListener(eventName, this._onValidate);
        });
        _$el.addEventListener('invalid', this._onInvalid, {
            passive: false
        });
    }
    _off() {
        const { _$el, _validEvent } = this;
        _validEvent.forEach(eventName => {
            _$el.removeEventListener(eventName, this._onValidate);
        });
        _$el.removeEventListener('invalid', this._onInvalid);
    }
    _onValidate(e) {
        const { _vnode, _value } = this;
        const { type } = e;
        const arg = { event: e, filed: this, errors: null };
        this._prepareValidate();
        emit(_vnode, `validate:${type}`, arg);
        emit(_vnode, 'validate', arg);
        if (this._check(type)) {
            emit(_vnode, `confirm:${type}`, arg);
            emit(_vnode, 'confirm', arg);
            if (!this._preventResolve) {
                _value.value = this.value;
                _value.valid = true;
                emit(_vnode, 'resolve', arg);
                return;
            }
        }
        const errors = this.errors;
        arg.errors = errors;
        emit(_vnode, 'reject', arg);
        if (!this._preventReject) {
            _value.errors = errors;
            _value.valid = false;
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
    _check(eventName) {
        const { _$el, _value } = this;
        let customError = '';
        if (this.noValidate || !_$el.willValidate) {
            return true;
        }
        if (!_$el.checkValidity()) {
            return false;
        }
        _value.eachValidation(_$el, eventName, (error, attribute) => {
            if (error) {
                if (!customError) {
                    customError = error;
                }
                this._errors.add(attribute, error);
            }
        });
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
    set _errorMessage(error) {
        this._$el.setCustomValidity(error);
    }
    get _errorMessage() {
        return this._$el.validationMessage;
    }
}
