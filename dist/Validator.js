const RULES = {};
const RULESET = {};
function getError(el, error, options) {
    switch (typeof error) {
        case 'string':
            return error;
        case 'function':
            return error(el.value, options, el);
        default:
            return '未定義のエラーが発生しました。';
    }
}
function extendOptions(defaults, override) {
    const defType = typeof defaults;
    const overType = typeof override;
    if (Array.isArray(defaults)) {
        override = override || [];
        return [...(override.length ? override : defaults)];
    }
    if (defType === 'object' && defaults !== null) {
        override = override || {};
        return { ...defaults, ...override };
    }
    return overType !== 'undefined' ? override : defaults;
}
function executeRule(el, ruleset) {
    let rule, options, error;
    if (typeof ruleset === 'string') {
        rule = RULES[ruleset];
        options = extendOptions(rule.defaultOptions);
        error = rule.error;
    }
    else {
        const { rule: code, error: overrideError, options: overrideOpts } = ruleset;
        rule = RULES[code];
        options = extendOptions(rule.defaultOptions, overrideOpts);
        error = overrideError || rule.error;
    }
    return rule.validate(el.value, options) ? null : getError(el, error, options);
}
export const Validator = {
    check(code, el) {
        const errors = [];
        if (code === null) {
            return [];
        }
        return (RULESET[code] || [code]).reduce((memo, ruleset) => {
            const msg = executeRule(el, ruleset);
            const rule = typeof ruleset === 'string' ? ruleset : ruleset.rule;
            if (rule && msg) {
                memo.push({ msg, rule });
            }
            return memo;
        }, errors);
    },
    defineRule(validCode, validate, error, defaultOptions) {
        RULES[validCode] = {
            validate,
            error,
            defaultOptions
        };
    },
    difineRuleset(setCode, ruleset) {
        RULESET[setCode] = ruleset;
    }
};
