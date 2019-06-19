"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Controller extends base_1.default {
    constructor(plugin) {
        super(plugin);
    }
    getService(name) {
        if (!name)
            return this.app.service;
        const plugin = this.app.getComponent(name);
        return plugin.service;
    }
}
exports.default = Controller;
