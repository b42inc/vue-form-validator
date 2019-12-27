"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("../Validator");
const REGX_URL_SAFETY = /^[-._~a-zA-Z0-9]+$/;
const REGX_HALF_STRING = /^[\x01-\x7E]+$/;
const REGX_FULL_STRING = /^[^\x01-\x7E]+$/;
Validator_1.Validator.defineRule('url-safety-string', (value) => REGX_URL_SAFETY.test(value), '指定されている形式で入力してください。');
Validator_1.Validator.defineRule('custom-string', (value, { lowercase, uppercase, number, synbol }) => {
    const pattern = (synbol || '') + (number || '') + (uppercase || '') + (lowercase || '');
    const regx = new RegExp(`^[${pattern}]+$`);
    return regx.test(value);
}, '指定されている形式で入力してください。', {
    lowercase: 'a-z',
    uppercase: 'A-Z',
    number: '0-9',
    synbol: '!"#$%&\'()*+,–.\\/:;<=>?@[]^_`{|}~'
});
Validator_1.Validator.defineRule('half-string', (value) => REGX_HALF_STRING.test(value), '半角文字以外の文字が含まれています。');
Validator_1.Validator.defineRule('full-string', (value) => REGX_FULL_STRING.test(value), '全角文字以外の文字が含まれています。');
