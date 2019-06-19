"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function Prefix(prefix) {
    return (target) => {
        Reflect.defineMetadata('Controller.Router.Prefix', prefix || '/', target);
    };
}
exports.default = Prefix;
