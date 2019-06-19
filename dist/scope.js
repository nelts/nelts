"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Scope(callback) {
    const _callback = (plugin) => callback(plugin);
    _callback.scoped = true;
    return _callback;
}
exports.default = Scope;
