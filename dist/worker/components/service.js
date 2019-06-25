"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Service extends base_1.default {
    constructor(ctx) {
        super(ctx.app);
        this.ctx = ctx;
    }
    get service() {
        return this.app.service;
    }
    getComponentServiceByName(name, serviceName) {
        const plugin = this.app.getComponent(name);
        if (!serviceName)
            return plugin.service;
        return new plugin.service[serviceName](this.ctx);
    }
}
exports.default = Service;
