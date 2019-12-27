"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("../Validator");
Validator_1.Validator.defineRule('maxlength', (value, max) => value.length <= max, (value, max) => `このテキストを ${max} 文字以下にしてください（現時点で ${value.length} 文字です）。`);
