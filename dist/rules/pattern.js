"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator_1 = require("../Validator");
Validator_1.Validator.defineRule('pattern', function (value, regx) { return regx.test(value); }, '指定されている形式で入力してください。');
