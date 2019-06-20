"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const export_1 = require("../export");
function Collect(cwd, node_module_path, options) {
    const packageFilename = path.resolve(cwd, 'package.json');
    if (!fs.existsSync(packageFilename))
        throw new Error('connot find package.json');
    const packageExports = export_1.Require(packageFilename);
    if (!packageExports.plugin)
        packageExports.plugin = {};
    const moduleName = packageExports.name;
    const result = [];
    for (const packageName in packageExports.plugin) {
        const config = packageExports.plugin[packageName];
        let item;
        if (config.enable === undefined)
            config.enable = true;
        if (!config.enable)
            continue;
        if (config.env === undefined)
            config.env = [];
        if (!Array.isArray(config.env))
            config.env = [config.env];
        if (config.env.length && config.env.indexOf(options.env) === -1)
            continue;
        if (options.isWorker && !config.worker)
            continue;
        if (!options.isWorker) {
            if (config.agent === undefined)
                config.agent = [];
            if (!Array.isArray(config.agent))
                config.agent = [config.agent];
            if (config.agent.length && config.agent.indexOf(options.agentName) === -1)
                continue;
        }
        if (config.path) {
            if (!path.isAbsolute(config.path))
                config.path = path.resolve(cwd, config.path);
            item = config.path;
        }
        else {
            const packageModulePath = path.resolve(node_module_path, packageName);
            if (!fs.existsSync(packageModulePath))
                throw new Error('cannot find the module of `' + packageName + '`');
            item = packageModulePath;
        }
        result.push(item);
    }
    return {
        name: moduleName,
        dependenties: result
    };
}
exports.default = Collect;
