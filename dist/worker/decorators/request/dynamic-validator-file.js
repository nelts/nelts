"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("../namespace");
function DynamicValidatorFile(schema) {
    return (target, property, descriptor) => {
        Reflect.defineMetadata(namespace_1.default.CONTROLLER_DYNAMIC_VALIDATOR_FILE, schema, descriptor.value);
    };
}
exports.default = DynamicValidatorFile;
