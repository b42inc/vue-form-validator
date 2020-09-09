import { HTMLFieldElement, ValidateFunc, ValidateError, ValidateRuleset } from '../@types';
export declare const Validator: {
    check(code: string, el: HTMLFieldElement): {
        [key: string]: string;
    };
    defineRule(validCode: string, validate: ValidateFunc, error: ValidateError, defaultOptions?: any): void;
    difineRuleset(setCode: string, ruleset: ValidateRuleset[]): void;
};
