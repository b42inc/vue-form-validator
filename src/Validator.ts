import {
    HTMLFieldElement,
    ValidateFunc,
    ValidateError,
    ValidateRule,
    ValidateRuleset
} from '../@types'

const RULES:{[code:string]:ValidateRule} = {}
const RULESET:{[code:string]:ValidateRuleset[]} = {}

function getError(el:HTMLFieldElement, error:ValidateError, options:any):string {
    switch (typeof error) {
        case 'string':
            return error
        case 'function':
            return error(el.value, options, el)
        default:
            return '未定義のエラーが発生しました。'
    }
}

function extendOptions(defaults:any, override?:any):any {
    const defType = typeof defaults
    const overType = typeof override

    if (Array.isArray(defaults)) {
        override = override || []
        return [...(override.length ? override : defaults)]
    }

    if (defType === 'object' && defaults !== null) {
        override = override || {}
        return {...defaults, ...override}
    }

    return overType !== 'undefined' ? override : defaults
}

function executeRule(el:HTMLFieldElement, ruleset:ValidateRuleset) {
    let rule:ValidateRule, options:any, error:ValidateError;
    
    if (typeof ruleset === 'string') {
        rule = RULES[ruleset]
        options = extendOptions(rule.defaultOptions)
        error = rule.error
    } else {
        const {rule:code, error:overrideError, options:overrideOpts} = ruleset
        rule = RULES[code]
        options = extendOptions(rule.defaultOptions, overrideOpts)
        error = overrideError || rule.error
    }

    return rule.validate(el.value, options) ? null : getError(el, error, options)
}

export const Validator = {
    check(code:string, el:HTMLFieldElement):(null | {msg:String, rule:string})[] {
        const errors:(null | {msg:String, rule:string})[] = []

        if (code === null) {
            return []
        }

        return (RULESET[code] || [code]).reduce((memo, ruleset) => {
            const msg = executeRule(el, ruleset)
            const rule = typeof ruleset === 'string' ? ruleset : ruleset.rule
            if (rule && msg) {
                memo.push({msg, rule})
            }
            return memo
        }, errors)
    },

    defineRule(validCode:string, validate:ValidateFunc, error:ValidateError, defaultOptions?:any) {
        RULES[validCode] = {
            validate,
            error,
            defaultOptions
        }
    },

    difineRuleset(setCode:string, ruleset:ValidateRuleset[]) {
        RULESET[setCode] = ruleset
    }
}