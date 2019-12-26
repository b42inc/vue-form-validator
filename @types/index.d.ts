import { VNode } from "vue/types/umd"

export type HTMLFieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

export type FieldOptions = {
    validEvent?: string[],
    preventInvalid?: boolean
}

export type FiledValueValidations = {[eventName:string]:string | string[]}

export type ValidateFunc = (value:string, options?:any) => boolean

export type ValidateError = string | ((value:string, options:any, el:HTMLFieldElement) => string)

export type ValidateRule = {
    validate:ValidateFunc,
    error:ValidateError,
    defaultOptions:any
}

export type ValidateRuleset = string | {
    rule:string,
    error?:ValidateError,
    options?:any
}

export interface Validator {
    check(code:string, el:HTMLFieldElement):(null | {msg:String, rule:string})[]
    defineRule(validCode:string, validate:ValidateFunc, error:ValidateError, defaultOptions?:any):void
    difineRuleset(setCode:string, ruleset:ValidateRuleset[]):void
}

export declare class FieldValue {
    name: string
    value: string
    valid: boolean
    errors: {[key:string]: string}
    validations:FiledValueValidations
    resetError():void
    hasError():boolean
    eachValidation(el:HTMLFieldElement, eventName:string, callback:Function):void
}

export declare class Field {
    constructor(el:HTMLFieldElement, vnode:VNode, value:FieldValue, options?:FieldOptions)
    value:string
    name:string
    noValidate:boolean
    errors:{[key:string]:string}
    preventResolve(dynamicErrorMessage:string):void
    preventReject():void
    updateEvent(events:string[]):void
    dispose():void
}