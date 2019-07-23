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
    async createAgent(name, file, args) {
        if (!file && typeof name !== 'string') {
            if (!name.__filename || !name.__filepath)
                throw new Error('create agent should provide filename and filepath');
            return this.asyncSend('newAgent', {
                name: name.__filename,
                file: name.__filepath,
                args
            });
        }
        const data = await this.asyncSend('newAgent', {
            name, file, args
        });
        this.send('ready', null, name);
        return data;
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
        const to = options.to || this.mpid;
        const sendData = {
            id: _id,
            to,
            from: process.pid,
            method, data,
        };
        if (this.mpid !== process.pid) {
            process.send(sendData, options.socket);
        }
        else {
            if (typeof to === 'number' && this.app.processer.pids[to]) {
                this.app.processer.pids[to].send(sendData, options.socket);
            }
            else if (typeof to === 'string' && this.app.processer.agents[to]) {
                this.app.processer.agents[to].send(sendData, options.socket);
            }
            else {
                throw new Error('options.to must be a number or a string, but got ' + typeof to + ' in master process');
            }
        }
        return _id;
    }
    asyncSend(method, data, options) {
        return new Promise((resolve, reject) => {
            const _id = this.send(method, data, options);
            const timeout = typeof options === 'object' ? options.timeout : 20000;
            const timer = setTimeout(() => {
                if (this._stacks[_id]) {
                    delete this._stacks[_id];
                    reject(new Error('ipc request timeout: ' + timeout + 'ms'));
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
    asyncHealth() {
        return this.asyncSend('health');
    }
}
exports.default = Messager;
