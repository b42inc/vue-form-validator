import Vue from 'vue'
import { FieldValueValidations } from '../@types'
import { WatchOptions } from 'vue/types/umd'

type Errors = {[key:string]: string}
type ReactValues = {
    value:string
    valid:boolean
    validations: FieldValueValidations
    errors:Errors
}
type _Vue = Vue & ReactValues

export class FieldValue {
    name: string
    private _vm:_Vue

    constructor(name:string, initValue:string, validations:FieldValueValidations) {
        this.name = name
        this._vm = new Vue({
            data: {
                value: initValue,
                valid: false,
                errors: {},
                validations: {}
            }
        })

        this.validations = validations
    }

    resetError() {
        if (this.hasError()) {
            this.errors = {}
        }
    }

    hasError() {
        return !!Object.keys(this.errors).length
    }

    hasEvent(eventName:string) {
        return !!this.validations[eventName]
    }

    watch(expOrFn: string, callback: (this: any, n: any, o: any) => void, options?: WatchOptions):(() => void) {
        return this._vm.$watch(expOrFn, callback, options)
    }

    set value(value:string) {
        this._vm.value = value
    }

    get value():string {
        return this._vm.value
    }

    set valid(value:boolean) {
        this._vm.valid = value
    }

    get valid():boolean {
        return this._vm.valid
    }

    set errors(errors:Errors) {
        this._vm.errors = errors
    }

    get errors():Errors {
        return this._vm.errors
    }

    set validations(validations:FieldValueValidations) {
        const _validations:FieldValueValidations = {}

        for (const eventName in validations) {
            const code = validations[eventName]
            _validations[eventName] = code ? (typeof code === 'string' ? [code] : code) : []
        }

        this._vm.validations = _validations
    }

    get validations() {
        return this._vm.validations
    }
}