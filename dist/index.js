"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var valid_1 = __importDefault(require("./directives/valid"));
var Field_1 = require("./Field");
exports.Field = Field_1.Field;
var FieldValue_1 = require("./FieldValue");
exports.FieldValue = FieldValue_1.FieldValue;
var Validator_1 = require("./Validator");
exports.Validator = Validator_1.Validator;
require("./rules/jp");
require("./rules/max");
require("./rules/maxlength");
require("./rules/min");
require("./rules/minlength");
require("./rules/number");
require("./rules/pattern");
require("./rules/required");
require("./rules/step");
require("./rules/string");
require("./rules/tel");
exports.default = {
    install: function (Vue) {
        valid_1.default(Vue);
    }
};
