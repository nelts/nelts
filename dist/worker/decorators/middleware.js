"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("./namespace");
function Middleware(...args) {
    return (target, property, descriptor) => {
        let middlewares = Reflect.getMetadata(namespace_1.default.CONTROLLER_MIDDLEWARE, descriptor.value);
        if (!middlewares)
            middlewares = [];
        middlewares.unshift(...args);
        Reflect.defineMetadata(namespace_1.default.CONTROLLER_MIDDLEWARE, middlewares, descriptor.value);
    };
}
exports.default = Middleware;
