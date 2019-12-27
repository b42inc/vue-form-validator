import { HTMLFieldElement, ValidateFunc, ValidateError, ValidateRuleset } from '../@types';
export declare const Validator: {
    check(code: string, el: HTMLFieldElement): ({
        msg: String;
        rule: string;
    } | null)[];
    defineRule(validCode: string, validate: ValidateFunc, error: ValidateError, defaultOptions?: any): void;
    difineRuleset(setCode: string, ruleset: ValidateRuleset[]): void;
};
