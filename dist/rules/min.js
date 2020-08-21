"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator_1 = require("../Validator");
Validator_1.Validator.defineRule('min', function (value, min) { return parseFloat(value) >= min; }, function (_value, min) { return "\u5024\u306F " + min + " \u4EE5\u4E0A\u306B\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002"; });
