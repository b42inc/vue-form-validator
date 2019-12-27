import Vue from 'vue'
import { Validator } from './Validator'
import { HTMLFieldElement, FieldValueValidations } from '../@types'

export class FieldValue {
    name: string
    value: string = ''
    valid: boolean = false
    errors: {[key:string]: string} = {}
    _validations: FieldValueValidations = {}

    constructor(name:string, initValue:string, validations:FieldValueValidations) {
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

    set validations(validations:FieldValueValidations) {
        const _validations:FieldValueValidations = {}

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