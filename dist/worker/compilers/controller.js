"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const path = require("path");
const globby_1 = require("globby");
const context_1 = require("../context");
async function Controller(plugin) {
    const cwd = plugin.source;
    const files = await globby_1.default([
        'app/controller/**/*.ts',
        'app/controller/**/*.js',
        '!app/controller/**/*.d.ts',
    ], { cwd });
    files.forEach((file) => render(plugin, path.resolve(cwd, file)));
}
exports.default = Controller;
function render(plugin, file) {
    const fileExports = require(file).default;
    const controllerPrefix = Reflect.getMetadata('Controller.Router.Prefix', fileExports) || '/';
    const controllerProperties = Object.getOwnPropertyNames(fileExports.prototype);
    const app = plugin.app;
    for (let i = 0; i < controllerProperties.length; i++) {
        const property = controllerProperties[i];
        const target = fileExports.prototype[property];
        if (property === 'constructor')
            continue;
        const paths = Reflect.getMetadata('Controller.Router.Path', target) || '/';
        const methods = Reflect.getMetadata('Controller.Router.Method', target) || [];
        if (!methods.length)
            continue;
        const CurrentRouterPath = !paths.startsWith('/') ? '/' + paths : paths;
        const CurrentRouterPrefix = controllerPrefix.endsWith('/')
            ? controllerPrefix.substring(0, controllerPrefix.length - 1)
            : controllerPrefix;
        app.router.on(methods, CurrentRouterPrefix + CurrentRouterPath, (req, res, params) => {
            const ctx = context_1.ContextProxy(new context_1.default(plugin, req, res, params));
            res.end('ok');
        });
    }
}
