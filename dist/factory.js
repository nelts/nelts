"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const process_1 = require("@nelts/process");
const export_1 = require("./export");
const compiler_1 = require("./compiler");
class Factory extends process_1.Component {
    constructor(processer, args) {
        super(processer, args);
        this._configs = {};
        this._plugins = {};
        this.compiler = new compiler_1.default();
        this._base = args.base ? path.resolve(args.base || '.') : args.cwd;
        this._env = args.env;
        if (args.config) {
            this._configs = export_1.Require(args.config, this._base);
        }
    }
    get base() {
        return this._base;
    }
    get env() {
        return this._env;
    }
    get plugins() {
        return this._plugins;
    }
    get configs() {
        return this._configs;
    }
}
exports.default = Factory;
