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
    get logger() {
        return this.processer.logger;
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
    async health() {
        const agents = Object.keys(this.processer.agents);
        const datas = await Promise.all(agents.map(agent => this._messager.asyncSend('health', null, agent)));
        const result = {};
        datas.forEach((data, index) => result[agents[index]] = data);
        return result;
    }
    notice(data) {
        const workers = this.processer.workers;
        workers.forEach(worker => {
            const pid = worker.pid;
            this.logger.info('send', '__master:notice__', 'commander to worker');
            this.messager.send('__master:notice__', data, {
                to: pid
            });
        });
    }
    async componentWillCreate() {
        this._forker = this.createWorkerForker(workScriptFilename, { base: this._base, config: this._config, port: this._port });
    }
    async componentDidCreated() {
        for (let i = 0; i < this._max; i++) {
            this.logger.info('forking worker...');
            const worker = await this._forker();
            this.logger.info(`worker [pid:${worker.pid}] forked.\n\n`);
        }
        const firstWorker = this.processer.workers[0];
        firstWorker.send({
            id: -1,
            to: firstWorker.pid,
            from: process.pid,
            method: '__master:done__',
        });
    }
    componentCatchError(err) {
        this.logger.error(err);
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
        if (!message.method)
            return this.messager.parse(message.id, message.code, message.data);
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
            case 'health':
                this.health().then(data => reply({ code: 0, data })).catch(e => reply({ code: 1, message: e.message }));
                break;
            case 'notice':
                this.logger.info('master receive notice message', message.data);
                this.notice(message.data);
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
                data: data.data || data.message,
                code: data.code,
            }, socket);
        };
    }
}
exports.default = Master;
