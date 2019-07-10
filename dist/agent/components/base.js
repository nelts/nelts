"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Agent {
    constructor(app) {
        this.app = app;
    }
    get messager() {
        return this.app.messager;
    }
    send(method, data, options) {
        return this.messager.send(method, data, options);
    }
    asyncSend(method, data, options) {
        return this.messager.asyncSend(method, data, options);
    }
    kill() {
        return this.app.kill(process.pid);
    }
}
exports.default = Agent;
