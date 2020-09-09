"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = exports.Field = exports.FieldValue = void 0;
var valid_1 = __importDefault(require("./directives/valid"));
var Field_1 = require("./Field");
Object.defineProperty(exports, "Field", { enumerable: true, get: function () { return Field_1.Field; } });
var FieldValue_1 = require("./FieldValue");
Object.defineProperty(exports, "FieldValue", { enumerable: true, get: function () { return FieldValue_1.FieldValue; } });
var Validator_1 = require("./Validator");
Object.defineProperty(exports, "Validator", { enumerable: true, get: function () { return Validator_1.Validator; } });
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
