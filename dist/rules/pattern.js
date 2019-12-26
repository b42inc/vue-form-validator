import { Validator } from '../Validator';
Validator.defineRule('pattern', (value, regx) => regx.test(value), '指定されている形式で入力してください。');
