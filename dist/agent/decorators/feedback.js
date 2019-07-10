"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("./namespace");
exports.default = (target, property, descriptor) => Reflect.defineMetadata(namespace_1.default.FEEDBACK, true, descriptor.value);
