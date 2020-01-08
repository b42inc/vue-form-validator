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

    constructor(name:string, initValue:string, validations:FieldValueValidations | string[]) {
        this.name = name
        this._vm = new Vue({
            data: {
                value: initValue,
                valid: false,
                errors: {},
                validations: {}
            }
        })

        this.setValidations(validations)
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
        return !!this.getValidation(eventName)
    }

    watch(expOrFn: string, callback: (this: any, n: any, o: any) => void, options?: WatchOptions):(() => void) {
        return this._vm.$watch(expOrFn, callback, options)
    }

    // validations はset時の引数に幅があり、getの返り値と乖離があるので、getter/setterでなくmethodにする
    setValidations(validations:FieldValueValidations | string[]) {
        const _validations:FieldValueValidations = {}

        if (Array.isArray(validations)) {
            validations.forEach(eventName => _validations[eventName] = [])
        } else {
            for (const eventName in validations) {
                const code = validations[eventName]
                _validations[eventName] = code ? (typeof code === 'string' ? [code] : code) : []
            }
        }

        // init event がある場合 その他含むすべてのvalidationを通す
        if (_validations.init) {
            _validations.init = Array.from(new Set(Object.values(_validations).flat(1)))
        }

        this._vm.validations = _validations
    }

    getValidations():FieldValueValidations {
        return this._vm.validations
    }

    getValidation(eventName:string):string | string[] {
        return this._vm.validations[eventName]
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
}