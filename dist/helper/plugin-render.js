"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const plugin_collect_dependencies_1 = require("./plugin-collect-dependencies");
const plugin_1 = require("../plugin");
function MakePluginRender(app, isWorker) {
    const base = app.base;
    const node_module_path = path.resolve(base, 'node_modules');
    if (!fs.existsSync(node_module_path))
        throw new Error('cannot find node_modules path');
    async function dispatch(component_path) {
        const { name, dependenties } = plugin_collect_dependencies_1.default(component_path, node_module_path, { env: app.env, isWorker });
        if (!app.plugins[name])
            app.plugins[name] = new plugin_1.default(app, name, component_path);
        const childrens = await Promise.all(dependenties.map(dep => dispatch(dep)));
        app.plugins[name].setComponent(...childrens.map(child => child.name));
        app.compiler.addPlugin(app.plugins[name]);
        return app.plugins[name];
    }
    return dispatch;
}
exports.default = MakePluginRender;
