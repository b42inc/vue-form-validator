import { Validator } from '../Validator';
const REGX_NUMBER = /^\-?\d+(\.\d+)?$/;
const REGX_FLOAT = /^(\-?\d+)?\.(\d+)?$/;
const REGX_INT = /^\-?\d+$/;
const REGX_UINT = /^\d+$/;
Validator.defineRule('number', (value) => REGX_NUMBER.test(value), '数字以外の文字が含まれています。');
Validator.defineRule('float', (value) => REGX_FLOAT.test(value), '浮動小数点以外が含まれています。');
Validator.defineRule('int', (value) => REGX_INT.test(value), '整数以外が含まれています。');
Validator.defineRule('uint', (value) => REGX_UINT.test(value), '符号なし整数以外が含まれています。');
