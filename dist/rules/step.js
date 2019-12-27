"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("../Validator");
function round(v) {
    return Math.round(v * 10000) / 10000;
}
Validator_1.Validator.defineRule('step', (value, num) => parseFloat(value) % parseFloat(num) === 0, (value, num) => {
    const _v = parseFloat(value);
    const _n = parseFloat(num);
    const prev = _v - (_v % _n) || 0;
    const next = Math.ceil(_v / _n) * _n || 0;
    return `有効な値を入力してください。有効な値として最も近いのは ${round(prev)} と ${round(next)} です。`;
});
