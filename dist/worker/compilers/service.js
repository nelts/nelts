"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globby_1 = require("globby");
const require_1 = require("../../helper/require");
async function Service(plugin) {
    const cwd = plugin.source;
    const files = await globby_1.default([
        'service/**/*.ts',
        'service/**/*.js',
        '!service/**/*.d.ts'
    ], { cwd });
    if (!plugin.service)
        plugin.service = {};
    files.forEach(file => {
        const callback = require_1.default(file, cwd);
        if (typeof callback === 'function' && callback.name) {
            plugin.service[callback.name] = callback;
        }
    });
}
exports.default = Service;
