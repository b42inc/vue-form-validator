"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator_1 = require("../Validator");
Validator_1.Validator.defineRule('minlength', function (value, min) { return value.length >= min; }, function (value, min) { return "\u3053\u306E\u30C6\u30AD\u30B9\u30C8\u3092 " + min + " \u6587\u5B57\u4EE5\u4E0A\u306B\u3057\u3066\u304F\u3060\u3055\u3044\uFF08\u73FE\u6642\u70B9\u3067 " + value.length + " \u6587\u5B57\u3067\u3059\uFF09\u3002"; });
