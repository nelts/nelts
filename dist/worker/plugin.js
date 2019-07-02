"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("../plugin");
class WorkerPlugin extends plugin_1.default {
    constructor(app, name, cwd) {
        super(app, name, cwd);
        this.service = {};
        this.middleware = {};
    }
    get server() {
        return this.app.server;
    }
    getComponent(name) {
        return super._getComponent(name);
    }
}
exports.default = WorkerPlugin;
