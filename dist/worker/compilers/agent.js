"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path = require("path");
const globby_1 = require("globby");
const require_1 = require("../../helper/require");
const namespace_1 = require("../../agent/decorators/namespace");
async function Bootstrap(plugin) {
    const cwd = plugin.source;
    const files = await globby_1.default([
        'agent/**/*.ts',
        'agent/**/*.js',
        '!agent/**/*.d.ts'
    ], { cwd });
    if (files.length) {
        for (let i = 0; i < files.length; i++) {
            const file = path.resolve(cwd, files[i]);
            const callback = require_1.default(file);
            const Auto = Reflect.getMetadata(namespace_1.default.AUTO, callback);
            callback.__filepath = file;
            callback.__filename = callback.name;
            if (Auto) {
                if (!callback.__filename)
                    throw new Error('agent must defined with a name.');
                await plugin.app.messager.createAgent(callback.__filename, callback.__filepath);
            }
        }
    }
}
exports.default = Bootstrap;
