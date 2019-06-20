"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("../namespace");
function Path(path) {
    return (target, property, descriptor) => {
        Reflect.defineMetadata(namespace_1.default.CONTROLLER_PATH, path || '/', descriptor.value);
    };
}
exports.default = Path;
