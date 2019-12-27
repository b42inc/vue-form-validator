export type HTMLFieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

export type FieldOptions = {
    validEvent?: string[],
    preventInvalid?: boolean
}

export type FieldValueValidations = {[eventName:string]:string | string[]}

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