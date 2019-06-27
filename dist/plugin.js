"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const events_1 = require("./helper/events");
const export_1 = require("./export");
const fs = require("fs");
class Plugin extends events_1.default {
    constructor(app, name, cwd) {
        super();
        this._components = [];
        this._app = app;
        this._name = name;
        this._cwd = cwd;
        this._env = app.env;
        this._source = this._findSource(cwd);
    }
    _findSource(cwd) {
        const packageFilePath = path.resolve(cwd, 'package.json');
        if (!fs.existsSync(packageFilePath))
            return cwd;
        const packageExports = export_1.Require(packageFilePath);
        if (!packageExports.source)
            return cwd;
        return path.resolve(cwd, packageExports.source);
    }
    get configs() {
        return this._configs;
    }
    get server() {
        return this._app.server;
    }
    get app() {
        return this._app;
    }
    get name() {
        return this._name;
    }
    get cwd() {
        return this._cwd;
    }
    get env() {
        return this._env;
    }
    get source() {
        return this._source;
    }
    isDepended(name) {
        if (!this._components.length)
            return;
        if (this._components.indexOf(name) > -1)
            return true;
        for (let i = 0; i < this._components.length; i++) {
            const component = this.getComponent(this._components[i]);
            const res = component.isDepended(name);
            if (res)
                return true;
        }
    }
    addCompiler(compiler) {
        this._app.compiler.addCompiler(compiler);
        return this;
    }
    setComponent(...deps) {
        deps.forEach(dep => {
            if (this._components.indexOf(dep) === -1) {
                this._components.push(dep);
            }
        });
    }
    getComponent(name) {
        if (this._components.indexOf(name) === -1)
            throw new Error(`${name} is not depended on ${this.name}`);
        return this._app.plugins[name];
    }
    async props(configs) {
        this._configs = typeof configs === 'object'
            ? Object.freeze(configs)
            : configs;
        await this.emit('props', this._configs);
    }
    async broadcast(name, ...args) {
        await this.emit(name, ...args);
        for (let i = 0; i < this._components.length; i++) {
            const componentName = this._components[i];
            const plugin = this._app.plugins[componentName];
            if (plugin)
                await plugin.broadcast(name, ...args);
        }
    }
}
exports.default = Plugin;
