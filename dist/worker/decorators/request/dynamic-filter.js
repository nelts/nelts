"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("../namespace");
function DynamicFilter(...args) {
    return (target, property, descriptor) => {
        let filters = Reflect.getMetadata(namespace_1.default.CONTROLLER_DYNAMIC_FILTER, descriptor.value);
        if (!filters)
            filters = [];
        filters.unshift(...args);
        Reflect.defineMetadata(namespace_1.default.CONTROLLER_DYNAMIC_FILTER, filters, descriptor.value);
    };
}
exports.default = DynamicFilter;
