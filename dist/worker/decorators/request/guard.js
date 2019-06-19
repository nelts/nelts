"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("../namespace");
function Guarder(...args) {
    return (target, property, descriptor) => {
        let guards = Reflect.getMetadata(namespace_1.default.CONTROLLER_GUARD, descriptor.value);
        if (!guards)
            guards = [];
        guards.unshift(...args);
        Reflect.defineMetadata(namespace_1.default.CONTROLLER_GUARD, guards, descriptor.value);
    };
}
exports.default = Guarder;
