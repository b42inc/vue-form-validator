"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("../Validator");
Validator_1.Validator.defineRule('min', (value, min) => parseFloat(value) >= min, (_value, min) => `値は ${min} 以上にする必要があります。`);
