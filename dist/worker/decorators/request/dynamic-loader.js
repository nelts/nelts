"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("../namespace");
function DynamicLoader(...args) {
    return (target, property, descriptor) => {
        let loaders = Reflect.getMetadata(namespace_1.default.CONTROLLER_DYNAMIC_LOADER, descriptor.value);
        if (!loaders)
            loaders = [];
        loaders.unshift(...args);
        Reflect.defineMetadata(namespace_1.default.CONTROLLER_DYNAMIC_LOADER, loaders, descriptor.value);
    };
}
exports.default = DynamicLoader;
