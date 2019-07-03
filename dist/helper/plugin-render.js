"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("../worker/plugin");
const plugin_collect_dependencies_1 = require("./plugin-collect-dependencies");
const find_node_modules_1 = require("./find-node-modules");
function MakeWorkerPluginRender(app) {
    const base = app.base;
    let node_module_paths = find_node_modules_1.default({ cwd: base, relative: false });
    if (!node_module_paths.length)
        throw new Error('cannot find node_modules path');
    const node_module_path = node_module_paths[0];
    async function dispatch(component_path, root) {
        const { name, dependenties } = plugin_collect_dependencies_1.default(component_path, node_module_path, { env: app.env, isWorker: true });
        if (!app.plugins[name])
            app.plugins[name] = new plugin_1.default(app, name, component_path);
        if (!root)
            root = app.plugins[name];
        app.plugins[name].root = root;
        const childrens = await Promise.all(dependenties.map(dep => dispatch(dep, root)));
        app.plugins[name].setComponent(...childrens.map(child => child.name));
        app.compiler.addPlugin(app.plugins[name]);
        return app.plugins[name];
    }
    return dispatch;
}
exports.MakeWorkerPluginRender = MakeWorkerPluginRender;
