import Vue from 'vue'
import { Validator } from './Validator'
import { VNode } from 'vue/types/umd'
import { HTMLFieldElement, FieldOptions, FiledValueValidations } from '../@types'

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

class Errors {
    private _list:{[key:string]:string} = {}

    add(attr:string, error:string) {
        attr = attr.trim()
        error = error.trim()
        if (attr && error) {
            this._list[attr] = error
        }
    }

    reset() {
        for (const attr in this._list) {
            delete this._list[attr]
        }
    }

    dispose() {
        delete this._list
    }

    get list() {
        return {...this._list}
    }
}

export class FieldValue {
    name: string
    value: string = ''
    valid: boolean = false
    errors: {[key:string]: string} = {}
    _validations: FiledValueValidations = {}

    constructor(name:string, initValue:string, validations:FiledValueValidations) {
        this.name = name
        this.validations = validations
        Vue.set(this, 'value', initValue)
        Vue.set(this, 'errors', {})
        Vue.set(this, 'valid', false)
    }

    resetError() {
        this.errors = {}
    }

    hasError() {
        const { errors } = this
        return errors && !!Object.keys(errors).length
    }

    set validations(validations:FiledValueValidations) {
        const _validations:FiledValueValidations = {}

        for (const eventName in validations) {
            const code = validations[eventName]
            _validations[eventName] = typeof code === 'string' ? [code] : code
        }

        this._validations = _validations
    }

    get validations() {
        return this._validations
    }

    eachValidation(el:HTMLFieldElement, eventName:string, callback:Function) {
        const validations = this.validations[eventName]

        if (!validations || !validations.length) {
            return
        }

        for (let i = 0, len = validations.length, validCode:string, errors:(null | {msg:String, rule:string})[]; i < len; i++) {
            validCode = validations[i]
            errors = Validator.check(validCode, el)
            if (errors && errors.length) {
                errors.forEach(error => error && callback(error.msg, error.rule))                
            }
        }
    }
}

export class Field {
    private _$el: HTMLFieldElement
    private _vnode: VNode
    private _value:FieldValue
    private _preventInvalid: boolean
    private _name:string
    private _type:string
    private _errors:Errors
    private _preventResolve:boolean = false
    private _preventReject:boolean = false
    private _validEvent:string[]

    constructor(el:HTMLFieldElement,
                vnode:VNode,
                value:FieldValue,
                options:FieldOptions = {}) {
        
        const { name, type } = el
       
        this._$el = el
        this._name = name
        this._type = type || ''
        this._vnode = vnode
        this._value = value
        this._preventInvalid = options.preventInvalid || false
        this._errors = new Errors()
        this._validEvent = options.validEvent || ['input', 'change']
        this._onValidate = this._onValidate.bind(this)
        this._onInvalid = this._onInvalid.bind(this)
        this._on()
    }

    //=============================================
    // PUBLIC METHODS
    //=============================================

    preventResolve(dynamicErrorMessage?:string) {
        if (dynamicErrorMessage) {
            this._errorMessage = dynamicErrorMessage
        }
        this._preventResolve = true
    }

    preventReject() {
        this._preventReject = true
    }

    updateEvent(events:string[]) {
        this._off()
        this._validEvent = events
        this._on()
    }

    dispose() {
        this._off()
        this._errors.dispose()

        delete this._$el
        delete this._name
        delete this._type
        delete this._vnode
        delete this._value
        delete this._preventInvalid
        delete this._errors
        delete this._validEvent
        delete this._onValidate
        delete this._onInvalid
    }

    //=============================================
    // GETTER / SETTER
    //=============================================
    get errors() {
        const nativeError = this._errorMessage
        const errors = this._errors

        if (nativeError && !this._$el.validity.customError) {
            const attribute = getNativeAttribute(this._$el)

            if (attribute) {
                errors.add(attribute, nativeError)
            }
        }

        return errors.list
    }

    get noValidate():boolean {
        const { _$el } = this
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
        return this._$el.value
    }

    set value(value:string) {
        this._$el.value = value
    }

    //=============================================
    // PRIVATE METHODS
    //=============================================

    private _on() {
        const { _$el, _validEvent } = this

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

        _validEvent.forEach(eventName => {
            _$el.removeEventListener(eventName, this._onValidate)
        })

        _$el.removeEventListener('invalid', this._onInvalid)
    }

    private _onValidate(e:Event) {
        const { _vnode, _value } = this
        const { type } = e
        const arg:{
            event:Event,
            filed: Field,
            errors:{[x: string]: string} | null
        } = { event: e, filed: this, errors: null }

        this._prepareValidate()
        
        emit(_vnode, `validate:${type}`, arg)
        emit(_vnode, 'validate', arg)

        if (this._check(type)) {
            
            emit(_vnode, `confirm:${type}`, arg)
            emit(_vnode, 'confirm', arg)
            
            if (!this._preventResolve) {
                // validateとconfirmイベント内で動的にvalueを変えることも可能
                _value.value = this.value
                _value.valid = true
                emit(_vnode, 'resolve', arg)
                return
            }
        }

        const errors = this.errors
        arg.errors = errors
        emit(_vnode, 'reject', arg)

        if (!this._preventReject) {
            _value.errors = errors
            _value.valid = false
            this._reportValidity()
        }
    }

    private _prepareValidate() {
        this._errorMessage = ''
        this._errors.reset()
        this._value.resetError()
        this._preventResolve = false
        this._preventReject = false
    }
    
    private _check(eventName:string):boolean {
        const { _$el, _value } = this
        let customError = ''

        if (this.noValidate || !_$el.willValidate) {
            return true
        }

        if (!_$el.checkValidity()) {
            return false
        }

        _value.eachValidation(_$el, eventName, (error:string, attribute:string) => {
            if (error) {
                if (!customError) {
                    customError = error
                }
                this._errors.add(attribute, error)
            }
        })

        this._errorMessage = customError

        return !customError
    }

    /**
     * ネイティブのフォームエラーを表示する
     */
    private _reportValidity() {
        const { _$el } = this

        if (this._preventInvalid) {
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

    private set _errorMessage(error:string) {
        this._$el.setCustomValidity(error)
    }

    private get _errorMessage():string {
        return this._$el.validationMessage
    }
}