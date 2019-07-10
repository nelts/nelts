"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const fs = require("fs");
const path = require("path");
const process_1 = require("@nelts/process");
const messager_1 = require("./messager");
__export(require("./export"));
const workScriptFilename = path.resolve(__dirname, './worker/index');
const agentScriptFilename = path.resolve(__dirname, './agent/index');
class Master extends process_1.Component {
    get messager() {
        return this._messager;
    }
    constructor(processer, args) {
        super(processer, args);
        const base = args.base ? path.resolve(args.base || '.') : args.cwd;
        const max = Number(args.max || os.cpus().length);
        if (!fs.existsSync(base))
            throw new Error('base cwd is not exists.');
        this._base = base;
        this._port = Number(args.port || 8080);
        this._config = args.config;
        this._max = max;
        this._messager = new messager_1.default(this, args.mpid);
    }
    async componentWillCreate() {
        this._forker = this.createWorkerForker(workScriptFilename, { base: this._base, config: this._config, port: this._port });
    }
    async componentDidCreated() {
        for (let i = 0; i < this._max; i++) {
            console.info('forking worker...');
            const worker = await this._forker();
            console.info(`worker [pid:${worker.pid}] forked.\n\n`);
        }
        this.processer.workers[0].send({
            id: -1,
            to: this.processer.workers[0].pid,
            from: process.pid,
            method: '__master:done__',
        });
    }
    componentCatchError(err) {
        console.error(err);
    }
    componentReceiveMessage(message, socket) {
        const to = message.to;
        switch (to) {
            case this.messager.mpid:
                this.masterMessageConvert(message, socket);
                break;
            default:
                if (typeof to === 'string') {
                    if (!this.processer.agents[to])
                        throw new Error('cannot find the agent name of ' + to);
                    this.processer.agents[to].send(message, socket);
                }
                else if (typeof to === 'number') {
                    if (!this.processer.pids[to])
                        throw new Error('cannot find the process pid of ' + to);
                    this.processer.pids[to].send(message, socket);
                }
                else {
                    throw new Error('message.to is invaild type, only can be string or number.');
                }
        }
    }
    masterMessageConvert(message, socket) {
        const reply = this.createReply(message, socket);
        switch (message.method) {
            case 'newAgent':
                if (this.processer.agents[message.data.name]) {
                    reply({ code: 0, time: 0 });
                }
                else {
                    const startCreateAgentTime = Date.now();
                    this.createAgent(message.data.name, agentScriptFilename, Object.assign(message.data.args || {}, {
                        base: this._base,
                        config: this._config,
                        file: message.data.file,
                        name: message.data.name,
                        mpid: this.messager.mpid,
                    }))
                        .then(() => reply({ code: 0, time: Date.now() - startCreateAgentTime }))
                        .catch(e => reply({ code: 1, message: e.message, time: Date.now() - startCreateAgentTime }));
                }
                break;
            default: throw new Error('cannot find the master.message.convert:' + message.method);
        }
    }
    createReply(message, socket) {
        const from = this.processer.pids[message.from];
        if (!from)
            throw new Error('cannot find the process of ' + message.from);
        return (data) => {
            from.send({
                id: message.id,
                to: message.from,
                from: process.pid,
                data,
                code: data.code,
            }, socket);
        };
    }
}
exports.default = Master;
