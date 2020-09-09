import { VNode } from 'vue/types/umd'
import { HTMLFieldElement, FieldOptions } from '../@types'
import { FieldValue } from './FieldValue'
import { Validator } from './Validator'

const DEFAULT_VALID_EVENTS = ['input', 'change']

function getNativeAttribute($el:HTMLFieldElement):string {
    const {
        valueMissing,
        typeMismatch,
        patternMismatch,
        tooLong,
        tooShort,
        stepMismatch,
        rangeOverflow,
        rangeUnderflow
    } = $el.validity

    if (valueMissing) return 'required'    
    if (typeMismatch) return $el.type
    if (patternMismatch) return 'pattern'
    if (tooLong) return 'max'
    if (tooShort) return 'min'
    if (stepMismatch) return 'step'
    if (rangeOverflow) return 'maxlength'
    if (rangeUnderflow) return 'minlength'
    return ''
}

function emit(vnode:VNode, name:string, data:any) {
    const handlers = vnode.data && vnode.data.on

    if (handlers && handlers.hasOwnProperty(name)) {
      const handler = handlers[name]
      Array.isArray(handler) ?
        handler.forEach(fn => fn(data)) :
        handler(data)
    }
}

export class Field {
    private _$el: HTMLFieldElement | undefined
    private _vnode: VNode | undefined
    private _value:FieldValue | undefined
    private _preventInvalid: boolean
    private _name:string
    private _preventResolve:boolean = false
    private _preventReject:boolean = false
    private _validEvent:string[] = []
    private _valids:{[eventName:string]:boolean} = {}
    private _unwatches:Function[] = []
    private _tempErrors:{[key:string]:string} = {}

    constructor(el:HTMLFieldElement,
                vnode:VNode,
                value:FieldValue,
                options:FieldOptions = {}) {
        
        const { name } = el

        el.value = value.value

        this._$el = el
        this._value = value
        this._name = name
        this._vnode = vnode
        this._preventInvalid = options.preventInvalid || false
        this._onValidate = this._onValidate.bind(this)
        this._onInvalid = this._onInvalid.bind(this)
        this._initEvent()
    }

    //=============================================
    // PUBLIC METHODS
    //=============================================
    preventResolve(dynamicErrorMessage?:string) {
        if (dynamicErrorMessage) {
            this._tempErrors['prevent-resolve'] = dynamicErrorMessage
        }
        this._preventResolve = true
    }

    preventReject() {
        this._preventReject = true
    }

    update(vnode:VNode, value:FieldValue) {
        if (this._$el) {
            this._$el.value = value.value
        }

        this._value = value
        this._vnode = vnode
        this._initEvent()
    }

    dispose() {
        this._off()

        delete this._$el
        delete this._vnode
        delete this._value
        // delete this._onValidate
        // delete this._onInvalid
    }

    //=============================================
    // GETTER / SETTER
    //=============================================
    get noValidate():boolean {
        const { _$el } = this

        if (!_$el) {
            return true
        }

        const noValidateInline = _$el.getAttribute('novalidate')
        const noValidate = typeof noValidateInline === 'string' && noValidateInline !== 'false'

        if (!_$el.form) {
            return noValidate
        }

        return _$el.form.noValidate || noValidate
    }

    get name():string {
        return this._name
    }

    get value():string {
        return this._$el ? this._$el.value : ''
    }

    set value(value:string) {
        if (this._$el) {
            this._$el.value = value
        }
    }

    //=============================================
    // PRIVATE METHODS
    //=============================================

    private _initEvent() {
        const { _validEvent, _value } = this
        const validEvents = _value ? ((validations) => {
            const validEvents = Object.keys(validations)
            return validEvents.length ? validEvents : DEFAULT_VALID_EVENTS
        })(_value.getValidations()) : []

        if (_validEvent.length === validEvents.length && _validEvent.every(eventName => validEvents.includes(eventName))) {
            return
        }

        this._off()
        this._validEvent = validEvents
        this._valids = validEvents.reduce((valids, eventName) => {
            valids[eventName] = false
            return valids
        }, {} as {[eventName:string]:boolean})
        this._on()
    }

    private _on() {
        const { _$el, _validEvent, _value } = this

        if (!_$el || !_value) {
            return
        }

        this._unwatches = [
            _value.watch('value', (newVal) => {
                if (_$el.value !== newVal) {
                    _$el.value = newVal
                }
            }),
            _value.watch('validations', () => this._initEvent())
        ]

        _validEvent.forEach(eventName => {
            _$el.addEventListener(eventName, this._onValidate)
        })

        _$el.addEventListener('invalid', this._onInvalid, {
            // capture: true,
            passive: false
        })
    }

    private _off() {
        const { _$el, _validEvent } = this

        if (!_$el) {
            return
        }

        this._unwatches.forEach(unwatch => unwatch())

        _validEvent.forEach(eventName => {
            _$el.removeEventListener(eventName, this._onValidate)
        })

        _$el.removeEventListener('invalid', this._onInvalid)
    }

    private _onValidate(e:Event) {
        this._prepareValidate()

        const { _vnode, _value, _tempErrors } = this
        const { type: eventName } = e
        const arg = { event: e, field: this, errors: _tempErrors }

        if (!_vnode || !_value) {
            return
        }

        emit(_vnode, `validate:${eventName}`, arg)
        emit(_vnode, 'validate', arg)

        if (this._checkValidity(eventName)) {
            emit(_vnode, `confirm:${eventName}`, arg)
            emit(_vnode, 'confirm', arg)
            
            if (!this._preventResolve) {
                // validateとconfirmイベント内で動的にvalueを変えることも可能
                _value.value = this.value
                this._updateValid(eventName, true)
                emit(_vnode, 'resolve', arg)
                return
            }
        }

        emit(_vnode, 'reject', arg)

        if (!this._preventReject) {
            this._errorMessage = _tempErrors[Object.keys(_tempErrors)[0]]
            _value.errors = _tempErrors
            this._updateValid(eventName, false)
            this._reportValidity()
        }
    }

    private _prepareValidate() {
        this._errorMessage = ''
        this._tempErrors = {}
        this._value && this._value.resetError()
        this._preventResolve = false
        this._preventReject = false
    }

    private _checkValidity(eventName:string):boolean {
        const { _$el, _value, _tempErrors } = this

        if (!_value || !_$el) {
            return true
        }

        const validations = _value.getValidation(eventName)

        if (this.noValidate || !_$el.willValidate) {
            return true
        }

        if (!_$el.checkValidity()) {
            const nativeError = this._errorMessage

            if (nativeError && !_$el.validity.customError) {
                const attribute = getNativeAttribute(_$el)
                if (attribute) {
                    _tempErrors[attribute] = nativeError
                }
            }
        }
        
        if (validations && validations.length) {
            for (let i = 0, len = validations.length; i < len; i++) {
                Object.assign(_tempErrors, Validator.check(validations[i], _$el))
            }
        }

        return !Object.keys(_tempErrors).length
    }

    /**
     * ネイティブのフォームエラーを表示する
     */
    private _reportValidity() {
        const { _$el } = this

        if (this._preventInvalid || !_$el) {
            return
        }

        // ネイティブ検証の時点で引っかかったらその時点で終わり
        // ここで invalid イベントが発火させる
        if (typeof _$el.reportValidity === 'function') {
            _$el.reportValidity()
        } else {
            const $form = _$el.form

            if (!$form) {
                return
            }

            const siblings = Array.from($form.elements).filter(($field:Element) => {
                return $field &&
                       $field !== _$el &&
                       !!($field as HTMLFieldElement).checkValidity &&
                       !($field as HTMLFieldElement).disabled
            });
            siblings.forEach((input:Element) => ((input as HTMLFieldElement).disabled = true))
            $form.reportValidity()
            siblings.forEach((input:Element) => ((input as HTMLFieldElement).disabled = false))
            _$el.focus()

            if (_$el.hasOwnProperty('selectionStart')) {
                (_$el as HTMLInputElement | HTMLTextAreaElement).selectionStart = 0
            }
        }
    }

    private _onInvalid(e:Event) {
        if (this.noValidate || this._preventInvalid) {
            e.preventDefault()
            e.stopImmediatePropagation()
            return false
        }

        return true
    }

    private _updateValid(eventName:string, isValid:boolean) {
        const { _valids, _value } = this

        if (!_value) {
            return
        }

        if (eventName === 'init') {
            if (isValid) {
                // initがvalid === すべての条件をクリアしたことになるので
                // 他のイベントフラグと合わせてtrueにする
                for (const ev in _valids) {
                    _valids[ev] = true
                }
            } else {
                // initがinvalidの場合、initが発火するのは初回のみなので
                // initのみtrueにしておく
                _valids.init = true
            }
            _value.valid = isValid
            return
        }

        _valids[eventName] = isValid
        _value.valid = isValid && Object.values(_valids).every(bool => bool)
    }

    private set _errorMessage(error:string) {
        this._$el && this._$el.setCustomValidity(error)
    }

    private get _errorMessage():string {
        return this._$el ? this._$el.validationMessage : ''
    }
}