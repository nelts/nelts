"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globby_1 = require("globby");
const require_1 = require("../../helper/require");
async function Middleware(plugin) {
    const cwd = plugin.source;
    const files = await globby_1.default([
        'middleware/**/*.ts',
        'middleware/**/*.js',
        '!middleware/**/*.d.ts'
    ], { cwd });
    if (!plugin.middleware)
        plugin.middleware = {};
    files.forEach(file => {
        const callback = require_1.default(file, cwd);
        if (typeof callback === 'function' && callback.name) {
            plugin.middleware[callback.name] = callback;
        }
    });
}
exports.default = Middleware;
