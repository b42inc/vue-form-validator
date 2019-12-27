"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("../Validator");
Validator_1.Validator.defineRule('max', (value, max) => parseFloat(value) <= max, (_value, max) => `値は ${max} 以下にする必要があります。`);
