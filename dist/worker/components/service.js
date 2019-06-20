"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Service extends base_1.default {
    constructor(plugin) {
        super(plugin);
    }
    get service() {
        return this.app.service;
    }
    getComponentServiceByName(name) {
        const plugin = this.app.getComponent(name);
        return plugin.service;
    }
}
exports.default = Service;
