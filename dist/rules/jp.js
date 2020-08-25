"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator_1 = require("../Validator");
var REGX_HIRA = /^[\s\u3040-\u309F]+$/;
var REGX_KANA = /^[\s\u30A0-\u30FF]+$/;
Validator_1.Validator.defineRule('hira', function (value) { return REGX_HIRA.test(value); }, 'ひらがな以外の文字が含まれています。');
Validator_1.Validator.defineRule('kana', function (value) { return REGX_KANA.test(value); }, 'カタカナ以外の文字が含まれています。');
