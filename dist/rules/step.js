"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator_1 = require("../Validator");
function round(v) {
    return Math.round(v * 10000) / 10000;
}
Validator_1.Validator.defineRule('step', function (value, num) { return parseFloat(value) % parseFloat(num) === 0; }, function (value, num) {
    var _v = parseFloat(value);
    var _n = parseFloat(num);
    var prev = _v - (_v % _n) || 0;
    var next = Math.ceil(_v / _n) * _n || 0;
    return "\u6709\u52B9\u306A\u5024\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u6709\u52B9\u306A\u5024\u3068\u3057\u3066\u6700\u3082\u8FD1\u3044\u306E\u306F " + round(prev) + " \u3068 " + round(next) + " \u3067\u3059\u3002";
});
