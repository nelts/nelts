"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const router_method_1 = require("./router-method");
const router_path_1 = require("./router-path");
function Get(path) {
    return (target, property, descriptor) => {
        path && router_path_1.default(path)(target, property, descriptor);
        router_method_1.default('GET')(target, property, descriptor);
    };
}
exports.default = Get;
