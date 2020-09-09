import { VNode } from 'vue/types/umd';
import { HTMLFieldElement, FieldOptions } from '../@types';
import { FieldValue } from './FieldValue';
export declare class Field {
    private _$el;
    private _vnode;
    private _value;
    private _preventInvalid;
    private _name;
    private _preventResolve;
    private _preventReject;
    private _validEvent;
    private _valids;
    private _unwatches;
    private _tempErrors;
    constructor(el: HTMLFieldElement, vnode: VNode, value: FieldValue, options?: FieldOptions);
    preventResolve(dynamicErrorMessage?: string): void;
    preventReject(): void;
    update(vnode: VNode, value: FieldValue): void;
    dispose(): void;
    get noValidate(): boolean;
    get name(): string;
    get value(): string;
    set value(value: string);
    private _initEvent;
    private _on;
    private _off;
    private _onValidate;
    private _prepareValidate;
    private _checkValidity;
    private _reportValidity;
    private _onInvalid;
    private _updateValid;
    private set _errorMessage(value);
    private get _errorMessage();
}
