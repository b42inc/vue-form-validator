import { FieldValueValidations } from '../@types';
import { WatchOptions } from 'vue/types/umd';
declare type Errors = {
    [key: string]: string;
};
export declare class FieldValue {
    name: string;
    value: string;
    valid: boolean;
    errors: Errors;
    validations: FieldValueValidations;
    constructor(name: string, initValue: string, validations: FieldValueValidations | string[]);
    resetError(): void;
    hasError(): boolean;
    hasEvent(eventName: string): boolean;
    watch(exp: 'value' | 'errors' | 'valid' | 'validations', callback: (this: any, n: any, o: any) => void, options?: WatchOptions): (() => void);
    setValidations(validations: FieldValueValidations | string[]): void;
    getValidations(): FieldValueValidations;
    getValidation(eventName: string): string | string[];
}
export {};
