"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let id = 1;
class Messager {
    constructor(app, mpid) {
        this.app = app;
        this._stacks = {};
        this.mpid = mpid;
    }
    parse(id, code, data) {
        if (this._stacks[id]) {
            const callback = this._stacks[id][code];
            if (code === 1 && typeof data === 'string' && !!data)
                data = new Error(data);
            callback(data);
        }
    }
    createAgent(name, file, args) {
        if (!file && typeof name !== 'string') {
            if (!name.__filename || !name.__filepath)
                throw new Error('create agent should provide filename and filepath');
            return this.asyncSend('newAgent', {
                name: name.__filename,
                file: name.__filepath,
                args
            });
        }
        return this.asyncSend('newAgent', {
            name, file, args
        });
    }
    send(method, data, options) {
        if (!options)
            options = this.mpid;
        if (typeof options !== 'object') {
            options = {
                to: options,
            };
        }
        const _id = id++;
        process.send({
            id: _id,
            to: options.to || this.mpid,
            from: process.pid,
            method, data,
        }, options.socket);
        return _id;
    }
    asyncSend(method, data, options) {
        return new Promise((resolve, reject) => {
            const _id = this.send(method, data, options);
            const timeout = typeof options === 'object' ? options.timeout : 20000;
            const timer = setTimeout(() => {
                if (this._stacks[_id]) {
                    delete this._stacks[_id];
                    reject(new Error('ipc request timeout: ' + _id + 'ms'));
                }
            }, timeout);
            const resolver = (value) => {
                clearTimeout(timer);
                delete this._stacks[_id];
                resolve(value);
            };
            const rejecter = (reason) => {
                clearTimeout(timer);
                delete this._stacks[_id];
                reject(reason);
            };
            this._stacks[_id] = [resolver, rejecter];
        });
    }
}
exports.default = Messager;
