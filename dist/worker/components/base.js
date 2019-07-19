"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Base {
    constructor(plugin) {
        this.app = plugin;
    }
    get logger() {
        return this.app.logger;
    }
    get messager() {
        return this.app.app.messager;
    }
    send(method, data, options) {
        return this.messager.send(method, data, options);
    }
    asyncSend(method, data, options) {
        return this.messager.asyncSend(method, data, options);
    }
    asyncHealth() {
        return this.messager.asyncHealth();
    }
}
exports.default = Base;
