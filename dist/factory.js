"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const process_1 = require("@nelts/process");
const require_1 = require("./helper/require");
const compiler_1 = require("./compiler");
class Factory extends process_1.Component {
    constructor(processer, args) {
        super(processer, args);
        this._configs = {};
        this._plugins = {};
        this.compiler = new compiler_1.default();
        this._base = args.base ? path.resolve(args.base || '.') : args.cwd;
        this._env = args.env;
        this._inCommingMessage = args;
        if (args.config) {
            this._configs = require_1.default(args.config, this._base);
        }
    }
    get inCommingMessage() {
        return this._inCommingMessage;
    }
    get logger() {
        return this.processer.logger;
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
