"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("./namespace");
function Response(...args) {
    return (target, property, descriptor) => {
        let responses = Reflect.getMetadata(namespace_1.default.CONTROLLER_RESPONSE, descriptor.value);
        if (!responses)
            responses = [];
        responses.unshift(...args);
        Reflect.defineMetadata(namespace_1.default.CONTROLLER_RESPONSE, responses, descriptor.value);
    };
}
exports.default = Response;
