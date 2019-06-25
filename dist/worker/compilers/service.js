"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globby_1 = require("globby");
const export_1 = require("../../export");
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
        const callback = export_1.Require(file, cwd);
        if (typeof callback === 'function' && callback.name) {
            plugin.service[callback.name] = callback;
        }
    });
}
exports.default = Service;
