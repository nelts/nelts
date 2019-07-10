"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("../namespace");
function Prefix(prefix) {
    return target => Reflect.defineMetadata(namespace_1.default.CONTROLLER_PREFIX, prefix || '/', target);
}
exports.default = Prefix;
