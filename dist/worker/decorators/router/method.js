"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("../namespace");
function Method(method) {
    return (target, property, descriptor) => {
        let methods = Reflect.getMetadata(namespace_1.default.CONTROLLER_METHOD, descriptor.value);
        if (!methods)
            methods = [];
        methods.push(method || 'GET');
        Reflect.defineMetadata(namespace_1.default.CONTROLLER_METHOD, methods, descriptor.value);
    };
}
exports.default = Method;
