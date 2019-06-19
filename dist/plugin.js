"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const emitter = require("events");
class Plugin extends emitter.EventEmitter {
    constructor(app, name, cwd) {
        super();
        this._app = app;
        this._name = name;
        this._cwd = cwd;
        this._service = {};
        this._source = app.env.indexOf('dev') === 0
            ? path.resolve(cwd, 'src')
            : path.resolve(cwd, 'dist');
        this._env = app.env;
        this._components = [];
        this.setMaxListeners(Infinity);
    }
    get service() {
        return this._service;
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
}
exports.default = Plugin;
