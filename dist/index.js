"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Directive = exports.Validator = exports.Field = exports.FieldValue = void 0;
var valid_1 = __importStar(require("./directives/valid"));
Object.defineProperty(exports, "Directive", { enumerable: true, get: function () { return valid_1.Directive; } });
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
exports.default = { install: valid_1.default };
