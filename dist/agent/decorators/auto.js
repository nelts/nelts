"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const namespace_1 = require("./namespace");
exports.default = (target => Reflect.defineMetadata(namespace_1.default.AUTO, true, target));
