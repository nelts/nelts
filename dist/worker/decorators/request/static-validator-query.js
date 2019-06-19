"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("../namespace");
const ajv_string_formater_1 = require("../../../helper/ajv-string-formater");
function StaticValidatorQuery(...args) {
    const types = ajv_string_formater_1.default(args);
    return (target, property, descriptor) => {
        Reflect.defineMetadata(namespace_1.default.CONTROLLER_STATIC_VALIDATOR_QUERY, types, descriptor.value);
    };
}
exports.default = StaticValidatorQuery;
