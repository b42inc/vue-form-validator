"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("../Validator");
Validator_1.Validator.defineRule('pattern', (value, regx) => regx.test(value), '指定されている形式で入力してください。');
