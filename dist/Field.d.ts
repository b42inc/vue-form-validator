import { VNode } from 'vue/types/umd';
import { HTMLFieldElement, FieldOptions, FiledValueValidations } from '../@types';
export declare class FieldValue {
    name: string;
    value: string;
    valid: boolean;
    errors: {
        [key: string]: string;
    };
    _validations: FiledValueValidations;
    constructor(name: string, initValue: string, validations: FiledValueValidations);
    resetError(): void;
    hasError(): boolean;
    set validations(validations: FiledValueValidations);
    get validations(): FiledValueValidations;
    eachValidation(el: HTMLFieldElement, eventName: string, callback: Function): void;
}
export declare class Field {
    private _$el;
    private _vnode;
    private _value;
    private _preventInvalid;
    private _name;
    private _type;
    private _errors;
    private _preventResolve;
    private _preventReject;
    private _validEvent;
    constructor(el: HTMLFieldElement, vnode: VNode, value: FieldValue, options?: FieldOptions);
    preventResolve(dynamicErrorMessage: string): void;
    preventReject(): void;
    updateEvent(events: string[]): void;
    dispose(): void;
    get errors(): {
        [x: string]: string;
    };
    get noValidate(): boolean;
    get name(): string;
    get value(): string;
    set value(value: string);
    private _on;
    private _off;
    private _onValidate;
    private _prepareValidate;
    private _check;
    private _reportValidity;
    private _onInvalid;
    private set _errorMessage(value);
    private get _errorMessage();
}
