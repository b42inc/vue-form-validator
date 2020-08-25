"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var RULES = {};
var RULESET = {};
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
    var defType = typeof defaults;
    var overType = typeof override;
    if (Array.isArray(defaults)) {
        override = override || [];
        return __spreadArrays((override.length ? override : defaults));
    }
    if (defType === 'object' && defaults !== null) {
        override = override || {};
        return __assign(__assign({}, defaults), override);
    }
    return overType !== 'undefined' ? override : defaults;
}
function executeRule(el, ruleset) {
    var rule, options, error;
    if (typeof ruleset === 'string') {
        rule = RULES[ruleset];
        options = extendOptions(rule.defaultOptions);
        error = rule.error;
    }
    else {
        var code = ruleset.rule, overrideError = ruleset.error, overrideOpts = ruleset.options;
        rule = RULES[code];
        options = extendOptions(rule.defaultOptions, overrideOpts);
        error = overrideError || rule.error;
    }
    return rule.validate(el.value, options) ? null : getError(el, error, options);
}
exports.Validator = {
    check: function (code, el) {
        var errors = {};
        if (code === null) {
            return errors;
        }
        return (RULESET[code] || [code]).reduce(function (errors, ruleset) {
            var msg = executeRule(el, ruleset);
            var rule = typeof ruleset === 'string' ? ruleset : ruleset.rule;
            if (rule && msg) {
                errors[rule] = msg;
            }
            return errors;
        }, errors);
    },
    defineRule: function (validCode, validate, error, defaultOptions) {
        RULES[validCode] = {
            validate: validate,
            error: error,
            defaultOptions: defaultOptions
        };
    },
    difineRuleset: function (setCode, ruleset) {
        RULESET[setCode] = ruleset;
    }
};
