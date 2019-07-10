"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Agent {
    constructor(app) {
        this.app = app;
    }
    send(method, data, options) {
        return this.app.messager.send(method, data, options);
    }
    asyncSend(method, data, options) {
        return this.app.messager.asyncSend(method, data, options);
    }
    kill() {
        return this.app.kill(process.pid);
    }
}
exports.default = Agent;
