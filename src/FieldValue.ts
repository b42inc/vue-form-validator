import Vue from 'vue'
import { FieldValueValidations } from '../@types'
import { WatchOptions } from 'vue/types/umd'

type Errors = {[key:string]: string}

const vm = new Vue()

export class FieldValue {
    name: string
    value!: string
    valid!: boolean
    errors!: Errors
    validations!: FieldValueValidations

    constructor(name:string, initValue:string, validations:FieldValueValidations | string[]) {
        this.name = name
        Vue.set(this, 'value', initValue)
        Vue.set(this, 'valid', false)
        Vue.set(this, 'errors', {})
        Vue.set(this, 'validations', {})
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

    watch(exp: 'value' | 'errors' | 'valid' | 'validations',
          callback: (this: any, n: any, o: any) => void,
          options?: WatchOptions):(() => void) {
        return vm.$watch(() => (this[exp]), callback, options)
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

        this.validations = _validations
    }

    getValidations():FieldValueValidations {
        return this.validations
    }

    getValidation(eventName:string):string | string[] {
        return this.validations[eventName]
    }
}