"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const globby_1 = require("globby");
const export_1 = require("../../export");
async function Bootstrap(plugin) {
    const cwd = plugin.source;
    const files = await globby_1.default([
        'app.ts',
        'app.js',
        '!app.d.ts'
    ], { cwd });
    if (files.length) {
        const file = path.resolve(cwd, files[0]);
        const callback = export_1.Require(file);
        if (typeof callback === 'function') {
            await callback(plugin);
        }
    }
}
exports.default = Bootstrap;
