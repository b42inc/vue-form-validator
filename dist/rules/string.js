"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator_1 = require("../Validator");
var REGX_URL_SAFETY = /^[-._~a-zA-Z0-9]+$/;
var REGX_HALF_STRING = /^[\x01-\x7E]+$/;
var REGX_FULL_STRING = /^[^\x01-\x7E]+$/;
Validator_1.Validator.defineRule('url-safety-string', function (value) { return REGX_URL_SAFETY.test(value); }, '指定されている形式で入力してください。');
Validator_1.Validator.defineRule('custom-string', function (value, _a) {
    var lowercase = _a.lowercase, uppercase = _a.uppercase, number = _a.number, synbol = _a.synbol;
    var pattern = (synbol || '') + (number || '') + (uppercase || '') + (lowercase || '');
    var regx = new RegExp("^[" + pattern + "]+$");
    return regx.test(value);
}, '指定されている形式で入力してください。', {
    lowercase: 'a-z',
    uppercase: 'A-Z',
    number: '0-9',
    synbol: '!"#$%&\'()*+,–.\\/:;<=>?@[]^_`{|}~'
});
Validator_1.Validator.defineRule('half-string', function (value) { return REGX_HALF_STRING.test(value); }, '半角文字以外の文字が含まれています。');
Validator_1.Validator.defineRule('full-string', function (value) { return REGX_FULL_STRING.test(value); }, '全角文字以外の文字が含まれています。');
