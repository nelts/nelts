"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
function Require(pather, cwd) {
    const moduleExports = path.isAbsolute(pather)
        ? require(pather)
        : require(path.resolve(cwd || process.cwd(), pather));
    return moduleExports.__esModule && moduleExports.default ? moduleExports.default : moduleExports;
}
exports.default = Require;
