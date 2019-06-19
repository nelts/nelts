"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("../namespace");
function DynamicValidatorBody(schema) {
    return (target, property, descriptor) => {
        Reflect.defineMetadata(namespace_1.default.CONTROLLER_DYNAMIC_VALIDATOR_BODY, schema, descriptor.value);
    };
}
exports.default = DynamicValidatorBody;
