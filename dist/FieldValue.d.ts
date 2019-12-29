import { FieldValueValidations } from '../@types';
import { WatchOptions } from 'vue/types/umd';
declare type Errors = {
    [key: string]: string;
};
export declare class FieldValue {
    name: string;
    private _vm;
    constructor(name: string, initValue: string, validations: FieldValueValidations);
    resetError(): void;
    hasError(): boolean;
    hasEvent(eventName: string): boolean;
    watch(expOrFn: string, callback: (this: any, n: any, o: any) => void, options?: WatchOptions): (() => void);
    set value(value: string);
    get value(): string;
    set valid(value: boolean);
    get valid(): boolean;
    set errors(errors: Errors);
    get errors(): Errors;
    set validations(validations: FieldValueValidations);
    get validations(): FieldValueValidations;
}
export {};
