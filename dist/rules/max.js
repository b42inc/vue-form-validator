"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator_1 = require("../Validator");
Validator_1.Validator.defineRule('max', function (value, max) { return parseFloat(value) <= max; }, function (_value, max) { return "\u5024\u306F " + max + " \u4EE5\u4E0B\u306B\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002"; });
