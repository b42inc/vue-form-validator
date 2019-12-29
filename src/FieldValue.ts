import Vue from 'vue'
import { FieldValueValidations } from '../@types'

type Errors = {[key:string]: string}

export class FieldValue {
    name: string
    value: string = ''
    valid: boolean = false
    errors: Errors  = {}
    private _validations: FieldValueValidations = {}

    constructor(name:string, initValue:string, validations:FieldValueValidations) {
        this.name = name
        this.validations = validations
        Vue.set(this, 'value', initValue)
        Vue.set(this, 'valid', this.valid)
        Vue.set(this, 'errors', this.errors)
    }

    resetError() {
        this.errors = {}
    }

    hasError() {
        return !!Object.keys(this.errors).length
    }

    hasEvent(eventName:string) {
        return !!this.validations[eventName]
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
}