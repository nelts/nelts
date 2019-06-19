"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function Path(path) {
    return (target, property, descriptor) => {
        Reflect.defineMetadata('Controller.Router.Path', path || '/', descriptor.value);
    };
}
exports.default = Path;
