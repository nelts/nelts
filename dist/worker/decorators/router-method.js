"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function Method(method) {
    return (target, property, descriptor) => {
        let methods = Reflect.getMetadata('Controller.Router.Method', descriptor.value);
        if (!methods)
            methods = [];
        methods.push(method || 'GET');
        Reflect.defineMetadata('Controller.Router.Method', methods, descriptor.value);
    };
}
exports.default = Method;
