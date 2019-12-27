"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("../Validator");
const REGX_TEL = /^0\d{9,10}$/;
Validator_1.Validator.defineRule('tel', (value, allowHyphen) => REGX_TEL.test(allowHyphen ? (value).replace(/-/g, '') : value), '電話番号の形式が正しくありません。10桁または11桁の数字を入力してください。', true);
